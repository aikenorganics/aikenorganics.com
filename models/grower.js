var Sql = require('sequelize')
var sql = require('./sequelize')

module.exports = sql.define('growers', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sql.STRING,
    allowNull: false,
    defaultValue: ''
  },
  email: {
    type: Sql.STRING,
    allowNull: false,
    defaultValue: '',
    set: function (value) {
      this.setDataValue('email', value || '')
    }
  },
  url: {
    type: Sql.STRING,
    allowNull: false,
    defaultValue: '',
    get: function () {
      var url = this.getDataValue('url')
      if (!/^http:\/\//.test(url)) url = 'http://' + url
      return url
    },
    set: function (value) {
      this.setDataValue('url', value || '')
    }
  },
  location: {
    type: Sql.STRING,
    allowNull: false,
    defaultValue: '',
    set: function (value) {
      this.setDataValue('location', value || '')
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
  }
}, {
  tableName: 'growers',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
