'use strict'

const {Location, Order, Product, ProductOrder} = require('../../db')
const csv = require('../../lib/csv')
const {get, post} = require('koa-route')

module.exports = [

  // Index
  get('/admin/orders', function *() {
    const full = this.query.full === '1'
    let {locationId, productId, status} = this.query

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
    if (this.query.csv) {
      const orders = yield scope.all()
      this.type = 'csv'
      this.body = csv.row('id', 'name', 'email', 'member', 'location', 'delivery')
      for (const {id, location, user} of orders) {
        this.body += csv.row(
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
    const page = +(this.query.page || 1)

    // Include product orders?
    if (full) scope.include({productOrders: 'product'})

    const [orders, locations, products] = yield Promise.all([
      scope.order(['createdAt', 'descending']).paginate(page, 50),
      Location.order('name').all(),
      Product.order('name').all()
    ])

    this.react({
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
  get('/admin/orders/:id', function *(id) {
    const [order, products, locations] = yield Promise.all([
      Order.include(
        'user', 'location', 'payments', {productOrders: 'product'}
      ).find(id),

      Product.join('grower')
      .where({active: true, grower: {active: true}})
      .where('supply > reserved').order('name').all(),

      Location.order('name').all()
    ])
    if (!order) return this.notfound()

    this.react({
      locations: locations.map((location) => location.slice('id', 'name')),
      order,
      payments: order.payments,
      productOrders: order.productOrders,
      products: products.map((product) => product.slice('id', 'name'))
    })
  }),

  // Charge
  post('/admin/orders/:id/charge', function *(id) {
    const order = yield Order.find(id)
    if (!order) return this.notfound()
    const amount = (+this.request.body.amount * 100) | 0
    const payment = yield order.charge(amount)
    this.body = {payment}
  })

]
