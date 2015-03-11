var express = require('express')
var router = module.exports = express.Router()
var models = require('../../models')

// Filter by Product
router.get('/', function (req, res, next) {
  var id = req.query.product_id
  if (!id) return next()
  models.Product.find(id).then(function (product) {
    req.product = res.locals.product = product
    next()
  })
})

router.get('/', function (req, res) {
  models.Order.findAll({
    where: req.product ? models.sequelize.literal(
      `orders.id in (
        select order_id from product_orders
        where product_id = ${req.product.id}
      )`
    ) : {},
    include: [{as: 'user', model: models.User}]
  }).then(function (orders) {
    res.render('admin/orders/index', {orders: orders})
  })
})

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
