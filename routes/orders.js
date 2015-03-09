var Sql = require('sequelize')
var express = require('express');
var find = require('../mid/find');
var models = require('../models');
var Order = models.Order;
var Product = models.Product;
var ProductOrder = models.ProductOrder;
var router = module.exports = express.Router();

router.use(function(req, res, next) {
  if (req.user) return next();
  res.status(401).render('401');
});

router.param('order_id', find('order', Order));

router.get('/current', function(req, res) {
  Order.findAll({
    limit: 1,
    where: {user_id: req.user.id}
  }).then(function(orders) {
    var order = orders[0];
    if (!order) return res.render('orders/current');
    ProductOrder.findAll({
      where: {order_id: order.id},
      include: [{model: Product, as: 'product'}]
    }).then(function(productOrders) {
      res.render('orders/current', {
        order: order,
        productOrders: productOrders
      });
    });
  });
});

router.post('/:order_id/cancel', function(req, res) {
  if (!req.order) return res.status(404).render('404');
  models.sequelize.transaction(function(t) {
    return ProductOrder.findAll({
      where: {order_id: req.order.id},
      include: [{model: Product, as: 'product'}]
    }, {transaction: t}).then(function(productOrders) {
      return req.order.destroy({transaction: t}).then(function() {
        var products = productOrders.map(function(po) { return po.product; });
        return Promise.all(products.map(function(product) {
          return product.updateReserved({transaction: t});
        })).then(function() {
          res.flash('success', 'Order cancelled.');
          res.redirect('/products');
        });
      });
    });
  });
});
