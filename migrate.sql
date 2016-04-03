CREATE OR REPLACE FUNCTION checkout(integer, integer, integer[]) RETURNS boolean
LANGUAGE plpgsql
AS $_$
declare
  oid int;
  poid int;
  available int;
  product int[];
begin

  if $2 is not null and not exists(select id from locations where id = $2 and active = true) then
    raise 'location must be active';
  end if;

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
      select greatest(0, supply - reserved) from products
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
$_$;
