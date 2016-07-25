'use strict'

const productJson = require('../../products/product')

exports.index = (set, {oversold, page, products, search}) => {
  set({oversold, page, search})
  set(products, 'more')
  set('products', products, productJson)
}
