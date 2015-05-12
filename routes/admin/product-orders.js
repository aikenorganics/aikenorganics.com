var express = require('express')
var router = module.exports = express.Router()
var models = require('../../models')
var find = require('../../mid/find')

// Find the ProductOrder
router.param('product_order_id', find(models.ProductOrder))

// Delete
router.post('/:product_order_id/remove', function (req, res) {
  if (!req.productOrder) return res.status(404).render('404')

  req.transaction(function (t) {
    return req.productOrder.destroy({transaction: t}).then(function () {
      res.flash('success', 'Removed.')
      res.redirect(
        req.body.return_to || `/admin/orders/${req.productOrder.order_id}`
      )
    })
  })
})
