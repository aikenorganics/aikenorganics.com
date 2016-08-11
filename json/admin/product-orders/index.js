'use strict'

const productOrderJson = require('../../product-orders/product-order')

exports.create = (set, {productOrder}) => {
  set('productOrder', productOrder, productOrderJson)
}

exports.update = (set, {productOrder}) => {
  set('productOrder', productOrder, productOrderJson)
}
