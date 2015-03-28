exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(`
    create function decrement_reserved()
    returns trigger
    as $body$
    begin
      update products set reserved = coalesce((
        select sum(quantity) from product_orders where product_id = products.id
      ), 0)
      where id = OLD.product_id;
      return null;
    end;
    $body$ language plpgsql;

    create trigger decrement_reserved
    after delete on product_orders
    for each row
    execute procedure decrement_reserved();
  `).then(function () {
    done()
  })
}
