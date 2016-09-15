'use strict'

const db = require('../../db')
const csv = require('../../lib/csv')
const json = require('../../json/admin/orders')
const router = module.exports = require('ozymandias').Router()

// Find
// TODO: Order by product name.
router.find('order', () =>
  db.Order.include('user', 'location', 'payments', {productOrders: 'product'})
)

// Find a Product
router.get('/', (req, res, next) => {
  const id = req.query.productId
  if (!id) return next()
  db.Product.find(id).then((product) => {
    req.product = res.locals.product = product
    next()
  }).catch(next)
})

// Index
router.get('/', (req, res) => {
  const full = req.query.full === '1'
  const locationId = req.query.locationId
  const status = Array.isArray(req.query.status)
    ? req.query.status
    : [req.query.status || 'open']

  const orders = db.Order.include('user', 'location').where({status})

  // Product
  if (req.product) {
    orders.where({
      id: db.ProductOrder.select('orderId').where({
        productId: req.product.id
      })
    })
  }

  // Location
  if (locationId === 'delivery') {
    orders.where({locationId: null})
  } else if (locationId) {
    orders.where({locationId})
  }

  // Pagination
  const page = +(req.query.page || 1)

  // Include product orders?
  if (full) orders.include({productOrders: 'product'})

  Promise.all([
    orders.order(['createdAt', 'descending']).paginate(page, 50),
    db.Location.order('name').all(),
    db.Product.order('name').all()
  ]).then(([orders, locations, products]) => {
    // CSV
    if (req.query.csv) {
      res.setHeader('Content-Type', 'text/csv')
      res.write(csv.row('id', 'name', 'email', 'member', 'location'))
      for (const {id, location, user} of orders) {
        res.write(csv.row(
          id,
          user.name,
          user.email,
          user.memberUntil > new Date() ? '✓' : '',
          location.name
        ))
      }
      res.end()
      return
    }

    res.react(json.index, {
      full,
      orders,
      page,
      locationId,
      locations,
      products,
      status
    })
  }).catch(res.error)
})

// Show
router.get('/:orderId', (req, res) => {
  const products = db.Product.join('grower')
    .where({active: true, grower: {active: true}})
    .where('supply > reserved')

  Promise.all([
    products.order('name').all(),
    db.Location.order('name').all()
  ]).then(([products, locations]) => {
    res.react(json.show, {products, locations})
  }).catch(res.error)
})

// Charge
router.post('/:orderId/charge', (req, res) => {
  const amount = (+req.body.amount * 100) | 0
  req.order.charge(amount).then((payment) => {
    res.json(json.charge, {payment})
  }).catch(res.error)
})
