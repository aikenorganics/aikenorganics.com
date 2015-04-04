exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(`
    create or replace function decrement_reserved()
    returns trigger
    as $$
    begin
      update products set reserved = coalesce((
        select sum(product_orders.quantity)
        from product_orders
        inner join orders on product_orders.order_id = orders.id
        where product_orders.product_id = products.id
        and orders.status = 'open'
      ), 0)
      where id = OLD.product_id;
      return null;
    end;
    $$ language plpgsql;
  `).then(function () {
    done()
  })
}
