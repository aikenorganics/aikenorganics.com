'use strict'

const productJson = require('../products/product')

exports.index = (set, {market, products}) => {
  set('newsHtml', market.newsHtml)
  set('products', products, productJson)
}
