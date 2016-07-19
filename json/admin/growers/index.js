'use strict'

const growerJson = require('../../growers/grower')
const productJson = require('../../products/product')

exports.index = (set, {growers}) => {
  set('growers', growers, growerJson, (set, grower) => {
    set(grower, 'total')
  })
}

exports.orders = (set, {growers}) => {
  set('growers', growers, growerJson, (set, grower) => {
    set('products', grower.products, productJson)
  })
}

exports.show = (set, {grower}) => {
  set('grower', grower, growerJson, (set, grower) => {
    set('products', grower.products, productJson)
  })
}

exports.users = (set, {grower, users}) => {
  set('grower', grower, growerJson)
  set('users', users, (set, user) => set(user, 'email', 'id', 'name'))
}
