'use strict'

const orderJson = require('../orders/order')
const productJson = require('../products/product')

exports.index = (set, {locations, order, products}) => {
  if (order) set('order', order, orderJson)
  set('locations', locations, (set, location) => set(location, 'id', 'name'))
  set('products', products, productJson)
}
