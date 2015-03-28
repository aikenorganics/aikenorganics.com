var express = require('express')
var models = require('../models')
var router = module.exports = express.Router()

router.use(function (req, res, next) {
  if (req.user && process.env.OPEN) return next()
  res.status(401).render('401')
})

router.get('/', function (req, res) {
  models.Product.findAll({
    where: {id: {in: req.cart.ids()}},
    order: [['name', 'ASC']]
  }).then(function (products) {
    res.render('cart/index', {products: products})
  })
})

router.post('/', function (req, res) {
  if (!req.user) return res.status(401).render('401')

  var id = req.body.product_id
  var quantity = +req.body.quantity
  var return_to = req.body.return_to

  models.Product.find(id).then(function (product) {
    if (!product) return res.status(404).render('404')
    req.cart.update(product, quantity)
    res.flash('success', 'Updated.')
    res.redirect(return_to || '/products/' + id)
  })
})

router.post('/checkout', function (req, res) {
  req.transaction(function (transaction) {
    return new Checkout(req.user, req.cart, transaction).process().then(function () {
      req.cart.clear()
      res.redirect('/orders/current')
    })
  })
})

var Checkout = function (user, cart, transaction) {
  this.user = user
  this.cart = cart
  this.transaction = transaction
}

Checkout.prototype = {

  process: function () {
    return models.Product.findAll({
      where: {id: {in: this.cart.ids()}}
    }, {transaction: this.transaction}).then(function (products) {
      this.products = products.filter(function (product) {
        return product.available() > 0
      })
      return this.createOrder()
    }.bind(this))
  },

  createOrder: function () {
    return models.Order.findOrCreate({
      where: {
        status: 'open',
        user_id: this.user.id
      }
    }, {transaction: this.transaction}).then(function (results) {
      this.order = results[0]
      return this.createProductOrders()
    }.bind(this))
  },

  createProductOrders: function () {
    return Promise.all(this.products.map(function (product) {
      return models.ProductOrder.findOrCreate({
        where: {order_id: this.order.id, product_id: product.id}
      }, {transaction: this.transaction})
    }.bind(this))).then(function (productOrders) {
      this.productOrders = productOrders.map(function (a) { return a[0] })
      return this.updateProductOrders()
    }.bind(this))
  },

  updateProductOrders: function () {
    return Promise.all(this.productOrders.map(function (productOrder) {
      var product = this.products.filter(function (product) {
        return product.id === productOrder.product_id
      })[0]
      return productOrder.increment(
        {quantity: this.cart.quantity(product)},
        {transaction: this.transaction}
      )
    }.bind(this)))
  }

}
