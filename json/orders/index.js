'use strict'

const app = require('../app')
const orderJson = require('./order')
const locationJson = require('../locations/location')
const productOrderJson = require('../product-orders/product-order')

exports.current = (set, {locations, order}) => {
  set(app)
  set('locations', locations, (set, location) => {
    set(location, 'id', 'name')
  })
  if (order) {
    set('order', order, orderJson, (set, order) => {
      set('location', order.location, locationJson)
    })
    set('productOrders', order.productOrders, productOrderJson)
  }
}
