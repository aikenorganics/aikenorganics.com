drop trigger update_product_search on products;

create trigger update_product_search
before insert or update on products for each row
execute procedure tsvector_update_trigger(search, 'pg_catalog.simple', name);

update products set name = name;
