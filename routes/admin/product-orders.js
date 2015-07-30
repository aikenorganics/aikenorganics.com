var ozymandias = require('ozymandias')
var router = module.exports = ozymandias.Router()
var models = require('../../models')
var find = require('../../mid/find')

// Find the ProductOrder
router.param('product_order_id', find(models.ProductOrder))

// Create
router.post('/', function (req, res) {
  req.transaction(function (transaction) {
    return models.ProductOrder.create(req.body, {
      fields: ['order_id', 'quantity', 'product_id'],
      transaction: transaction
    }).then(function (productOrder) {
      res.flash('success', 'Product added.')
      res.redirect(`/admin/orders/${productOrder.order_id}`)
    })
  })
})

// Delete
router.post('/:product_order_id/remove', function (req, res) {
  req.transaction(function (t) {
    return req.productOrder.destroy({transaction: t}).then(function () {
      res.flash('success', 'Removed.')
      res.redirect(
        req.body.return_to || `/admin/orders/${req.productOrder.order_id}`
      )
    })
  })
})

// Update
router.post('/:product_order_id', function (req, res) {
  req.transaction(function (t) {
    return req.productOrder.update(req.body, {
      fields: ['quantity']
    }).then(function () {
      res.flash('success', 'Updated')
      res.redirect(`/admin/orders/${req.productOrder.order_id}`)
    })
  })
})
