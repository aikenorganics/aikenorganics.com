'use strict'

const app = require('../app')
const growerJson = require('./grower')
const productJson = require('../products/product')
const categoryJson = require('../categories/category')

exports.edit = (set, {grower}) => {
  set(app)
  set('grower', grower, growerJson, (set, grower) => {
    set(grower, 'description')
  })
}

exports.index = (set, {growers}) => {
  set(app)
  set('growers', growers, growerJson)
}

exports.new = (set) => {
  set(app)
}

exports.newProduct = (set, {categories, grower}) => {
  set(app)
  set('grower', grower, growerJson)
  set('categories', categories, categoryJson)
}

exports.orders = (set, {grower, products}) => {
  set(app)
  set('grower', grower, growerJson)
  set('products', products, productJson)
}

exports.products = (set, {grower, products}) => {
  set(app)
  set('grower', grower, growerJson)
  set('products', products, productJson)
}

exports.show = (set, {grower, products}) => {
  set(app)
  set('grower', grower, growerJson, (set, grower) => {
    set(grower, 'description')
  })
  set('products', products, productJson)
}
