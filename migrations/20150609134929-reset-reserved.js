exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(`
    create or replace function reset_reserved()
    returns void
    as $$
    begin
      update products set reserved = coalesce((
        select sum(quantity) from product_orders
        inner join orders on
          orders.status = 'open' and
          orders.id = order_id
        where
          product_id = products.id
      ), 0);
    end;
    $$ language plpgsql;
  `).then(function () {
    done()
  })
}
