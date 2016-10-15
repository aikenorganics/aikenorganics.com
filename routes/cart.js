'use strict'

const db = require('../db')
const {Location, Order, Product} = require('../db')
const updateMail = require('../mail/orders/update')
const {all, get, post} = require('koa-route')

module.exports = [

  all('/cart', function *(next) {
    const {currentUser, open} = this.state
    if (!currentUser || !open) return this.unauthorized()
    yield next
  }, {end: false}),

  // Index
  get('/cart', function *() {
    const {cart, currentUser} = this.state
    const [products, locations, order] = yield Promise.all([
      Product
        .include('category', 'grower')
        .where({id: cart.ids})
        .order('name').all(),
      Location.where({active: true}).order('name').all(),
      Order.where({status: 'open', userId: currentUser.id}).find()
    ])

    this.react({
      locations: locations.map((location) => location.slice('id', 'name')),
      order,
      products
    })
  }),

  // Update
  post('/cart', function *() {
    const {productId, quantity} = this.request.body
    const product = yield Product.include('grower').find(productId)

    if (!product || !product.active || !product.grower.active) {
      this.body = {message: 'That product is unavailable.'}
      return
    }

    this.state.cart.update(product, +quantity)
    this.body = {message: 'Cart updated.'}
  }),

  // Checkout
  post('/cart/checkout', function *() {
    const {cart, currentUser} = this.state
    const {locationId} = this.request.body

    yield db.query('select checkout($1, $2, $3)', [
      currentUser.id,
      locationId,
      cart.ids.map((id) => [id, cart.cart[id]])
    ])

    yield this.mail(updateMail, {
      to: [currentUser.email],
      subject: 'Aiken Organics: Order Updated',
      url: `http://${this.host}/orders/current`
    })

    cart.clear()
    this.body = {}
  })

]
