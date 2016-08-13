'use strict'

const growerJson = require('./grower')
const productJson = require('../products/product')
const categoryJson = require('../categories/category')

exports.create = (set, {grower}) => {
  set('grower', grower, growerJson, (set, grower) => {
    set(grower, 'description')
  })
}

exports.edit = (set, {grower}) => {
  set('grower', grower, growerJson, (set, grower) => {
    set(grower, 'description')
  })
}

exports.index = (set, {growers}) => {
  set('growers', growers, growerJson)
}

exports.new = (set) => {}

exports.newProduct = (set, {categories, grower}) => {
  set('grower', grower, growerJson)
  set('categories', categories, categoryJson)
}

exports.orders = (set, {grower, products}) => {
  set('grower', grower, growerJson)
  set('products', products, productJson)
}

exports.products = (set, {grower, products}) => {
  set('grower', grower, growerJson)
  set('products', products, productJson)
}

exports.show = (set, {grower, products}) => {
  set('grower', grower, growerJson, (set, grower) => {
    set(grower, 'description')
  })
  set('products', products, productJson)
}
