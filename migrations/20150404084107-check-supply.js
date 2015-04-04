exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(`
    create or replace function check_product_order() returns trigger as $$
    begin

      if not (select active from products where id = NEW.product_id) then
        raise 'product must be active';
      end if;

      if not (select active from growers where id = (
        select grower_id from products where id = NEW.product_id
      )) then
        raise 'grower must be active';
      end if;

      if NEW.quantity > (
        select supply - reserved from products where id = NEW.product_id
      ) then
        raise 'not enough supply';
      end if;

      return NEW;
    end;
    $$ language plpgsql;

    drop trigger check_product_order on product_orders;

    create trigger check_product_order
    before insert or update on product_orders
    for each row
    execute procedure check_product_order();

  `).then(function () {
    done()
  })
}
