var Sql = require('sequelize');
var sql = require('./sequelize');

module.exports = sql.define('Post', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true
  },
  content: {
    type: Sql.TEXT,
    allowNull: false
  },
  author_id: {
    type: Sql.INTEGER,
    allowNull: false
  },
  title: {
    type: Sql.STRING,
    allowNull: false
  }
}, {
  tableName: 'posts',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
