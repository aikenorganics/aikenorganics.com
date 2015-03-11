var Sql = require('sequelize')
var sql = require('./sequelize')

module.exports = sql.define('tokens', {
  id: {
    type: Sql.STRING,
    primaryKey: true
  },
  expires_at: {
    type: Sql.DATE,
    allowNull: false
  }
}, {
  tableName: 'tokens',
  createdAt: false,
  updatedAt: false
})
