'use strict'

const orderJson = require('../../orders/order')
const paymentJson = require('../../payments/payment')
const productOrderJson = require('../../product-orders/product-order')

exports.charge = (set, {payment}) => {
  set('payment', payment, paymentJson)
}

exports.index = (set, {full, locationId, locations, orders, page, productId, products, status}) => {
  set({full, locationId, status, page, productId, more: orders.more})
  set('orders', orders, orderJson, (set, order) => {
    if (order.productOrders) {
      set('productOrders', order.productOrders, productOrderJson)
    }
  })
  set('products', products, (set, product) => set(product, 'id', 'name'))
  set('locations', locations, (set, location) => set(location, 'id', 'name'))
}

exports.show = (set, {locations, order, products}) => {
  set('order', order, orderJson)
  set('payments', order.payments, paymentJson)
  set('products', products, (set, product) => set(product, 'id', 'name'))
  set('locations', locations, (set, location) => set(location, 'id', 'name'))
  set('productOrders', order.productOrders, productOrderJson)
}
