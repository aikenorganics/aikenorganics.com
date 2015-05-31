exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(`
    create or replace function set_product_order_cost() returns trigger as $$
    begin
      NEW.cost := (select cost from products where id = NEW.product_id);
      return NEW;
    end;
    $$ language plpgsql;

    create trigger set_product_order_cost
    before insert on product_orders
    for each row
    execute procedure set_product_order_cost();
  `).then(function () {
    done()
  })
}
