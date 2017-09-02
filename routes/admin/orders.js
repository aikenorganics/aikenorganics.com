'use strict'

const {Location, Order, Product, ProductOrder} = require('../../db')
const csv = require('../../lib/csv')
const {get, post} = require('koa-route')

module.exports = [

  // Index
  get('/admin/orders', async (_) => {
    const full = _.query.full === '1'
    let {locationId, productId, status} = _.query

    if (!Array.isArray(status)) status = [status || 'open']

    const scope = Order.include('user', 'location').where({status})

    // Product
    if (productId) {
      scope.where({id: ProductOrder.select('orderId').where({productId})})
    }

    // Location
    if (locationId === 'delivery') {
      scope.where({locationId: null})
    } else if (locationId) {
      scope.where({locationId})
    }

    // CSV
    if (_.query.csv) {
      const orders = await scope.all()
      _.type = 'csv'
      _.body = csv.row('id', 'name', 'email', 'member', 'location', 'delivery')
      for (const {id, location, user} of orders) {
        _.body += csv.row(
          id,
          user.name,
          user.email,
          user.memberUntil > new Date() ? '✓' : '',
          location ? location.name : user.address,
          location ? '' : '✓'
        )
      }
      return
    }

    // Pagination
    const page = +(_.query.page || 1)

    // Include product orders?
    if (full) scope.include({productOrders: {product: 'grower'}})

    const [orders, locations, products] = await Promise.all([
      scope.order(['createdAt', 'descending']).paginate(page, 50),
      Location.order('name').all(),
      Product.order('name').all()
    ])

    _.render({
      full,
      locations: locations.map((location) => location.slice('id', 'name')),
      locationId,
      more: orders.more,
      orders: orders.map((order) => (
        Object.assign(order.toJSON(), order.slice('productOrders'))
      )),
      page,
      products: products.map((product) => product.slice('id', 'name')),
      productId,
      status
    })
  }),

  // Show
  get('/admin/orders/:id', async (_, id) => {
    const [order, products, locations] = await Promise.all([
      Order.include(
        'user', 'location', 'payments', {productOrders: 'product'}
      ).find(id),

      Product.join('grower')
      .where({active: true, grower: {active: true}})
      .where('supply > reserved').order('name').all(),

      Location.order('name').all()
    ])
    if (!order) return _.notfound()

    _.render({
      locations: locations.map((location) => location.slice('id', 'name')),
      order,
      payments: order.payments,
      productOrders: order.productOrders,
      products: products.map((product) => product.slice('id', 'name'))
    })
  }),

  // Charge
  post('/admin/orders/:id/charge', async (_, id) => {
    const order = await Order.find(id)
    if (!order) return _.notfound()
    const amount = (+_.request.body.amount * 100) | 0
    const payment = await order.charge(amount)
    _.body = {payment}
  })

]
