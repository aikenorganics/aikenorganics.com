'use strict'

const db = module.exports = require('./db')

db.User = require('./user')
db.Order = require('./order')
db.Grower = require('./grower')
db.Market = require('./market')
db.Payment = require('./payment')
db.Product = require('./product')
db.Category = require('./category')
db.Location = require('./location')
db.UserGrower = require('./user-grower')
db.ProductOrder = require('./product-order')
