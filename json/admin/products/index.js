'use strict'

const app = require('../../app')
const productJson = require('../../products/product')

exports.index = (set, {oversold, page, products}) => {
  set(app)
  set({oversold, page})
  set(products, 'more')
  set('products', products, productJson)
}
