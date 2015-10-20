drop trigger update_user_search on users;

create trigger update_user_search
before insert or update on users for each row
execute procedure tsvector_update_trigger(search, 'pg_catalog.simple', first, last, email);

update users set first = first;
