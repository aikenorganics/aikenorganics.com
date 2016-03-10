create table payments(
  id serial,
  stripe_id character varying(255) not null,
  order_id int not null references orders (id),
  amount int not null
);
