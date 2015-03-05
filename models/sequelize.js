var Sql = require('sequelize');

module.exports = new Sql(process.env.DATABASE_URL, {
  omitNull: true,
  logging: process.env.LOG_SQL ? console.log : false
});
