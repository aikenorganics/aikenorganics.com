'use strict'

const productJson = require('./product')
const categoryJson = require('../categories/category')

exports.edit = (set, {categories, product}) => {
  set('categories', categories, categoryJson)
  set('product', product, productJson, (set, product) => {
    set(product, 'description')
  })
}

exports.image = (set, {product}) => {
  set('product', product, productJson)
}

exports.index = (set, {categories, categoryId, page, products, search}) => {
  set({categoryId, page, search})
  set(products, 'more')
  set('categories', categories, categoryJson)
  set('products', products, productJson)
}

exports.show = (set, {product}) => {
  set('product', product, productJson, (set, product) => {
    set(product, 'descriptionHtml')
  })
}

exports.update = (set, {product}) => {
  set('product', product, productJson, (set, product) => {
    set(product, 'description')
  })
}
