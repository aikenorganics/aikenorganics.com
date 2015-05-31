var Sql = require('sequelize')
var sql = require('./sequelize')

module.exports = sql.define('orders', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true
  },
  status: {
    type: Sql.ENUM('open', 'complete', 'canceled'),
    allowNull: false,
    defaultValue: 'open'
  },
  notes: {
    type: Sql.TEXT,
    allowNull: false,
    defaultValue: ''
  }
}, {
  tableName: 'orders',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  instanceMethods: {
    total: function () {
      return this.productOrders.reduce(function (total, productOrder) {
        return total + productOrder.total()
      }, 0)
    }
  }
})
