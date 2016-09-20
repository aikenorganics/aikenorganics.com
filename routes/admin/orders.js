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

// Index
router.get('/', (req, res) => {
  const full = req.query.full === '1'
  const {locationId, productId} = req.query
  const status = Array.isArray(req.query.status)
    ? req.query.status
    : [req.query.status || 'open']

  const orders = db.Order.include('user', 'location').where({status})

  // Product
  if (productId) {
    orders.where({id: db.ProductOrder.select('orderId').where({productId})})
  }

  // Location
  if (locationId === 'delivery') {
    orders.where({locationId: null})
  } else if (locationId) {
    orders.where({locationId})
  }

  // CSV
  if (req.query.csv) {
    orders.all().then((orders) => {
      res.setHeader('Content-Type', 'text/csv')
      res.write(csv.row('id', 'name', 'email', 'member', 'location', 'delivery'))
      for (const {id, location, user} of orders) {
        res.write(csv.row(
          id,
          user.name,
          user.email,
          user.memberUntil > new Date() ? '✓' : '',
          location ? location.name : user.address,
          location ? '' : '✓'
        ))
      }
      res.end()
    }).catch(res.error)
    return
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
    res.react(json.index, {
      full,
      orders,
      page,
      locationId,
      locations,
      productId,
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
