var Sql = require('sequelize');
var sql = new Sql(process.env.DATABASE_URL);

module.exports = sql.define('User', {
  id: {
    type: Sql.INTEGER,
    primaryKey: true
  }
}, {
  tableName: 'users'
});
