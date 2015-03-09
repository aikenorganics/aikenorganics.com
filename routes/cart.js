var Sql = require('sequelize');
var express = require('express');
var models = require('../models');
var Order = models.Order;
var Product = models.Product;
var ProductOrder = models.ProductOrder;
var router = module.exports = express.Router();

router.use(function(req, res, next) {
  if (req.user) return next();
  res.status(401).render('401');
});

router.get('/', function(req, res) {
  Product.findAll({
    where: {id: {in: req.cart.ids()}},
    order: [['name', 'ASC']]
  }).then(function(products) {
    res.render('cart/index', {products: products});
  });
});

router.post('/', function(req, res) {
  if (!req.user) return res.status(401).render('401');

  var id = req.body.product_id;
  var quantity = +req.body.quantity;
  var return_to = req.body.return_to;

  Product.find(id).then(function(product) {
    if (!product) return res.status(404).render('404');
    req.cart.update(product, quantity);
    res.flash('success', 'Updated.');
    res.redirect(return_to || '/products/' + id);
  });
});

router.post('/checkout', function(req, res) {
  new Checkout(req.user, req.cart).process().then(function() {
    req.cart.clear();
    res.redirect('/orders/current');
  });
});

var Checkout = function(user, cart) {
  this.user = user;
  this.cart = cart;
};

Checkout.prototype = {

  process: function() {
    return models.sequelize.transaction(function(t) {
      this.t = t;
      return this.findProducts();
    }.bind(this));
  },

  findProducts: function() {
    return Product.findAll({
      where: {id: {in: this.cart.ids()}}
    }, {transaction: this.t}).then(function(products) {
      this.products = products.filter(function(product) {
        return product.available() > 0;
      });
      return this.createOrder();
    }.bind(this));
  },

  createOrder: function() {
    return Order.findOrCreate({
      where: {user_id: this.user.id}
    }, {transaction: this.t}).then(function(results) {
      this.order = results[0];
      return this.createProductOrders();
    }.bind(this));
  },

  createProductOrders: function() {
    return Promise.all(this.products.map(function(product) {
      return ProductOrder.findOrCreate({
        where: {order_id: this.order.id, product_id: product.id}
      }, {transaction: this.t});
    }.bind(this))).then(function(productOrders) {
      this.productOrders = productOrders.map(function(a) { return a[0]; });
      return this.updateProductOrders();
    }.bind(this));
  },

  updateProductOrders: function() {
    return Promise.all(this.productOrders.map(function(productOrder) {
      var product = this.products.filter(function(product) {
        return product.id == productOrder.product_id;
      })[0];
      return productOrder.increment(
        {quantity: this.cart.quantity(product)},
        {transaction: this.t}
      );
    }.bind(this))).then(this.updateReserved.bind(this));;
  },

  updateReserved: function() {
    return Promise.all(this.products.map(function(product) {
      return product.updateReserved({transaction: this.t});
    }.bind(this)));
  }

};
