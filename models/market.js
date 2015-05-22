var Sql = require('sequelize')
var sql = require('./sequelize')

module.exports = sql.define('markets', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true
  },
  open: {
    type: Sql.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  domain: {
    type: Sql.STRING,
    allowNull: false,
    defaultValue: ''
  }
}, {
  tableName: 'markets',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
