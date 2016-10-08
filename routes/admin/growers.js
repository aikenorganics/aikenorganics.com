'use strict'

const db = require('../../db')
const json = require('../../json/admin/growers')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('grower', () => db.Grower.include({userGrowers: 'user'}))

// Index
router.get('/', (request, response) => {
  db.Grower
  .select(`(
    select sum(quantity * product_orders.cost) from product_orders
    inner join products on products.id = product_orders.product_id
    inner join orders on orders.id = product_orders.order_id
    where products.grower_id = growers.id and orders.status = 'complete'
  ) as total`)
  .order('name').all().then((growers) => {
    response.react(json.index, {growers})
  }).catch(response.error)
})

// Orders
router.get('/orders', (request, response) => {
  db.Grower
  .where('exists(select id from products where reserved > 0 and grower_id = growers.id)')
  .include('products').all().then((growers) => {
    response.react(json.orders, {growers})
  }).catch(response.error)
})

// Show
router.get('/:growerId', (request, response) => {
  db.Product
  .join({productOrders: 'order'})
  .select('sum(quantity) as quantity')
  .select('sum(quantity * product_orders.cost) as total')
  .where({growerId: request.grower.id})
  .where({productOrders: {order: {status: 'complete'}}})
  .groupBy('products.id')
  .all().then((products) => {
    response.react(json.show, {grower: request.grower, products})
  }).catch(response.error)
})

// Users
router.get('/:growerId/users', (request, response) => {
  db.User.order('first').all().then((users) => {
    response.react(json.users, {grower: request.grower, users})
  }).catch(response.error)
})
