var Sql = require('sequelize');
var sql = require('./sequelize');

module.exports = sql.define('categories', {
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
  position: {
    type: Sql.FLOAT,
    allowNull: false,
    defaultValue: 0,
    set: function(value) {
      this.setDataValue('position', value || 0);
    }
  }
}, {
  tableName: 'categories',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
