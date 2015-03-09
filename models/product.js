var Sql = require('sequelize');
var sql = require('./sequelize');

module.exports = sql.define('products', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sql.STRING,
    allowNull: false,
    defaultValue: '',
    set: function(value) {
      this.setDataValue('name', value || '');
    }
  },
  cost: {
    type: Sql.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    set: function(value) {
      this.setDataValue('cost', value || '0');
    }
  },
  supply: {
    type: Sql.INTEGER,
    allowNull: false,
    defaultValue: 0,
    set: function(value) {
      this.setDataValue('supply', Math.abs(value));
    }
  },
  unit: {
    type: Sql.STRING,
    allowNull: false,
    defaultValue: '',
    set: function(value) {
      this.setDataValue('unit', value || '');
    }
  },
  description: {
    type: Sql.TEXT,
    allowNull: false,
    defaultValue: '',
    set: function(value) {
      this.setDataValue('description', value || '');
    }
  },
  imaged_at: {
    type: Sql.DATE
  },
  reserved: {
    type: Sql.INTEGER,
    allowNull: false,
    defaultValue: 0,
    set: function(value) {
      this.setDataValue('reserved', value || 0);
    }
  }
}, {
  tableName: 'products',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  instanceMethods: {

    available: function() {
      return Math.max(this.supply - this.reserved, 0);
    },

    updateReserved: function(options) {
      return this.update({
        reserved: Sql.literal(`
          COALESCE((select SUM(quantity) from product_orders
          where product_id = products.id), 0)
        `)
      }, options);
    }
  }
});
