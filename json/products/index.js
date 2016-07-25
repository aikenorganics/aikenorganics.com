'use strict'

const productJson = require('./product')
const categoryJson = require('../categories/category')

exports.edit = (set, {categories, product}) => {
  set('categories', categories, categoryJson)
  set('product', product, productJson, (set, product) => {
    set(product, 'description')
  })
}

exports.index = (set, {categories, page, products, search}) => {
  set({page, search})
  set(products, 'more')
  set('categories', categories, categoryJson)
  set('products', products, productJson)
}

exports.show = (set, {product}) => {
  set('product', product, productJson, (set, product) => {
    set(product, 'description')
  })
}
