exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(`
    alter table orders
    add column status order_status
    not null default 'open';
  `).then(function () {
    done()
  })
}
