exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(
    'alter table product_orders drop constraint product_orders_order_id_fkey,' +
    'add constraint product_orders_order_id_fkey foreign key (order_id) references orders(id) on delete cascade'
  ).then(function () {
    done()
  })
}
