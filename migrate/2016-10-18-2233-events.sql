create table events (
  id serial primary key,
  user_id integer references users (id),
  action varchar(50) not null,
  target varchar(50) not null,
  meta jsonb not null,
  created_at timestamp not null default now()
);
