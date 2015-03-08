var Sql = require('sequelize');
var sql = require('./sequelize');

exports.close = function() { sql.close(); };

var User = exports.User = require('./user');
var Post = exports.Post = require('./post');
var Token = exports.Token = require('./token');
var Grower = exports.Grower = require('./grower');
var Product = exports.Product = require('./product');
var Category = exports.Category = require('./category');

// Relations

User.hasMany(Post, {
  as: 'posts',
  foreignKey: 'author_id'
});

Post.belongsTo(User, {
  as: 'author',
  foreignKey: 'author_id'
});

Grower.hasMany(Product, {
  as: 'products',
  foreignKey: 'grower_id'
});

Product.belongsTo(Grower, {
  as: 'grower',
  foreignKey: 'grower_id'
});

Category.hasMany(Product, {
  as: 'products',
  foreignKey: 'category_id'
});

Product.belongsTo(Category, {
  as: 'category',
  foreignKey: 'category_id'
});

User.hasMany(Token, {
  as: 'tokens',
  foreignKey: 'user_id'
});

Token.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id'
});
