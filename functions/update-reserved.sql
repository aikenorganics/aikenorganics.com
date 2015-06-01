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
