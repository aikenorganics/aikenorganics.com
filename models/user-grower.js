var Sql = require('sequelize')
var sql = require('./sequelize')

module.exports = sql.define('user_growers', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true
  }
}, {
  tableName: 'user_growers',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
