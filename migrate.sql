create index orders_user_id_index on orders using btree (user_id);
create index orders_status_location_id_index on orders using btree (status, location_id);
create index orders_location_id_status_index on orders using btree (location_id, status);
