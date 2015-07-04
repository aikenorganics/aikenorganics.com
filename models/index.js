// Convenience
exports.sequelize = require('./sequelize')

// Models
var User = exports.User = require('./user')
var Post = exports.Post = require('./post')
var Order = exports.Order = require('./order')
var Token = exports.Token = require('./token')
var Grower = exports.Grower = require('./grower')
exports.Market = require('./market')
var Product = exports.Product = require('./product')
var Location = exports.Location = require('./location')
var Category = exports.Category = require('./category')
var UserGrower = exports.UserGrower = require('./user-grower')
var ProductOrder = exports.ProductOrder = require('./product-order')

// Relations
User.hasMany(Post, {
  as: 'posts',
  foreignKey: 'author_id'
})

Post.belongsTo(User, {
  as: 'author',
  foreignKey: 'author_id'
})

Grower.hasMany(Product, {
  as: 'products',
  foreignKey: 'grower_id'
})

Product.belongsTo(Grower, {
  as: 'grower',
  foreignKey: 'grower_id'
})

Category.hasMany(Product, {
  as: 'products',
  foreignKey: 'category_id'
})

Product.belongsTo(Category, {
  as: 'category',
  foreignKey: 'category_id'
})

User.hasMany(Token, {
  as: 'tokens',
  foreignKey: 'user_id'
})

Token.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id'
})

User.hasMany(Order, {
  as: 'orders',
  foreignKey: 'user_id'
})

Order.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id'
})

Product.hasMany(ProductOrder, {
  as: 'productOrders',
  foreignKey: 'product_id'
})

ProductOrder.belongsTo(Product, {
  as: 'product',
  foreignKey: 'product_id'
})

Order.hasMany(ProductOrder, {
  as: 'productOrders',
  foreignKey: 'order_id'
})

ProductOrder.belongsTo(Order, {
  as: 'order',
  foreignKey: 'order_id'
})

User.hasMany(UserGrower, {
  as: 'userGrowers',
  foreignKey: 'user_id'
})

UserGrower.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id'
})

Grower.hasMany(UserGrower, {
  as: 'userGrowers',
  foreignKey: 'grower_id'
})

UserGrower.belongsTo(Grower, {
  as: 'grower',
  foreignKey: 'grower_id'
})
