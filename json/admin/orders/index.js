'use strict'

const app = require('../../app')
const orderJson = require('../../orders/order')
const paymentJson = require('../../payments/payment')
const productOrderJson = require('../../product-orders/product-order')

exports.index = (set, {full, locations, orders, page, product, products, status}) => {
  set(app)
  set({full, status, page, more: orders.more})
  set('orders', orders, orderJson, (set, order) => {
    if (order.productOrders) {
      set('productOrders', order.productOrders, productOrderJson)
    }
  })
  set('products', products, (set, product) => set(product, 'id', 'name'))
  set('locations', locations, (set, location) => set(location, 'id', 'name'))
  if (product) set('product', product, (set, product) => set(product, 'id', 'name'))
}

exports.show = (set, {locations, order, products}) => {
  set(app)
  set('order', order, orderJson)
  set('payments', order.payments, paymentJson)
  set('products', products, (set, product) => set(product, 'id', 'name'))
  set('locations', locations, (set, location) => set(location, 'id', 'name'))
  set('productOrders', order.productOrders, productOrderJson)
}
