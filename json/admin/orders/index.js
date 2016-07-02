'use strict'

const app = require('../../app')
const orderJson = require('../../orders/order')

exports.index = (set, {full, locations, orders, page, product, products, status}) => {
  set(app)
  set({full, status, page, more: orders.more})
  set('orders', orders, orderJson)
  set('products', products, (set, product) => set(product, 'id', 'name'))
  set('locations', locations, (set, location) => set(location, 'id', 'name'))
  if (product) set('product', product, (set, product) => set(product, 'id', 'name'))
}
