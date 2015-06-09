create or replace function delete_product_orders()
returns trigger
as $$
begin
  delete from product_orders
  where order_id = OLD.id;
  return OLD;
end;
$$ language plpgsql;
