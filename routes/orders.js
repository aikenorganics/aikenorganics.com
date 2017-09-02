'use strict'

const {Location, Order} = require('../db')
const {all, del, get, post} = require('koa-route')

module.exports = [

  // User required!
  all('/orders', async (_, next) => {
    if (!_.state.currentUser) return _.unauthorized()
    await next()
  }, {end: false}),

  // Current
  get('/orders/current', async (_) => {
    const {currentUser} = _.state
    const [order, locations] = await Promise.all([
      Order
        .include('location', {productOrders: 'product'})
        .where({status: 'open', userId: currentUser.id})
        .find(),
      Location.where({active: true}).order('name').all()
    ])
    _.render({
      locations: locations.map((location) => location.slice('id', 'name')),
      order,
      productOrders: order && order.productOrders
    })
  }),

  // Previous
  get('/orders/previous', async (_) => {
    const page = +(_.query.page || 1)
    const {currentUser} = _.state
    const orders = await Order
      .include('location', {productOrders: 'product'})
      .where({status: 'complete', userId: currentUser.id})
      .order(['createdAt', 'descending'])
      .paginate(page, 10)

    _.render({
      more: orders.more,
      orders: orders.map((order) => (
        Object.assign(order.toJSON(), {productOrders: order.productOrders})
      )),
      page
    })
  }),

  // Update
  post('/orders/:id', async (_, id) => {
    const order = await Order.find(id)
    const {currentUser} = _.state

    if (!order) return _.notfound()

    // You can only update when the market is open.
    if (!_.state.admin && !_.state.open) {
      return _.unauthorized()
    }

    // You can only update your own order.
    if (!_.state.admin && currentUser.id !== order.userId) {
      return _.unauthorized()
    }

    const values = _.permit('locationId')

    if (_.state.admin) {
      Object.assign(values, _.permit('notes', 'status'))
    }

    await order.update(values)
    order.location = await Location.find(order.locationId)
    _.body = {order}
  }),

  // Cancel
  del('/orders/:id', async (_, id) => {
    if (!_.state.open) return _.unauthorized()

    const order = await Order.find(id)
    const {currentUser} = _.state

    if (!order) return _.notfound()

    // You can only cancel your own order.
    if (currentUser.id !== order.userId) return _.unauthorized()

    await order.destroy()
    _.body = {}
  })

]
