'use strict'

let db = require('../../db')
let find = require('../../mid/_find')
let ozymandias = require('ozymandias')
let router = module.exports = ozymandias.Router()

// Find
// TODO: Order by product name.
router.param('order_id', find('order', function () {
  return db.Order.include('user', 'location', {productOrders: 'product'})
}))

// Find a Product
router.get('/', function (req, res, next) {
  let id = req.query.product_id
  if (!id) return next()
  db.Product.find(id).then(function (product) {
    req.product = res.locals.product = product
    next()
  }).catch(next)
})

// Index
router.get('/', function (req, res) {
  let full = req.query.full === '1'
  let status = req.query.status =
    Array.isArray(req.query.status) ? req.query.status : ['open']
  let orders = db.Order.include('user', 'location').where({status: status})

  // Product
  if (req.product) {
    orders.where({
      id: db.ProductOrder.select('order_id').where({
        product_id: req.product.id
      })
    })
  }

  // Location
  if (req.query.location_id) {
    orders.where({location_id: req.query.location_id})
  }

  // Include models for full view
  if (full) orders.include({productOrders: 'product'})

  Promise.all([
    orders.order(['createdAt', 'descending']).all(),
    db.Location.order('name').all()
  ]).then(function (results) {
    let view = full ? 'admin/orders/full' : 'admin/orders/index'
    res.render(view, {
      orders: results[0],
      locations: results[1]
    })
  }).catch(res.error)
})

// Show
router.get('/:order_id', function (req, res) {
  let products = db.Product.join('grower')
    .where({active: true, grower: {active: true}})
    .where('supply > reserved').not({
      id: req.order.productOrders.map(function (productOrder) {
        return productOrder.product_id
      })
    })

  Promise.all([
    products.order('name').all(),
    db.Location.order('name').all()
  ]).then(function (results) {
    res.render('admin/orders/show', {
      products: results[0],
      locations: results[1]
    })
  }).catch(res.error)
})

// Update
router.post('/:order_id', function (req, res) {
  db.transaction(function () {
    req.order.update(req.permit('status', 'notes', 'location_id'))
  }).then(function () {
    res.flash('success', 'Order Updated')
    res.redirect(`/admin/orders/${req.order.id}`)
  }).catch(res.error)
})
