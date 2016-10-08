'use strict'

const db = require('../db')
const json = require('../json/cart/index')
const updateMail = require('../mail/orders/update')
const router = module.exports = require('ozymandias').Router()

router.use((request, response, next) => {
  if (request.currentUser && request.market.open) return next()
  response.unauthorized()
})

// Index
router.get('/', (request, response) => {
  Promise.all([
    db.Product
      .include('category', 'grower')
      .where({id: request.cart.ids})
      .order('name').all(),
    db.Location.where({active: true}).order('name').all(),
    db.Order.where({status: 'open', userId: request.currentUser.id}).find()
  ]).then(([products, locations, order]) => {
    response.react(json.index, {products, locations, order})
  }).catch(response.error)
})

// Update
router.post('/', (request, response, next) => {
  const id = request.body.productId

  db.Product.include('grower').find(id).then((product) => {
    if (product && product.grower.active) {
      request.product = response.locals.product = product
      return next()
    }
    response.json({message: 'That product is unavailable'})
  }).catch(response.error)
})

router.post('/', (request, response) => {
  const quantity = +request.body.quantity
  request.cart.update(request.product, quantity)
  response.json({message: 'Cart updated.'})
})

// Checkout
router.post('/checkout', (request, response) => {
  db.query('select checkout($1, $2, $3)', [
    request.currentUser.id,
    request.body.locationId,
    request.cart.ids.map((id) => [id, request.cart.cart[id]])
  ]).then(() => (
    request.mail(updateMail, {
      to: [request.currentUser.email],
      subject: 'Aiken Organics: Order Updated',
      url: `http://${request.get('host')}/orders/current`
    })
  )).then(() => {
    request.cart.clear()
    response.json({})
  }).catch(response.error)
})
