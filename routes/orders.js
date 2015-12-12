'use strict'

let db = require('../db')
let ozymandias = require('ozymandias')
let router = module.exports = ozymandias.Router()

router.use(function (req, res, next) {
  if (req.user) return next()
  res.status(401).render('401')
})

router.find('order', () => db.Order)

// Current
router.get('/current', function (req, res) {
  Promise.all([
    db.Order
      .include('location', {productOrders: 'product'})
      .where({status: 'open', user_id: req.user.id})
      .find(),
    db.Location.order('name').all()
  ]).then(function (results) {
    res.render('orders/current', {
      order: results[0],
      locations: results[1]
    })
  })
})

// Update
router.post('/:order_id', function (req, res) {
  if (!req.market.open) return res.status(401).render('401')

  // You can only update your own order.
  if (req.user.id !== req.order.user_id) {
    return res.status(401).render('401')
  }

  req.order.update(req.permit('location_id')).then(function () {
    res.flash('success', 'Saved')
    res.redirect('/orders/current')
  }).catch(res.error)
})

// Cancel
router.post('/:order_id/cancel', function (req, res) {
  if (!req.market.open) return res.status(401).render('401')

  // You can only cancel your own order.
  if (req.user.id !== req.order.user_id) {
    return res.status(401).render('401')
  }

  req.order.destroy().then(function () {
    res.flash('success', 'Order cancelled.')
    res.redirect('/products')
  }).catch(res.error)
})
