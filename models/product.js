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
  available: {
    type: Sql.INTEGER,
    allowNull: false,
    defaultValue: 0,
    set: function(value) {
      this.setDataValue('available', Math.abs(value));
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
  }
}, {
  tableName: 'products',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
