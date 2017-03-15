alter table markets add column open_day smallint not null default 0 check (open_day between 0 and 6);
alter table markets add column close_day smallint not null default 0 check (close_day between 0 and 6);

alter table markets add column open_hours smallint not null default 0 check (open_hours between 0 and 23);
alter table markets add column close_hours smallint not null default 0 check (close_hours between 0 and 23);

alter table markets add column open_minutes smallint not null default 0 check (open_minutes between 0 and 59);
alter table markets add column close_minutes smallint not null default 0 check (close_minutes between 0 and 59);
