alter table growers add column image_ext varchar(255);
alter table products add column image_ext varchar(255);
alter table users add column image_ext varchar(255);

update growers set image_ext = 'jpg' where imaged_at is not null;
update products set image_ext = 'jpg' where imaged_at is not null;
update users set image_ext = 'jpg' where imaged_at is not null;
