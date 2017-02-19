'use strict'

const {Grower, Product, User} = require('../../db')
const {get} = require('koa-route')

const findGrower = (id) => Grower.include({userGrowers: 'user'}).find(id)

module.exports = [

  // Index
  get('/admin/growers', function *() {
    const growers = yield Grower
    .select(`(
      select sum(quantity * product_orders.cost) from product_orders
      inner join products on products.id = product_orders.product_id
      inner join orders on orders.id = product_orders.order_id
      where products.grower_id = growers.id and orders.status = 'complete'
    ) as total`)
    .order('name').all()
    this.react({growers})
  }),

  // Orders
  get('/admin/growers/orders', function *() {
    const growers = yield Grower
    .where('exists(select id from products where reserved > 0 and grower_id = growers.id)')
    .include('products').order('name').all()
    this.react({
      growers: growers.map((grower) => (
        Object.assign(grower.toJSON(), grower.slice('products'))
      ))
    })
  }),

  // Show
  get('/admin/growers/:id', function *(id) {
    const grower = yield findGrower(id)
    if (!grower) return this.notfound()

    const products = yield Product
    .join({productOrders: 'order'})
    .select('sum(quantity) as quantity')
    .select('sum(quantity * product_orders.cost) as total')
    .where({growerId: id})
    .where({productOrders: {order: {status: 'complete'}}})
    .groupBy('products.id')
    .all()

    this.react({
      grower,
      products: products.map((product) => (
        Object.assign(product.toJSON(), product.slice('quantity', 'total'))
      ))
    })
  }),

  // Users
  get('/admin/growers/:id/users', function *(id) {
    const grower = yield findGrower(id)
    if (!grower) return this.notfound()

    const users = yield User.order('first').all()

    this.react({
      grower,
      users: users.map((user) => user.slice('email', 'id', 'name'))
    })
  })

]
