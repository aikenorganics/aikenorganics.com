exports.up = function (migration, DataTypes, done) {
  migration.sequelize.query(`
    create or replace function check_product_order() returns trigger as $$
    declare
      is_open boolean;
      unavailable boolean;
    begin

      if not (select active from products where id = NEW.product_id) then
        raise 'product must be active';
      end if;

      if not (select active from growers where id = (
        select grower_id from products where id = NEW.product_id
      )) then
        raise 'grower must be active';
      end if;

      is_open := (
        select status = 'open' from orders where id = NEW.order_id
      );

      unavailable := (
        select supply - reserved < NEW.quantity
        from products where id = NEW.product_id
      );

      if is_open and unavailable then
        raise 'not enough supply';
      end if;

      return NEW;
    end;
    $$ language plpgsql;
  `).then(function () {
    done()
  })
}
