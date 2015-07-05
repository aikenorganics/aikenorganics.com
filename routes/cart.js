var ozymandias = require('ozymandias')
var models = require('../models')
var router = module.exports = ozymandias.Router()

router.use(function (req, res, next) {
  if (req.user && req.market.open) return next()
  res.status(401).render('401')
})

router.get('/', function (req, res) {
  Promise.all([
    models.Product.findAll({
      where: {id: {in: req.cart.ids()}},
      order: [['name', 'ASC']]
    }),
    models.Location.findAll(),
    models.Order.findOne({
      where: {
        status: 'open',
        user_id: req.user.id
      },
      include: [{
        model: models.ProductOrder,
        as: 'productOrders',
        include: [{model: models.Product, as: 'product'}]
      }]
    })
  ]).then(function (results) {
    res.render('cart/index', {
      products: results[0],
      locations: results[1],
      order: results[2]
    })
  })
})

router.post('/', function (req, res) {
  if (!req.user) return res.status(401).render('401')

  var id = req.body.product_id
  var quantity = +req.body.quantity
  var return_to = req.body.return_to

  models.Product.findOne({
    where: {id: id},
    include: [{
      as: 'grower',
      model: models.Grower
    }]
  }).then(function (product) {
    if (!product) return res.status(404).render('404')
    if (product.grower.active) {
      req.cart.update(product, quantity)
      res.flash('success', 'Updated.')
    } else {
      res.flash('error', 'That product is unavailable.')
    }
    res.redirect(return_to || '/products/' + id)
  })
})

router.post('/checkout', function (req, res) {
  req.transaction(function (transaction) {
    return new Checkout(req, transaction).process().then(function () {
      req.cart.clear()
      res.redirect('/orders/current')
    })
  })
})

var Checkout = function (req, transaction) {
  this.req = req
  this.user = req.user
  this.cart = req.cart
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
        user_id: this.user.id,
        location_id: this.req.body.location_id
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
