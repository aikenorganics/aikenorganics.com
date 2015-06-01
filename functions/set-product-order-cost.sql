create or replace function set_product_order_cost() returns trigger as $$
begin
  NEW.cost := (select cost from products where id = NEW.product_id);
  return NEW;
end;
$$ language plpgsql;
