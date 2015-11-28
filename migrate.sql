create or replace function is_product_active(int) returns boolean
language plpgsql
as $$
begin
  return coalesce((
    select products.active and growers.active
    from products
    inner join growers on products.grower_id = growers.id
    where products.id = $1
  ), false);
end;
$$;

create or replace function check_product_order() returns trigger
language plpgsql
AS $$
declare
  is_open boolean;
  unavailable boolean;
  old_quantity integer;
begin

  if tg_op = 'INSERT' and not is_product_active(NEW.product_id) then
    raise 'product and grower must be active';
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

create or replace function checkout(int, int, int[]) returns boolean
language plpgsql
AS $$
declare
  oid int;
  poid int;
  available int;
  product int[];
begin

  update orders set location_id = $2
  where user_id = $1 and status = 'open'
  returning id into oid;

  if oid is null then
    insert into orders (user_id, location_id)
    values ($1, $2) returning id into oid;
  end if;

  foreach product slice 1 in array $3 loop

    poid := null;
    available := (
      select supply - reserved from products
      where id = product[1]
    );

    if available = 0 or not is_product_active(product[1]) then
      continue;
    end if;

    update product_orders set
    quantity = quantity + least(available, product[2])
    where order_id = oid and product_id = product[1]
    returning id into poid;

    if poid is null then
      insert into product_orders (order_id, product_id, quantity)
      values (oid, product[1], least(available, product[2]));
    end if;

  end loop;

  return true;

end;
$$;
