var Sql = require('sequelize')
var sql = require('./sequelize')

module.exports = sql.define('orders', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true
  }
}, {
  tableName: 'orders',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  instanceMethods: {
    cost: function () {
      return this.productOrders.reduce(function (total, productOrder) {
        return total + productOrder.cost()
      }, 0)
    }
  }
})
