'use strict'

const db = require('../db')
const router = module.exports = require('ozymandias').Router()

router.use((req, res, next) => {
  if (req.user) return next()
  res.status(401).render('401')
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
  ]).then((results) => {
    res.render('orders/current', {
      order: results[0],
      locations: results[1]
    })
  })
})

// Update
router.post('/:order_id', (req, res) => {
  if (!req.market.open) return res.status(401).render('401')

  // You can only update your own order.
  if (req.user.id !== req.order.user_id) {
    return res.status(401).render('401')
  }

  req.order.update(req.permit('location_id')).then(() => {
    res.flash('success', 'Saved')
    res.redirect('/orders/current')
  }).catch(res.error)
})

// Cancel
router.post('/:order_id/cancel', (req, res) => {
  if (!req.market.open) return res.status(401).render('401')

  // You can only cancel your own order.
  if (req.user.id !== req.order.user_id) {
    return res.status(401).render('401')
  }

  req.order.destroy().then(() => {
    res.flash('success', 'Order cancelled.')
    res.redirect('/products')
  }).catch(res.error)
})
