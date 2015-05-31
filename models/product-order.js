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
  },
  cost: {
    type: Sql.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    set: function (value) {
      this.setDataValue('cost', (value || '0').trim().replace(/^\$/, ''))
    },
    validate: {
      isDecimal: function (value) {
        if (!/^\d*(\.\d\d)?$/.test((value || '').trim())) {
          throw new Error('Cost must be a valid dollar amount.')
        }
      }
    }
  }
}, {
  tableName: 'product_orders',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  name: {
    singular: 'productOrder',
    plural: 'productOrders'
  },
  instanceMethods: {
    total: function () {
      return +this.cost * this.quantity
    }
  }
})
