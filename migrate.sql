create or replace function check_product_order() returns trigger
language plpgsql
AS $$
declare
  is_open boolean;
  unavailable boolean;
  old_quantity integer;
begin

  if tg_op = 'INSERT' then

    if not (select active from products where id = NEW.product_id) then
      raise 'product must be active';
    end if;

    if not (select active from growers where id = (
      select grower_id from products where id = NEW.product_id
    )) then
      raise 'grower must be active';
    end if;

  end if;

  is_open := (
    select status = 'open' from orders where id = NEW.order_id
  );

  old_quantity := (
    select case tg_op when 'UPDATE' then OLD.quantity else 0 end
  );

  unavailable := (
    select supply - reserved < NEW.quantity - old_quantity
    from products where id = NEW.product_id
  );

  if is_open and unavailable then
    raise 'not enough supply';
  end if;

  return NEW;
end;
$$;
