'use strict'

const db = require('../../db')
const json = require('../../json/admin/orders')
const router = module.exports = require('ozymandias').Router()

// Find
// TODO: Order by product name.
router.find('order', () =>
  db.Order.include('user', 'location', 'payments', {productOrders: 'product'})
)

// Find a Product
router.get('/', (req, res, next) => {
  const id = req.query.product_id
  if (!id) return next()
  db.Product.find(id).then((product) => {
    req.product = res.locals.product = product
    next()
  }).catch(next)
})

// Index
router.get('/', (req, res) => {
  const full = req.query.full === '1'
  const location_id = req.query.location_id
  const status = Array.isArray(req.query.status)
    ? req.query.status
    : [req.query.status || 'open']

  let orders = db.Order.include('user', 'location').where({status})

  // Product
  if (req.product) {
    orders.where({
      id: db.ProductOrder.select('order_id').where({
        product_id: req.product.id
      })
    })
  }

  // Location
  if (location_id === 'delivery') {
    orders.where({location_id: null})
  } else if (location_id) {
    orders.where({location_id})
  }

  // Pagination
  const page = +(req.query.page || 1)

  // Include product orders?
  if (full) orders.include({productOrders: 'product'})

  Promise.all([
    orders.order(['created_at', 'descending']).paginate(page, 50),
    db.Location.order('name').all(),
    db.Product.order('name').all()
  ]).then(([orders, locations, products]) => {
    res._react(json.index, {
      full,
      orders,
      page,
      location_id,
      locations,
      products,
      status
    })
  }).catch(res.error)
})

// Show
router.get('/:order_id', (req, res) => {
  let products = db.Product.join('grower')
    .where({active: true, grower: {active: true}})
    .where('supply > reserved')
    .not({id: req.order.productOrders.map((po) => po.product_id)})

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
  // TODO: REMOVE ME
  if (/^\s*$/.test(req.body.location_id)) req.body.location_id = null
  req.order.update(req.permit('status', 'notes', 'location_id')).then(() => {
    res.flash('success', 'Order Updated')
    res.redirect(`/admin/orders/${req.order.id}`)
  }).catch(res.error)
})

// Charge
router.post('/:order_id/charge', (req, res) => {
  const amount = (+req.body.amount * 100) | 0
  req.order.charge(amount).then((payment) => {
    // res.json(payment)
    res.redirect(`/admin/orders/${req.order.id}`)
  }).catch(res.error)
})
