exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(`
    update product_orders set cost = (
      select cost from products where id = product_orders.product_id
    );
  `).then(function () {
    done()
  })
}
