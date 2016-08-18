'use strict'

const db = module.exports = require('./db')

db.User = require('./user')
db.Order = require('./order')
db.Token = require('ozymandias/token')
db.Grower = require('./grower')
db.Market = require('./market')
db.Payment = require('./payment')
db.Product = require('./product')
db.Category = require('./category')
db.Location = require('./location')
db.UserGrower = require('./user-grower')
db.ProductOrder = require('./product-order')

db.User.hasMany('userGrowers', {
  key: 'userId',
  model: db.UserGrower
})

db.UserGrower.belongsTo('user', {
  key: 'userId',
  model: db.User
})

db.Grower.hasMany('userGrowers', {
  key: 'growerId',
  model: db.UserGrower
})

db.UserGrower.belongsTo('grower', {
  key: 'growerId',
  model: db.Grower
})

db.Product.belongsTo('grower', {
  key: 'growerId',
  model: db.Grower
})

db.Grower.hasMany('products', {
  key: 'growerId',
  model: db.Product
})

db.Product.belongsTo('category', {
  key: 'categoryId',
  model: db.Category
})

db.Category.hasMany('products', {
  key: 'categoryId',
  model: db.Product
})

db.Order.belongsTo('location', {
  key: 'locationId',
  model: db.Location
})

db.Location.hasMany('orders', {
  key: 'locationId',
  model: db.Order
})

db.Order.belongsTo('user', {
  key: 'userId',
  model: db.User
})

db.User.hasMany('orders', {
  key: 'userId',
  model: db.Order
})

db.ProductOrder.belongsTo('order', {
  key: 'orderId',
  model: db.Order
})

db.Order.hasMany('productOrders', {
  key: 'orderId',
  model: db.ProductOrder
})

db.ProductOrder.belongsTo('product', {
  key: 'productId',
  model: db.Product
})

db.Product.hasMany('productOrders', {
  key: 'productId',
  model: db.ProductOrder
})

db.Token.belongsTo('user', {
  key: 'userId',
  model: db.User
})

db.User.hasMany('tokens', {
  key: 'userId',
  model: db.Token
})

db.Payment.belongsTo('order', {
  key: 'orderId',
  model: db.Order
})

db.Order.hasMany('payments', {
  key: 'orderId',
  model: db.Payment
})
