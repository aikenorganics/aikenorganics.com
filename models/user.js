var Sql = require('sequelize');
var sql = new Sql(process.env.DATABASE_URL, {omitNull: true});

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
  }
}, {
  tableName: 'users'
});
