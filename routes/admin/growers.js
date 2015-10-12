'use strict'

let ozymandias = require('ozymandias')
let router = module.exports = ozymandias.Router()
let find = require('../../mid/find')
let db = require('../../db')

// Find
router.param('grower_id', find('grower', function () {
  return db.Grower.include({userGrowers: 'user'})
}))

// Index
router.get('/', function (req, res) {
  db.Grower
  .select(`(
    select sum(quantity * product_orders.cost) from product_orders
    inner join products on products.id = product_orders.product_id
    inner join orders on orders.id = product_orders.order_id
    where products.grower_id = growers.id and orders.status = 'complete'
  ) as total`)
  .order('name').all().then(function (growers) {
    res.render('admin/growers/index', {growers: growers})
  }).catch(res.error)
})

// Show
router.get('/:grower_id', function (req, res) {
  db.Product
  .join({productOrders: 'order'})
  .select('sum(quantity) as quantity')
  .select('sum(quantity * product_orders.cost) as total')
  .where({grower_id: req.grower.id})
  .where({productOrders: {order: {status: 'complete'}}})
  .groupBy('products.id')
  .all().then(function (products) {
    res.render('admin/growers/show', {products: products})
  }).catch(res.error)
})

// Edit
router.get('/:grower_id/users', function (req, res) {
  let ids = db.UserGrower.select('user_id').where({grower_id: req.grower.id})
  db.User.not({id: ids}).all().then(function (users) {
    res.render('admin/growers/users', {users: users})
  }).catch(res.error)
})

// Add User
router.post('/:grower_id/adduser', function (req, res) {
  db.transaction(function () {
    db.UserGrower.create({
      user_id: req.body.user_id,
      grower_id: req.grower.id
    })
  }).then(function () {
    res.flash('success', 'User Added')
    res.redirect(`/admin/growers/${req.grower.id}/users`)
  }).catch(res.error)
})

// Remove User
router.post('/:grower_id/removeuser', function (req, res) {
  db.transaction(function () {
    db.UserGrower.where({
      user_id: req.body.user_id,
      grower_id: req.grower.id
    }).delete()
  }).then(function () {
    res.flash('success', 'User Removed')
    res.redirect(`/admin/growers/${req.grower.id}/users`)
  }).catch(res.error)
})

// Update
router.post('/:grower_id', function (req, res) {
  db.transaction(function () {
    req.grower.update(req.permit('active'))
  }).then(function () {
    res.flash('success', 'Saved')
    res.redirect(req.body.return_to)
  }).catch(res.error)
})
