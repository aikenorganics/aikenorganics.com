'use strict'

const productJson = require('../products/product')

exports.index = (set, {products}) => {
  set('products', products, productJson)
}
