'use strict'

const db = require('../../db')
const router = module.exports = require('ozymandias').Router()

// Find
// TODO: Order by product name.
router.find('order', () =>
  db.Order.include('user', 'location', {productOrders: 'product'})
)

// Find a Product
router.get('/', (req, res, next) => {
  let id = req.query.product_id
  if (!id) return next()
  db.Product.find(id).then((product) => {
    req.product = res.locals.product = product
    next()
  }).catch(next)
})

// Index
router.get('/', (req, res) => {
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

  if (full) orders.include({productOrders: 'product'})

  Promise.all([
    orders.order(['created_at', 'descending']).all(),
    db.Location.order('name').all(),
    db.Product.order('name').all()
  ]).then((results) => {
    let view = full ? 'admin/orders/full' : 'admin/orders/index'
    res.render(view, {
      orders: results[0],
      locations: results[1],
      products: results[2]
    })
  }).catch(res.error)
})

// Show
router.get('/:order_id', (req, res) => {
  let products = db.Product.join('grower')
    .where({active: true, grower: {active: true}})
    .where('supply > reserved')
    .not({id: req.order.productOrders.map(po => po.product_id)})

  Promise.all([
    products.order('name').all(),
    db.Location.order('name').all()
  ]).then((results) => {
    res.render('admin/orders/show', {
      products: results[0],
      locations: results[1]
    })
  }).catch(res.error)
})

// Update
router.post('/:order_id', (req, res) => {
  req.order.update(req.permit('status', 'notes', 'location_id')).then(() => {
    res.flash('success', 'Order Updated')
    res.redirect(`/admin/orders/${req.order.id}`)
  }).catch(res.error)
})
