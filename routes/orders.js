'use strict'

const {Location, Order} = require('../db')
const {all, del, get, post} = require('koa-route')

module.exports = [

  // User required!
  all('/orders', function *(next) {
    if (!this.state.currentUser) return this.unauthorized()
    yield next
  }, {end: false}),

  // Current
  get('/orders/current', function *() {
    const {currentUser} = this.state
    const [order, locations] = yield Promise.all([
      Order
        .include('location', {productOrders: 'product'})
        .where({status: 'open', userId: currentUser.id})
        .find(),
      Location.where({active: true}).order('name').all()
    ])
    this.react({
      locations: locations.map((location) => location.slice('id', 'name')),
      order,
      productOrders: order && order.productOrders
    })
  }),

  // Previous
  get('/orders/previous', function *() {
    const page = +(this.query.page || 1)
    const {currentUser} = this.state
    const orders = yield Order
      .include('location', {productOrders: 'product'})
      .where({status: 'complete', userId: currentUser.id})
      .order(['createdAt', 'descending'])
      .paginate(page, 10)

    this.react({
      more: orders.more,
      orders: orders.map((order) => (
        Object.assign(order.toJSON(), {productOrders: order.productOrders})
      )),
      page
    })
  }),

  // Update
  post('/orders/:id', function *(id) {
    const order = yield Order.find(id)
    const {currentUser} = this.state

    if (!order) return this.notfound()

    // You can only update when the market is open.
    if (!this.state.admin && !this.state.open) {
      return this.unauthorized()
    }

    // You can only update your own order.
    if (!this.state.admin && currentUser.id !== order.userId) {
      return this.unauthorized()
    }

    const values = this.permit('locationId')

    if (this.state.admin) {
      Object.assign(values, this.permit('notes', 'status'))
    }

    yield order.update(values)
    order.location = yield Location.find(order.locationId)
    this.body = {order}
  }),

  // Cancel
  del('/orders/:id', function *(id) {
    if (!this.state.open) return this.unauthorized()

    const order = yield Order.find(id)
    const {currentUser} = this.state

    if (!order) return this.notfound()

    // You can only cancel your own order.
    if (currentUser.id !== order.userId) return this.unauthorized()

    yield order.destroy()
    this.body = {}
  })

]
