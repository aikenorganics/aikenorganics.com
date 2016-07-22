'use strict'

const db = require('../db')
const json = require('../json/orders')
const router = module.exports = require('ozymandias').Router()

router.use((req, res, next) => {
  if (req.user) return next()
  res.unauthorized()
})

router.find('order', () => db.Order)

// Current
router.get('/current', (req, res) => {
  Promise.all([
    db.Order
      .include('location', {productOrders: 'product'})
      .where({status: 'open', user_id: req.user.id})
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
  .where({status: 'complete', user_id: req.user.id})
  .paginate(page, 10)
  .then((orders) => {
    res.react(json.previous, {orders})
  }).catch(res.error)
})

// Update
router.post('/:order_id', (req, res) => {
  // You can only update when the market is open.
  if (!req.user.is_admin && !req.market.open) {
    return res.unauthorized()
  }

  // You can only update your own order.
  if (!req.user.is_admin && req.user.id !== req.order.user_id) {
    return res.unauthorized()
  }

  const values = req.permit('location_id')

  if (req.user.is_admin) {
    Object.assign(values, req.permit('notes', 'status'))
  }

  req.order.update(values).then(() => {
    return db.Order.include('location').find(req.order.id).then((order) => {
      res.json(order)
    })
  }).catch(res.error)
})

// Cancel
router.delete('/:order_id', (req, res) => {
  if (!req.market.open) return res.unauthorized()

  // You can only cancel your own order.
  if (req.user.id !== req.order.user_id) {
    return res.unauthorized()
  }

  req.order.destroy().then(() => res.json({})).catch(res.error)
})
