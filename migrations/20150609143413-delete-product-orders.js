exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(`
    create or replace function delete_product_orders()
    returns trigger
    as $$
    begin
      delete from product_orders
      where order_id = OLD.id;
      return OLD;
    end;
    $$ language plpgsql;

    create trigger delete_product_orders
    before delete on orders
    for each row
    execute procedure delete_product_orders();
  `).then(function () {
    done()
  })
}
