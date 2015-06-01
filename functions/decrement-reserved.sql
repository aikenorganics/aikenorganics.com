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
