alter table growers add column image_updated_at timestamp with time zone;
alter table products add column image_updated_at timestamp with time zone;
alter table users add column image_updated_at timestamp with time zone;

update growers set image_updated_at = imaged_at;
update products set image_updated_at = imaged_at;
update users set image_updated_at = imaged_at;
