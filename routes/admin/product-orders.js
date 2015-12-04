'use strict'

let db = require('../../db')
let ozymandias = require('ozymandias')
let router = module.exports = ozymandias.Router()

// Find the ProductOrder
router.find('product_order_id', 'productOrder', () => db.ProductOrder)

// Create
router.post('/', function (req, res) {
  db.transaction(function () {
    db.ProductOrder.create(req.permit('order_id', 'quantity', 'product_id'))
  }).then(function () {
    res.flash('success', 'Product added.')
    res.redirect(`/admin/orders/${req.body.order_id}`)
  }).catch(res.error)
})

// Delete
router.post('/:product_order_id/remove', function (req, res) {
  db.transaction(function () {
    req.productOrder.destroy()
  }).then(function () {
    res.flash('success', 'Removed.')
    res.redirect(
      req.body.return_to || `/admin/orders/${req.params.order_id}`
    )
  }).catch(res.error)
})

// Update
router.post('/:product_order_id', function (req, res) {
  db.transaction(function (t) {
    req.productOrder.update(req.permit('quantity', 'cost'))
  }).then(function () {
    res.flash('success', 'Updated')
    res.redirect(`/admin/orders/${req.productOrder.order_id}`)
  }).catch(res.error)
})
