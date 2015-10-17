alter table users add column search tsvector;

CREATE TRIGGER update_user_search
BEFORE INSERT OR UPDATE ON users FOR EACH ROW
EXECUTE PROCEDURE tsvector_update_trigger(search, 'pg_catalog.english', first, last, email);

update users set first = first;
