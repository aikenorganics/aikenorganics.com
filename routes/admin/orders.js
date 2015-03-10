var express = require('express');
var router = module.exports = express.Router();
var models = require('../../models');

router.get('/', function(req, res) {
  models.Order.findAll({
    include: [{as: 'user', model: models.User}]
  }).then(function(orders) {
    res.render('admin/orders/index', {orders: orders});
  });
});

router.get('/:order_id', function(req, res) {
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
  }).then(function(order) {
    if (!order) return res.status(404).render('404');
    res.render('admin/orders/show', {order: order});
  });
});
