var Sql = require('sequelize')
var sql = require('./sequelize')

module.exports = sql.define('products', {
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
    },
    validate: {
      notEmpty: {msg: 'Name must not be empty.'}
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
  },
  supply: {
    type: Sql.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: {msg: 'Supply must be an integer.'},
      notNegative: function (value) {
        if (value < 0) throw new Error('Supply must not be negative.')
      }
    }
  },
  unit: {
    type: Sql.STRING,
    allowNull: false,
    defaultValue: '',
    set: function (value) {
      this.setDataValue('unit', value || '')
    }
  },
  description: {
    type: Sql.TEXT,
    allowNull: false,
    defaultValue: '',
    set: function (value) {
      this.setDataValue('description', value || '')
    }
  },
  imaged_at: {
    type: Sql.DATE
  },
  reserved: {
    type: Sql.INTEGER,
    allowNull: false,
    defaultValue: 0,
    set: function (value) {
      this.setDataValue('reserved', value || 0)
    },
    validate: {
      isInt: {msg: 'Supply must be an integer.'},
      notNegative: function (value) {
        if (value < 0) throw new Error('Supply must not be negative.')
      }
    }
  }
}, {
  tableName: 'products',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  instanceMethods: {

    available: function () {
      return Math.max(this.supply - this.reserved, 0)
    },

    isOversold: function () {
      return this.supply < this.reserved
    },

    reservedCost: function () {
      return +this.cost * this.reserved
    }

  }
})
