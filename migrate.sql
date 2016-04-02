alter table users add column
street varchar(255) check(street ~ '\S+');

alter table users add column
city varchar(255) check(city ~ '\S+');

alter table users add column
state varchar(2) check(state ~* '^[a-z]{2}$');

alter table users add column
zip varchar(255) check(zip ~ '^\d{5}(\-\d{4})?$');
