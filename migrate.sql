alter table tokens
drop constraint tokens_user_id_fkey,
add constraint tokens_user_id_fkey
foreign key (user_id)
references users(id)
on delete cascade;

alter table user_growers
drop constraint user_growers_user_id_fkey,
add constraint user_growers_user_id_fkey
foreign key (user_id)
references users(id)
on delete cascade;
