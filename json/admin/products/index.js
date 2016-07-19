'use strict'

const productJson = require('../../products/product')

exports.index = (set, {oversold, page, products}) => {
  set({oversold, page})
  set(products, 'more')
  set('products', products, productJson)
}
