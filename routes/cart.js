'use strict'

let db = require('../db')
let ozymandias = require('ozymandias')
let router = module.exports = ozymandias.Router()

router.use(function (req, res, next) {
  if (req.user && req.market.open) return next()
  res.status(401).format({
    html: function () { res.render('401') },
    json: function () { res.json({message: 'Access Denied'}) }
  })
})

// Index
router.get('/', function (req, res) {
  Promise.all([
    db.Product.where({id: req.cart.ids()}).order('name').all(),
    db.Location.order('name').all(),
    db.Order.where({status: 'open', user_id: req.user.id}).find()
  ]).then(function (results) {
    res.render('cart/index', {
      products: results[0],
      locations: results[1],
      order: results[2]
    })
  }).catch(res.error)
})

// Update
router.post('/', function (req, res, next) {
  let id = req.body.product_id

  db.Product.include('grower').find(id).then(function (product) {
    if (product && product.grower.active) {
      req.product = res.locals.product = product
      return next()
    }
    res.format({
      html: function () {
        res.flash('error', 'That product is unavailable')
        res.redirect(req.body.return_to || `/products/${id}`)
      },
      json: function () {
        res.json({message: 'That product is unavailable'})
      }
    })
  }).catch(res.error)
})

router.post('/', function (req, res) {
  let quantity = +req.body.quantity
  req.cart.update(req.product, quantity)

  res.format({
    html: function () {
      res.redirect(req.body.return_to || `/products/${req.product.id}`)
    },
    json: function () {
      res.json({
        cartSize: req.cart.size(),
        product_id: req.product.id,
        quantity: Math.min(quantity, req.product.available()),
        available: req.product.available(),
        message: 'Cart updated.'
      })
    }
  })
})

// Checkout
router.post('/checkout', function (req, res) {
  db.transaction(function () {
    db.query('select checkout($1, $2, $3)', [
      req.user.id,
      req.body.location_id,
      req.cart.ids().map(function (id) {
        return [id, req.cart.cart[id]]
      })
    ])
  }).then(function () {
    return req.mail('mail/orders/update', {
      to: [req.user.email],
      subject: 'Aiken Organics: Order Updated',
      url: `http://${req.get('host')}/orders/current`
    })
  }).then(function () {
    req.cart.clear()
    res.redirect('/orders/current')
  }).catch(res.error)
})
