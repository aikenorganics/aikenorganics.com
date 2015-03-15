var express = require('express')
var router = module.exports = express.Router()
var models = require('../../models')

// Find a Product
router.get('/', function (req, res, next) {
  var id = req.query.product_id
  if (!id) return next()
  models.Product.find(id).then(function (product) {
    req.product = res.locals.product = product
    next()
  })
})

// Index
router.get('/', function (req, res) {
  var full = req.query.full
  var where = [`orders.status = 'open'`]
  var include = [{as: 'user', model: models.User}]

  // Filter by product
  if (req.product) {
    where = [
      `orders.status = 'open' and orders.id in (
        select order_id from product_orders where product_id = ?
      )`,
      req.product.id
    ]
  }

  // Include models for full view
  if (full) {
    include.push({
      model: models.ProductOrder,
      as: 'productOrders',
      include: [{model: models.Product, as: 'product'}]
    })
  }

  // Get the orders!
  models.Order.findAll({
    where: where,
    include: include
  }).then(function (orders) {
    var view = full ? 'admin/orders/full' : 'admin/orders/index'
    res.render(view, {orders: orders})
  })
})

// Show
router.get('/:order_id', function (req, res) {
  models.Order.findOne({
    where: {id: req.params.order_id},
    include: [{
      as: 'user',
      model: models.User
    }, {
      model: models.ProductOrder,
      as: 'productOrders',
      include: [{model: models.Product, as: 'product'}]
    }]
  }).then(function (order) {
    if (!order) return res.status(404).render('404')
    res.render('admin/orders/show', {order: order})
  })
})
