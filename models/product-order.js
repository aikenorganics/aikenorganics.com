var Sql = require('sequelize')
var sql = require('./sequelize')

module.exports = sql.define('product_orders', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true
  },
  quantity: {
    type: Sql.INTEGER,
    allowNull: false,
    defaultValue: 0,
    set: function (value) {
      this.setDataValue('quantity', value || 0)
    }
  }
}, {
  tableName: 'product_orders',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  instanceMethods: {
    cost: function () {
      return +this.product.cost * this.quantity
    }
  }
})
