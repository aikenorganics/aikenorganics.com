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
router.get('/', (request, response) => {
  const full = request.query.full === '1'
  const {locationId, productId} = request.query
  const status = Array.isArray(request.query.status)
    ? request.query.status
    : [request.query.status || 'open']

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
  if (request.query.csv) {
    orders.all().then((orders) => {
      response.setHeader('Content-Type', 'text/csv')
      response.write(csv.row('id', 'name', 'email', 'member', 'location', 'delivery'))
      for (const {id, location, user} of orders) {
        response.write(csv.row(
          id,
          user.name,
          user.email,
          user.memberUntil > new Date() ? '✓' : '',
          location ? location.name : user.address,
          location ? '' : '✓'
        ))
      }
      response.end()
    }).catch(response.error)
    return
  }

  // Pagination
  const page = +(request.query.page || 1)

  // Include product orders?
  if (full) orders.include({productOrders: 'product'})

  Promise.all([
    orders.order(['createdAt', 'descending']).paginate(page, 50),
    db.Location.order('name').all(),
    db.Product.order('name').all()
  ]).then(([orders, locations, products]) => {
    response.react(json.index, {
      full,
      orders,
      page,
      locationId,
      locations,
      productId,
      products,
      status
    })
  }).catch(response.error)
})

// Show
router.get('/:orderId', (request, response) => {
  const products = db.Product.join('grower')
    .where({active: true, grower: {active: true}})
    .where('supply > reserved')

  Promise.all([
    products.order('name').all(),
    db.Location.order('name').all()
  ]).then(([products, locations]) => {
    response.react(json.show, {products, locations})
  }).catch(response.error)
})

// Charge
router.post('/:orderId/charge', (request, response) => {
  const amount = (+request.body.amount * 100) | 0
  request.order.charge(amount).then((payment) => {
    response.json(json.charge, {payment})
  }).catch(response.error)
})
