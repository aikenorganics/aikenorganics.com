exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(`
    create function increment_reserved()
    returns trigger
    as $body$
    begin
      update products set reserved = coalesce((
        select sum(quantity) from product_orders where product_id = products.id
      ), 0)
      where id = NEW.product_id;
      return null;
    end;
    $body$ language plpgsql;

    create trigger increment_reserved
    after insert or update of quantity on product_orders
    for each row
    execute procedure increment_reserved();
  `).then(function () {
    done()
  })
}
