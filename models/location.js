var Sql = require('sequelize')
var sql = require('./sequelize')

module.exports = sql.define('locations', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sql.STRING,
    allowNull: false,
    defaultValue: '',
    set: function (value) {
      this.setDataValue('name', value || '')
    }
  }
}, {
  tableName: 'locations',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
