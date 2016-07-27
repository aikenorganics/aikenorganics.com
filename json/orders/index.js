'use strict'

const orderJson = require('./order')
const locationJson = require('../locations/location')
const productOrderJson = require('../product-orders/product-order')

exports.current = (set, {locations, order}) => {
  set('locations', locations, (set, location) => {
    set(location, 'id', 'name')
  })
  if (order) {
    set('order', order, orderJson, (set, order) => {
      if (order.location) set('location', order.location, locationJson)
    })
    set('productOrders', order.productOrders, productOrderJson)
  }
}

exports.previous = (set, {orders, page}) => {
  set({page})
  set(orders, 'more')
  set('orders', orders, orderJson, (set, order) => {
    set('productOrders', order.productOrders, productOrderJson)
  })
}
