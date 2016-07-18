'use strict'

const app = require('../app')
const productJson = require('./product')
const categoryJson = require('../categories/category')

exports.edit = (set, {categories, product}) => {
  set(app)
  set('categories', categories, categoryJson)
  set('product', product, productJson, (set, product) => {
    set(product, 'description')
  })
}

exports.index = (set, {categories, products}) => {
  set(app)
  set(products, 'more')
  set('categories', categories, categoryJson)
  set('products', products, productJson)
}

exports.show = (set, {product}) => {
  set(app)
  set('product', product, productJson, (set, product) => {
    set(product, 'description')
  })
}
