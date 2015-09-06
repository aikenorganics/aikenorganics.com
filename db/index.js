'use strict'

let db = module.exports = require('./db')

db.User = require('./user')
db.Grower = require('./grower')
db.Market = require('./market')
db.Product = require('./product')
db.Category = require('./category')
db.Location = require('./location')
db.UserGrower = require('./user-grower')

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
