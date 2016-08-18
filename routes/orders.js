'use strict'

const db = require('../db')
const json = require('../json/orders')
const router = module.exports = require('ozymandias').Router()

router.use((req, res, next) => {
  if (req.currentUser) return next()
  res.unauthorized()
})

router.find('order', () => db.Order)

// Current
router.get('/current', (req, res) => {
  Promise.all([
    db.Order
      .include('location', {productOrders: 'product'})
      .where({status: 'open', userId: req.currentUser.id})
      .find(),
    db.Location.where({active: true}).order('name').all()
  ]).then(([order, locations]) => {
    res.react(json.current, {locations, order})
  }).catch(res.error)
})

// Previous
router.get('/previous', (req, res) => {
  const page = res.locals.page = +(req.query.page || 1)

  db.Order
  .include('location', {productOrders: 'product'})
  .where({status: 'complete', userId: req.currentUser.id})
  .paginate(page, 10)
  .then((orders) => {
    res.react(json.previous, {orders})
  }).catch(res.error)
})

// Update
router.post('/:orderId', (req, res) => {
  // You can only update when the market is open.
  if (!req.admin && !req.market.open) {
    return res.unauthorized()
  }

  // You can only update your own order.
  if (!req.admin && req.currentUser.id !== req.order.userId) {
    return res.unauthorized()
  }

  const values = req.permit('locationId')

  if (req.admin) {
    Object.assign(values, req.permit('notes', 'status'))
  }

  req.order.update(values).then(() => (
    db.Order.include('location').find(req.order.id).then((order) => {
      res.json(json.update, {order})
    })
  )).catch(res.error)
})

// Cancel
router.delete('/:orderId', (req, res) => {
  if (!req.market.open) return res.unauthorized()

  // You can only cancel your own order.
  if (req.currentUser.id !== req.order.userId) {
    return res.unauthorized()
  }

  req.order.destroy().then(() => res.json({})).catch(res.error)
})
