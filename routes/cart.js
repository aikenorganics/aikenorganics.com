'use strict'

const db = require('../db')
const {Location, Order, Product} = require('../db')
const updateMail = require('../mail/orders/update')
const {all, get, post} = require('koa-route')

module.exports = [

  all('/cart', async (_, next) => {
    const {currentUser, open} = _.state
    if (!currentUser || !open) return _.unauthorized()
    await next()
  }, {end: false}),

  // Index
  get('/cart', async (_) => {
    const {cart, currentUser} = _.state
    const [products, locations, order] = await Promise.all([
      Product
        .include('category', 'grower')
        .where({id: cart.ids})
        .order('name').all(),
      Location.where({active: true}).order('name').all(),
      Order.where({status: 'open', userId: currentUser.id}).find()
    ])

    _.react({
      locations: locations.map((location) => location.slice('id', 'name')),
      order,
      products
    })
  }),

  // Update
  post('/cart', async (_) => {
    const {productId, quantity} = _.request.body
    const product = await Product.include('grower').find(productId)

    if (!product || !product.active || !product.grower.active) {
      _.body = {message: 'That product is unavailable.'}
      return
    }

    _.state.cart.update(product, +quantity)
    _.body = {message: 'Cart updated.'}
  }),

  // Checkout
  post('/cart/checkout', async (_) => {
    const {cart, currentUser} = _.state
    const {locationId} = _.request.body

    await db.query('select checkout($1, $2, $3)', [
      currentUser.id,
      locationId,
      cart.ids.map((id) => [id, cart.cart[id]])
    ])

    await _.mail(updateMail, {
      to: [currentUser.email],
      subject: 'Aiken Organics: Order Updated',
      url: `http://${_.host}/orders/current`
    })

    cart.clear()
    _.body = {}
  })

]
