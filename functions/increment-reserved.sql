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
