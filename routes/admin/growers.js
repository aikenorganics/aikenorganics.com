'use strict'

const db = require('../../db')
const json = require('../../json/admin/growers')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('grower', () => db.Grower.include({userGrowers: 'user'}))

// Index
router.get('/', (req, res) => {
  db.Grower
  .select(`(
    select sum(quantity * product_orders.cost) from product_orders
    inner join products on products.id = product_orders.product_id
    inner join orders on orders.id = product_orders.order_id
    where products.grower_id = growers.id and orders.status = 'complete'
  ) as total`)
  .order('name').all().then((growers) => {
    res._react(json.index, {growers})
  }).catch(res.error)
})

// Orders
router.get('/orders', (req, res) => {
  db.Grower
  .where('exists(select id from products where reserved > 0 and grower_id = growers.id)')
  .include('products').all().then((growers) => {
    res.react({growers: growers})
  }).catch(res.error)
})

// Show
router.get('/:grower_id', (req, res) => {
  db.Product
  .join({productOrders: 'order'})
  .select('sum(quantity) as quantity')
  .select('sum(quantity * product_orders.cost) as total')
  .where({grower_id: req.grower.id})
  .where({productOrders: {order: {status: 'complete'}}})
  .groupBy('products.id')
  .all().then((products) => {
    res.react({
      grower: req.grower,
      products: products
    })
  }).catch(res.error)
})

// Users
router.get('/:grower_id/users', (req, res) => {
  db.User.order('first').all().then((users) => {
    res.react({
      grower: req.grower,
      users: users
    })
  }).catch(res.error)
})
