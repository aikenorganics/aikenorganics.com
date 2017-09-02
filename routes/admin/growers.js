'use strict'

const {Grower, Product, User} = require('../../db')
const {get} = require('koa-route')

const findGrower = (id) => Grower.include({userGrowers: 'user'}).find(id)

module.exports = [

  // Index
  get('/admin/growers', async (_) => {
    const growers = await Grower
    .select(`(
      select sum(quantity * product_orders.cost) from product_orders
      inner join products on products.id = product_orders.product_id
      inner join orders on orders.id = product_orders.order_id
      where products.grower_id = growers.id and orders.status = 'complete'
    ) as total`)
    .order('name').all()
    _.render({growers})
  }),

  // Orders
  get('/admin/growers/orders', async (_) => {
    const growers = await Grower
    .where('exists(select id from products where reserved > 0 and grower_id = growers.id)')
    .include('products').order('name').all()
    _.render({
      growers: growers.map((grower) => (
        Object.assign(grower.toJSON(), grower.slice('products'))
      ))
    })
  }),

  // Show
  get('/admin/growers/:id', async (_, id) => {
    const grower = await findGrower(id)
    if (!grower) return _.notfound()

    const products = await Product
    .join({productOrders: 'order'})
    .select('sum(quantity) as quantity')
    .select('sum(quantity * product_orders.cost) as total')
    .where({growerId: id})
    .where({productOrders: {order: {status: 'complete'}}})
    .groupBy('products.id')
    .all()

    _.render({
      grower,
      products: products.map((product) => (
        Object.assign(product.toJSON(), product.slice('quantity', 'total'))
      ))
    })
  }),

  // Users
  get('/admin/growers/:id/users', async (_, id) => {
    const grower = await findGrower(id)
    if (!grower) return _.notfound()

    const users = await User.order('first').all()

    _.render({
      grower,
      users: users.map((user) => user.slice('email', 'id', 'name'))
    })
  })

]
