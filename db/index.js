'use strict'

module.exports = Object.assign(require('ozymandias/db/instance'), {
  User: require('./user'),
  Event: require('./event'),
  Order: require('./order'),
  Grower: require('./grower'),
  Market: require('./market'),
  Payment: require('./payment'),
  Product: require('./product'),
  Category: require('./category'),
  Location: require('./location'),
  UserGrower: require('./user-grower'),
  ProductOrder: require('./product-order')
})
