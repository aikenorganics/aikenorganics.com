var Sql = require('sequelize');
var sql = require('./sequelize');

module.exports = sql.define('User', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true
  },
  email: {
    type: Sql.STRING,
    allowNull: false
  },
  password: {
    type: Sql.STRING,
    allowNull: false
  },
  is_admin: {
    type: Sql.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    set: function(value) {
      this.setDataValue('is_admin', value || false);
    }
  },
  first: {
    type: Sql.STRING,
    allowNull: false,
    defaultValue: '',
    set: function(value) {
      this.setDataValue('first', value || '');
    }
  },
  last: {
    type: Sql.STRING,
    allowNull: false,
    defaultValue: '',
    set: function(value) {
      this.setDataValue('last', value || '');
    }
  },
  phone: {
    type: Sql.STRING,
    allowNull: false,
    defaultValue: '',
    set: function(value) {
      this.setDataValue('phone', value || '');
    }
  }
}, {
  tableName: 'users',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  instanceMethods: {
    isAdmin: function() {
      return this.is_admin ||
        this.email.toLowerCase() === 'dunbarb2@gmail.com' ||
        this.email.toLowerCase() === 'alexandrea@aikenorganics.com';
    }
  }
});
