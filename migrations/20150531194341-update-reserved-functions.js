exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(`
    create or replace function increment_reserved()
    returns trigger
    as $$
    begin
      update products set
        reserved = reserved + NEW.quantity
      from orders
      where
        orders.id = NEW.order_id and
        orders.status = 'open' and
        products.id = NEW.product_id;
      return null;
    end;
    $$ language plpgsql;

    create or replace function decrement_reserved()
    returns trigger
    as $$
    begin
      update products set
        reserved = reserved - OLD.quantity
      from orders
      where
        orders.id = OLD.order_id and
        orders.status = 'open' and
        products.id = OLD.product_id;
      return null;
    end;
    $$ language plpgsql;

    create or replace function update_reserved()
    returns trigger
    as $$
    begin
      update products set
        reserved = reserved + NEW.quantity
      from orders
      where
        orders.id = NEW.order_id and
        orders.status = 'open' and
        products.id = NEW.product_id;

      update products set
        reserved = reserved - OLD.quantity
      from orders
      where
        orders.id = OLD.order_id and
        orders.status = 'open' and
        products.id = OLD.product_id;

      return null;
    end;
    $$ language plpgsql;

    drop trigger decrement_reserved on product_orders;
    drop trigger increment_reserved on product_orders;

    create trigger decrement_reserved
    after delete on product_orders
    for each row
    execute procedure decrement_reserved();

    create trigger increment_reserved
    after insert on product_orders
    for each row
    execute procedure increment_reserved();

    create trigger update_reserved
    after update on product_orders
    for each row
    execute procedure update_reserved();
  `).then(function () {
    done()
  })
}
