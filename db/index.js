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

db.Token.belongsTo('user', {
  key: 'userId',
  model: db.User
})

db.User.hasMany('tokens', {
  key: 'userId',
  model: db.Token
})
