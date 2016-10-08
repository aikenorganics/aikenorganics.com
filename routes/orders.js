'use strict'

const db = require('../db')
const json = require('../json/orders')
const router = module.exports = require('ozymandias').Router()

router.use((request, response, next) => {
  if (request.currentUser) return next()
  response.unauthorized()
})

router.find('order', () => db.Order)

// Current
router.get('/current', (request, response) => {
  Promise.all([
    db.Order
      .include('location', {productOrders: 'product'})
      .where({status: 'open', userId: request.currentUser.id})
      .find(),
    db.Location.where({active: true}).order('name').all()
  ]).then(([order, locations]) => {
    response.react(json.current, {locations, order})
  }).catch(response.error)
})

// Previous
router.get('/previous', (request, response) => {
  const page = response.locals.page = +(request.query.page || 1)

  db.Order
  .include('location', {productOrders: 'product'})
  .where({status: 'complete', userId: request.currentUser.id})
  .order(['createdAt', 'descending'])
  .paginate(page, 10)
  .then((orders) => {
    response.react(json.previous, {orders})
  }).catch(response.error)
})

// Update
router.post('/:orderId', (request, response) => {
  // You can only update when the market is open.
  if (!request.admin && !request.market.open) {
    return response.unauthorized()
  }

  // You can only update your own order.
  if (!request.admin && request.currentUser.id !== request.order.userId) {
    return response.unauthorized()
  }

  const values = request.permit('locationId')

  if (request.admin) {
    Object.assign(values, request.permit('notes', 'status'))
  }

  request.order.update(values).then(() => (
    db.Order.include('location').find(request.order.id).then((order) => {
      response.json(json.update, {order})
    })
  )).catch(response.error)
})

// Cancel
router.delete('/:orderId', (request, response) => {
  if (!request.market.open) return response.unauthorized()

  // You can only cancel your own order.
  if (request.currentUser.id !== request.order.userId) {
    return response.unauthorized()
  }

  request.order.destroy().then(() => response.json({})).catch(response.error)
})
