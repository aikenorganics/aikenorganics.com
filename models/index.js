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
  as: 'Posts',
  foreignKey: 'author_id'
});

Post.belongsTo(User, {
  as: 'Author',
  foreignKey: 'author_id'
});

Grower.hasMany(Product, {
  as: 'Products',
  foreignKey: 'grower_id'
});

Product.belongsTo(Grower, {
  as: 'Grower',
  foreignKey: 'grower_id'
});

Category.hasMany(Product, {
  as: 'Products',
  foreignKey: 'category_id'
});

Product.belongsTo(Category, {
  as: 'Category',
  foreignKey: 'category_id'
});

User.hasMany(Token, {
  as: 'Tokens',
  foreignKey: 'user_id'
});

Token.belongsTo(User, {
  as: 'User',
  foreignKey: 'user_id'
});
