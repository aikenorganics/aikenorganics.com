'use strict'

let db = module.exports = require('./db')

db.User = require('./user')
db.Order = require('./order')
db.Token = require('./token')
db.Grower = require('./grower')
db.Market = require('./market')
db.Product = require('./product')
db.Category = require('./category')
db.Location = require('./location')
db.UserGrower = require('./user-grower')
db.ProductOrder = require('./product-order')

db.User.hasMany('userGrowers', {
  key: 'user_id',
  model: db.UserGrower
})

db.UserGrower.belongsTo('user', {
  key: 'user_id',
  model: db.User
})

db.Grower.hasMany('userGrowers', {
  key: 'grower_id',
  model: db.UserGrower
})

db.UserGrower.belongsTo('grower', {
  key: 'grower_id',
  model: db.Grower
})

db.Product.belongsTo('grower', {
  key: 'grower_id',
  model: db.Grower
})

db.Grower.hasMany('products', {
  key: 'grower_id',
  model: db.Product
})

db.Product.belongsTo('category', {
  key: 'category_id',
  model: db.Category
})

db.Category.hasMany('products', {
  key: 'category_id',
  model: db.Product
})

db.Order.belongsTo('location', {
  key: 'location_id',
  model: db.Location
})

db.Location.hasMany('orders', {
  key: 'location_id',
  model: db.Order
})

db.Order.belongsTo('user', {
  key: 'user_id',
  model: db.User
})

db.User.hasMany('orders', {
  key: 'user_id',
  model: db.Order
})

db.ProductOrder.belongsTo('order', {
  key: 'order_id',
  model: db.Order
})

db.Order.hasMany('productOrders', {
  key: 'order_id',
  model: db.ProductOrder
})

db.ProductOrder.belongsTo('product', {
  key: 'product_id',
  model: db.Product
})

db.Product.hasMany('productOrders', {
  key: 'product_id',
  model: db.ProductOrder
})

db.Token.belongsTo('user', {
  key: 'user_id',
  model: db.User
})

db.User.hasMany('tokens', {
  key: 'user_id',
  model: db.Token
})
