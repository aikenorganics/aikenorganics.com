exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(`
    create type order_status as enum ('open', 'complete', 'canceled');
  `).then(function () {
    done()
  })
}
