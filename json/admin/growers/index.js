'use strict'

const app = require('../../app')
const growerJson = require('../../growers/grower')
const productJson = require('../../products/product')

exports.index = (set, {growers}) => {
  set(app)
  set('growers', growers, growerJson, (set, grower) => {
    set(grower, 'total')
  })
}

exports.orders = (set, {growers}) => {
  set(app)
  set('growers', growers, growerJson, (set, grower) => {
    set('products', grower.products, productJson)
  })
}
