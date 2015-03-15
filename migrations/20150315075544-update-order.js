module.exports = {
  up: function (migration, DataTypes, done) {
    migration.sequelize.query(`
      create function update_status()
      returns trigger
      as $body$
      begin
        update products set reserved = coalesce((
          select sum(product_orders.quantity)
          from product_orders
          inner join orders on product_orders.order_id = orders.id
          where product_orders.product_id = products.id
          and orders.status = 'open'
        ), 0)
        where id in (
          select product_id
          from product_orders
          where order_id = NEW.id
        );
        return null;
      end;
      $body$ language plpgsql;

      create trigger update_order_status
      after update of status on orders
      for each row
      execute procedure update_status();
    `).then(function () {
      done()
    })
  }
}
