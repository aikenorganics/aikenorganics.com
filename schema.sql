--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE aikenorganics;
--
-- Name: aikenorganics; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE aikenorganics WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


\connect aikenorganics

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE order_status AS ENUM (
    'open',
    'complete',
    'canceled'
);


--
-- Name: check_product_order(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION check_product_order() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  is_open boolean;
  unavailable boolean;
  old_quantity integer;
begin

  if tg_op = 'INSERT' and not is_product_active(NEW.product_id) then
    raise 'product and grower must be active';
  end if;

  is_open := (
    select status = 'open' from orders where id = NEW.order_id
  );

  old_quantity := (
    select case tg_op when 'UPDATE' then OLD.quantity else 0 end
  );

  unavailable := (
    select supply - reserved < NEW.quantity - old_quantity
    from products where id = NEW.product_id
  );

  if is_open and unavailable then
    raise 'not enough supply';
  end if;

  return NEW;
end;
$$;


--
-- Name: checkout(integer, integer, integer[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION checkout(integer, integer, integer[]) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
declare
  oid int;
  poid int;
  available int;
  product int[];
begin

  if $2 is not null and not exists(select id from locations where id = $2 and active = true) then
    raise 'location must be active';
  end if;

  update orders set location_id = $2
  where user_id = $1 and status = 'open'
  returning id into oid;

  if oid is null then
    insert into orders (user_id, location_id)
    values ($1, $2) returning id into oid;
  end if;

  foreach product slice 1 in array $3 loop

    poid := null;
    available := (
      select greatest(0, supply - reserved) from products
      where id = product[1]
    );

    if available = 0 or not is_product_active(product[1]) then
      continue;
    end if;

    update product_orders set
    quantity = quantity + least(available, product[2])
    where order_id = oid and product_id = product[1]
    returning id into poid;

    if poid is null then
      insert into product_orders (order_id, product_id, quantity)
      values (oid, product[1], least(available, product[2]));
    end if;

  end loop;

  return true;

end;
$_$;


--
-- Name: decrement_reserved(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION decrement_reserved() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    begin
      update products set
        reserved = reserved - OLD.quantity
      from orders
      where
        orders.id = OLD.order_id and
        orders.status = 'open' and
        products.id = OLD.product_id;
      return null;
    end;
    $$;


--
-- Name: delete_product_orders(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION delete_product_orders() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    begin
      delete from product_orders
      where order_id = OLD.id;
      return OLD;
    end;
    $$;


--
-- Name: increment_reserved(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION increment_reserved() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    begin
      update products set
        reserved = reserved + NEW.quantity
      from orders
      where
        orders.id = NEW.order_id and
        orders.status = 'open' and
        products.id = NEW.product_id;
      return null;
    end;
    $$;


--
-- Name: is_product_active(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION is_product_active(integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
begin
  return coalesce((
    select products.active and growers.active
    from products
    inner join growers on products.grower_id = growers.id
    where products.id = $1
  ), false);
end;
$_$;


--
-- Name: reset_reserved(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION reset_reserved() RETURNS void
    LANGUAGE plpgsql
    AS $$
    begin
      update products set reserved = coalesce((
        select sum(quantity) from product_orders
        inner join orders on
          orders.status = 'open' and
          orders.id = order_id
        where
          product_id = products.id
      ), 0);
    end;
    $$;


--
-- Name: set_product_order_cost(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION set_product_order_cost() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    begin
      NEW.cost := (select cost from products where id = NEW.product_id);
      return NEW;
    end;
    $$;


--
-- Name: tidy_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION tidy_user() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  NEW.email := trim(lower(NEW.email));
  return NEW;
end;
$$;


--
-- Name: update_reserved(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION update_reserved() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    begin
      update products set
        reserved = reserved + NEW.quantity
      from orders
      where
        orders.id = NEW.order_id and
        orders.status = 'open' and
        products.id = NEW.product_id;

      update products set
        reserved = reserved - OLD.quantity
      from orders
      where
        orders.id = OLD.order_id and
        orders.status = 'open' and
        products.id = OLD.product_id;

      return null;
    end;
    $$;


--
-- Name: update_status(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION update_status() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    begin
      update products set reserved = coalesce((
        select sum(product_orders.quantity)
        from product_orders
        inner join orders on product_orders.order_id = orders.id
        where product_orders.product_id = products.id
        and orders.status = 'open'
      ), 0)
      where id in (
        select product_id
        from product_orders
        where order_id = NEW.id
      );
      return null;
    end;
    $$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE categories (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(255) DEFAULT ''::character varying NOT NULL,
    "position" double precision DEFAULT 0 NOT NULL,
    meat boolean DEFAULT false
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE categories_id_seq OWNED BY categories.id;


--
-- Name: growers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE growers (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(255) DEFAULT ''::character varying NOT NULL,
    email character varying(255) DEFAULT ''::character varying NOT NULL,
    url character varying(255) DEFAULT ''::character varying NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    location character varying(255) DEFAULT ''::character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    image_updated_at timestamp with time zone
);


--
-- Name: locations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE locations (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(255) DEFAULT ''::character varying NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE locations_id_seq OWNED BY locations.id;


--
-- Name: markets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE markets (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    open boolean DEFAULT false NOT NULL,
    domain character varying(255) DEFAULT ''::character varying NOT NULL,
    message text DEFAULT ''::text NOT NULL,
    news text DEFAULT ''::text NOT NULL
);


--
-- Name: markets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE markets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: markets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE markets_id_seq OWNED BY markets.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE orders (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL,
    status order_status DEFAULT 'open'::order_status NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    location_id integer
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE orders_id_seq OWNED BY orders.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE payments (
    id integer NOT NULL,
    stripe_id character varying(255) NOT NULL,
    order_id integer NOT NULL,
    amount integer NOT NULL
);


--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE payments_id_seq OWNED BY payments.id;


--
-- Name: product_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE product_orders (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    cost numeric(10,2) DEFAULT 0 NOT NULL
);


--
-- Name: product_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE product_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE product_orders_id_seq OWNED BY product_orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE products (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(255) DEFAULT ''::character varying NOT NULL,
    grower_id integer NOT NULL,
    cost numeric(10,2) DEFAULT 0 NOT NULL,
    supply integer DEFAULT 0 NOT NULL,
    unit character varying(255) DEFAULT ''::character varying NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    category_id integer NOT NULL,
    reserved integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    search tsvector,
    image_updated_at timestamp with time zone,
    featured boolean DEFAULT false NOT NULL
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE products_id_seq OWNED BY products.id;


--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE suppliers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE suppliers_id_seq OWNED BY growers.id;


--
-- Name: tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE tokens (
    id character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: user_growers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE user_growers (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL,
    grower_id integer NOT NULL
);


--
-- Name: user_growers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE user_growers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_growers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE user_growers_id_seq OWNED BY user_growers.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE users (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    is_admin boolean DEFAULT false NOT NULL,
    first character varying(255) DEFAULT ''::character varying NOT NULL,
    last character varying(255) DEFAULT ''::character varying NOT NULL,
    phone character varying(255) DEFAULT ''::character varying NOT NULL,
    member_until date,
    search tsvector,
    image_updated_at timestamp with time zone,
    stripe_id character varying(255),
    card_brand character varying(255),
    card_last4 character varying(255),
    street character varying(255),
    city character varying(255),
    state character varying(2),
    zip character varying(255),
    CONSTRAINT users_city_check CHECK (((city)::text ~ '\S+'::text)),
    CONSTRAINT users_state_check CHECK (((state)::text ~* '^[a-z]{2}$'::text)),
    CONSTRAINT users_street_check CHECK (((street)::text ~ '\S+'::text)),
    CONSTRAINT users_zip_check CHECK (((zip)::text ~ '^\d{5}(\-\d{4})?$'::text))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY categories ALTER COLUMN id SET DEFAULT nextval('categories_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY growers ALTER COLUMN id SET DEFAULT nextval('suppliers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY locations ALTER COLUMN id SET DEFAULT nextval('locations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY markets ALTER COLUMN id SET DEFAULT nextval('markets_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY orders ALTER COLUMN id SET DEFAULT nextval('orders_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY payments ALTER COLUMN id SET DEFAULT nextval('payments_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_orders ALTER COLUMN id SET DEFAULT nextval('product_orders_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY products ALTER COLUMN id SET DEFAULT nextval('products_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_growers ALTER COLUMN id SET DEFAULT nextval('user_growers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY categories (id, created_at, updated_at, name, "position", meat) FROM stdin;
1	2015-10-13 21:21:45.684372-04	2015-10-13 21:21:45.684372-04	Fruits & Veggies	1	f
2	2015-10-13 21:21:45.684372-04	2015-10-13 21:21:45.684372-04	Prepared Food	2	f
3	2015-10-13 21:21:45.684372-04	2015-10-13 21:21:45.684372-04	Herbs	3	f
4	2015-10-13 21:21:45.684372-04	2015-10-13 21:21:45.684372-04	Beauty	4	f
5	2015-10-13 21:21:45.684372-04	2015-10-13 21:21:45.684372-04	Dairy & Eggs	5	f
6	2015-10-13 21:21:45.684372-04	2015-10-13 21:21:45.684372-04	Meat	6	f
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('categories_id_seq', 6, true);


--
-- Data for Name: growers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY growers (id, created_at, updated_at, name, email, url, description, location, active, image_updated_at) FROM stdin;
1	2015-10-13 21:21:45.683542-04	2015-10-13 21:21:45.683542-04	Watsonia Farms	wfsales@watsoniafarms.com	http://watsoniafarms.com/	For four generations, from 1918 to the present, the Watson family has been bringing the best in fruit and produce to the people of South Carolina. And now, you can enjoy the same farm-fresh goodness in your own home.		t	\N
2	2015-10-13 21:21:45.683542-04	2015-10-13 21:21:45.683542-04	Plan It Foods	info@planitfoods.com	http://planitfoods.com/	Plan It Foods offers homemade “heat and serve” meals that focus on local, all natural ingredients. Our frozen meals come in single serving or family sizes and are fully cooked and ready to heat in your oven. We use only chemical-free, hormone-free, antibiotic-free meats, milk and eggs from local farmers using sustainable & humane practices in the raising and butchering of their animals.  We also offer gluten free, vegetarian and vegan menu options and use as much local produce as possible from local farmers who are following organic growing practices. We are fully licensed and insured and all of our prepared foods are made in a DHEC approved kitchen. We strive to use the freshest, healthiest, best tasting local products available so that you do not have to sacrifice taste or nutrition for convenience!		t	\N
3	2015-10-13 21:21:45.683542-04	2015-10-13 21:21:45.683542-04	Happy Earth Farm [Inactive]	steve@happyearthfarm.com	http://happyearthfarm.com	Happy Earth Farm is your local Aiken family farm, where we’re dedicated to providing you with the freshest products in the purest fashion. We don’t use pesticides, herbicides or any other “cides”! We grow our crops using our own organic compost and other organic supplements and soil enhancers; we practice extensive crop rotation and companion planting; our flock of guineas provides natural pest control; and we never, ever use genetically modified seeds! We raise our chickens the old fashioned way: providing unadulterated, soy-free organic feed and offering up plenty of fresh air and sunshine. We’re passionate about “clean” healthy eating, and we offer to you what we feed our family: fresh and natural alternatives to store-bought fare.		f	\N
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY locations (id, created_at, updated_at, name, active) FROM stdin;
1	2015-10-13 21:21:45.685592-04	2015-10-13 21:21:45.685592-04	Aiken Organics	t
2	2015-10-13 21:21:45.685592-04	2015-10-13 21:21:45.685592-04	Three Runs Plantation	t
3	2016-01-03 07:40:56.827752-05	2016-01-03 07:40:56.827752-05	Four Runs Plantation [Inactive]	f
\.


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('locations_id_seq', 3, true);


--
-- Data for Name: markets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY markets (id, created_at, updated_at, open, domain, message, news) FROM stdin;
1	2015-10-13 21:21:45.67863-04	2016-10-02 07:40:38.128-04	t	localhost	**Hi!** Aiken Organics is still under development, so please bear with us while we work out the kinks! If something goes wrong, or you have a question, or you just want to shoot the breeze, send an email to [support@aikenorganics.com](mailto:support@aikenorganics.com).	## Some News\n\nLorem ipsum dolor sit amet!
\.


--
-- Name: markets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('markets_id_seq', 2, true);


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY orders (id, created_at, updated_at, user_id, status, notes, location_id) FROM stdin;
2	2015-10-13 21:21:45.689416-04	2015-10-13 21:21:45.689416-04	2	open		1
3	2015-10-13 21:21:45.689416-04	2015-10-13 21:21:45.689416-04	2	complete		1
4	2015-10-13 21:21:45.689416-04	2015-10-13 21:21:45.689416-04	3	open		1
5	2016-03-28 22:20:49.291557-04	2016-03-28 22:20:49.291557-04	6	open		1
1	2015-10-13 21:21:45.689416-04	2016-09-19 11:43:44.536-04	1	open		\N
\.


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('orders_id_seq', 5, true);


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY payments (id, stripe_id, order_id, amount) FROM stdin;
\.


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('payments_id_seq', 1, true);


--
-- Data for Name: product_orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY product_orders (id, created_at, updated_at, order_id, product_id, quantity, cost) FROM stdin;
1	2015-10-13 21:21:45.691084-04	2015-10-13 21:21:45.691084-04	1	1	2	14.00
2	2015-10-13 21:21:45.691084-04	2015-10-13 21:21:45.691084-04	1	2	3	8.00
3	2015-10-13 21:21:45.691084-04	2015-10-13 21:21:45.691084-04	2	3	1	4.50
4	2015-10-13 21:21:45.691084-04	2015-10-13 21:21:45.691084-04	2	4	1	7.00
5	2015-10-13 21:21:45.691084-04	2015-10-13 21:21:45.691084-04	2	5	1	14.00
6	2015-10-13 21:21:45.691084-04	2015-10-13 21:21:45.691084-04	3	5	1	14.00
7	2015-10-13 21:21:45.691084-04	2015-10-13 21:21:45.691084-04	3	4	2	7.00
8	2015-10-13 21:21:45.691084-04	2015-10-13 21:21:45.691084-04	4	5	2	14.00
9	2015-11-26 08:00:53.203478-05	2015-11-26 08:00:53.203478-05	1	8	1	5.00
10	2016-03-28 22:20:49.291557-04	2016-03-28 22:20:49.291557-04	5	9	3	4.30
\.


--
-- Name: product_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('product_orders_id_seq', 10, true);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY products (id, created_at, updated_at, name, grower_id, cost, supply, unit, description, category_id, reserved, active, search, image_updated_at, featured) FROM stdin;
6	2015-10-13 21:21:45.686334-04	2015-10-13 21:21:45.686334-04	Happy Pesto Sauce [Inactive Grower]	3	5.50	23	4 oz.	It starts with our own organically grown basil and ends with a finished product full of rich flavor.  Our Happy Pesto is the perfect pasta sauce, but is also delicious on fish, chicken, eggs or any other recipe calling for pesto.  Our pesto is made super concentrated so cutting it with additional olive oil will make this sauce go twice as far.	2	0	t	'grower':5 'happy':1 'inactive':4 'pesto':2 'sauce':3	\N	f
7	2015-10-13 21:21:45.686334-04	2015-10-13 21:21:45.686334-04	Spanish Rice [Inactive]	2	4.32	3	medium side item - (2 cups)	Made with all natural brown rice and organic tomatoes, corn and sweet peas, this rice packs a lot of flavor and is the perfect side for our enchiladas or great on its own! (vegetarian and gluten free)	2	0	f	'inactive':3 'rice':2 'spanish':1	\N	f
8	2015-10-13 21:21:45.686334-04	2015-10-13 21:21:45.686334-04	Mild Chow Chow [Inactive]	1	5.00	7	Pint Jar	Cabbage, onions, sugar, red bell pepper, vinegar, ground mustard, celery seed, salt, citric acid, turmeric, erythorbric acid to promote color retention.	2	0	f	'chow':2,3 'inactive':4 'mild':1	\N	f
1	2015-10-13 21:21:45.686334-04	2015-10-13 21:21:45.686334-04	Peaches	1	14.00	22	box	A box of peaches.	1	2	t	'peaches':1	\N	f
4	2015-10-13 21:21:45.686334-04	2015-10-13 21:21:45.686334-04	Vegan Gumbo - Small	2	7.00	15	small container (serves 1-2)	This hearty gumbo features local okra, tomatoes, peppers and corn (cut and frozen in season), fresh herbs and bay leaves simmered in organic vegetable stock and dark porter beer from the Aiken Brewing Company and comes with a side of all natural brown rice.	2	1	t	'gumbo':2 'small':3 'vegan':1	\N	f
5	2015-10-13 21:21:45.686334-04	2015-10-13 21:21:45.686334-04	Vegan Gumbo - Medium	2	14.00	3	Medium container (serves 2-4)	This hearty gumbo features local okra, tomatoes, peppers and corn (cut and frozen in season), fresh herbs and bay leaves simmered in organic vegetable stock and dark porter beer from the Aiken Brewing Company and comes with a side of all natural brown rice.	2	3	t	'gumbo':2 'medium':3 'vegan':1	\N	f
9	2016-03-28 22:18:30.836487-04	2016-10-02 07:28:45.275-04	Avocados [Oversold]	1	4.30	2	each		1	3	t	'avocados':1 'oversold':2	\N	t
2	2015-10-13 21:21:45.686334-04	2016-10-02 07:28:50.283-04	Strawberries	1	8.00	15	box	Some strawberries.	1	3	t	'strawberries':1	\N	t
3	2015-10-13 21:21:45.686334-04	2016-10-02 07:28:54.944-04	Kale	1	4.50	15	bunch	A buncha kale.	1	1	t	'kale':1	\N	t
\.


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('products_id_seq', 9, true);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('suppliers_id_seq', 3, true);


--
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY tokens (id, expires_at, user_id) FROM stdin;
\.


--
-- Data for Name: user_growers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY user_growers (id, created_at, updated_at, user_id, grower_id) FROM stdin;
1	2015-10-13 21:21:45.690337-04	2015-10-13 21:21:45.690337-04	5	1
2	2015-10-13 21:21:45.690337-04	2015-10-13 21:21:45.690337-04	6	2
\.


--
-- Name: user_growers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('user_growers_id_seq', 2, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY users (id, created_at, updated_at, email, password, is_admin, first, last, phone, member_until, search, image_updated_at, stripe_id, card_brand, card_last4, street, city, state, zip) FROM stdin;
2	2015-10-13 21:21:45.681861-04	2015-10-13 21:21:45.681861-04	user@example.com	$2a$04$Xji0a5KEjoHOXGI4IfrxWevHLnYM81iLZmSBpuvQgeK8KgMrHHBlm	f	Regular	User	803.532.5859	\N	'regular':1 'user':2 'user@example.com':3	\N	\N	\N	\N	\N	\N	\N	\N
3	2015-10-13 21:21:45.681861-04	2015-10-13 21:21:45.681861-04	jake@example.com	$2a$04$dhus2Ml6LznTeN/A.hCM/Oay6xJvt1gwSMF1wIuRrKWthFOvEr15a	f	Jake	The Dog	803.532.5859	\N	'dog':3 'jake':1 'jake@example.com':4 'the':2	\N	\N	\N	\N	\N	\N	\N	\N
5	2015-10-13 21:21:45.681861-04	2015-10-13 21:21:45.681861-04	grower@example.com	$2a$04$Su42VK4JwDRq8fyLDtxpo.xRtvGAfOAKvOJmWz.Iw5Ulfn49LYQ1G	f	Grower	Montgomery	803.532.5859	\N	'grower':1 'grower@example.com':3 'montgomery':2	\N	\N	\N	\N	\N	\N	\N	\N
6	2015-10-13 21:21:45.681861-04	2015-10-13 21:21:45.681861-04	info@planitfoods.com	$2a$04$u6vrFtGNstxbCn.o3pC1oOnB0CtStY0MazKmd4sDOo.tiJjOi1CzK	f	PlanIt	Foods	803.532.5859	\N	'foods':2 'info@planitfoods.com':3 'planit':1	\N	\N	\N	\N	\N	\N	\N	\N
7	2015-10-20 15:49:18.595797-04	2015-10-20 15:49:18.595797-04	jwitherow@example.com	$2a$04$tGkU7nuX578X/1MYdSn6R.1iMTllPIAi3Zd21aZOy0bTxHNbQVXqW	f	Joanne	Witherow	803.555.5555	\N	'joanne':1 'jwitherow@example.com':3 'witherow':2	\N	\N	\N	\N	\N	\N	\N	\N
4	2015-10-13 21:21:45.681861-04	2015-11-15 08:22:41.492-05	finn@example.com	$2a$04$upNAjx.c/6cAwwSwc41JduJJuqthrbwZoSpQAjIU05F7tLLC5gnpu	f	Finn	The Human	803.532.5859	\N	'finn':1 'finn@example.com':4 'human':3 'the':2	\N	\N	\N	\N	\N	\N	\N	\N
1	2015-10-13 21:21:45.681861-04	2015-10-13 21:21:45.681861-04	admin@example.com	$2a$04$xSJ1pVH1G3I0QRIHmAqml.4.Sk2UGzBo6zFoRCn2JvF5X/4dyEedy	t	Admin	User	803.555.5555	\N	'admin':1 'admin@example.com':3 'user':2	\N	cus_9DvnTA3OTM99Xz	Visa	4242	123 Street Drive	Townville	SC	55555
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('users_id_seq', 7, true);


--
-- Name: categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: markets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY markets
    ADD CONSTRAINT markets_pkey PRIMARY KEY (id);


--
-- Name: orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_orders
    ADD CONSTRAINT product_orders_pkey PRIMARY KEY (id);


--
-- Name: products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY growers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (id);


--
-- Name: user_growers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_growers
    ADD CONSTRAINT user_growers_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: categories_name_uniq_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categories_name_uniq_index ON categories USING btree (name);


--
-- Name: growers_active_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX growers_active_index ON growers USING btree (active);


--
-- Name: markets_domain_unique_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX markets_domain_unique_index ON markets USING btree (domain);


--
-- Name: orders_location_id_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_location_id_status_index ON orders USING btree (location_id, status);


--
-- Name: orders_status_location_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_status_location_id_index ON orders USING btree (status, location_id);


--
-- Name: orders_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_user_id_index ON orders USING btree (user_id);


--
-- Name: product_orders_unique_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX product_orders_unique_index ON product_orders USING btree (order_id, product_id);


--
-- Name: product_search_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX product_search_index ON products USING gin (search);


--
-- Name: products_active_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_active_index ON products USING btree (active);


--
-- Name: products_category_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_category_id_index ON products USING btree (category_id);


--
-- Name: products_grower_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_grower_id_index ON products USING btree (grower_id);


--
-- Name: user_growers_unique_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_growers_unique_index ON user_growers USING btree (user_id, grower_id);


--
-- Name: users_lower_case_email_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_lower_case_email_index ON users USING btree (lower((email)::text));


--
-- Name: check_product_order; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER check_product_order BEFORE INSERT OR UPDATE ON product_orders FOR EACH ROW EXECUTE PROCEDURE check_product_order();


--
-- Name: decrement_reserved; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER decrement_reserved AFTER DELETE ON product_orders FOR EACH ROW EXECUTE PROCEDURE decrement_reserved();


--
-- Name: delete_product_orders; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER delete_product_orders BEFORE DELETE ON orders FOR EACH ROW EXECUTE PROCEDURE delete_product_orders();


--
-- Name: increment_reserved; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER increment_reserved AFTER INSERT ON product_orders FOR EACH ROW EXECUTE PROCEDURE increment_reserved();


--
-- Name: set_product_order_cost; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_product_order_cost BEFORE INSERT ON product_orders FOR EACH ROW EXECUTE PROCEDURE set_product_order_cost();


--
-- Name: tidy_user; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tidy_user BEFORE INSERT OR UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE tidy_user();


--
-- Name: update_order_status; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_order_status AFTER UPDATE OF status ON orders FOR EACH ROW EXECUTE PROCEDURE update_status();


--
-- Name: update_product_search; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_product_search BEFORE INSERT OR UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger('search', 'pg_catalog.simple', 'name');


--
-- Name: update_reserved; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_reserved AFTER UPDATE ON product_orders FOR EACH ROW EXECUTE PROCEDURE update_reserved();


--
-- Name: update_user_search; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_search BEFORE INSERT OR UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger('search', 'pg_catalog.simple', 'first', 'last', 'email');


--
-- Name: orders_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_location_id_fkey FOREIGN KEY (location_id) REFERENCES locations(id);


--
-- Name: orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id);


--
-- Name: product_orders_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_orders
    ADD CONSTRAINT product_orders_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;


--
-- Name: product_orders_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_orders
    ADD CONSTRAINT product_orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);


--
-- Name: products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id);


--
-- Name: products_grower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY products
    ADD CONSTRAINT products_grower_id_fkey FOREIGN KEY (grower_id) REFERENCES growers(id);


--
-- Name: tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY tokens
    ADD CONSTRAINT tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: user_growers_grower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_growers
    ADD CONSTRAINT user_growers_grower_id_fkey FOREIGN KEY (grower_id) REFERENCES growers(id) ON DELETE CASCADE;


--
-- Name: user_growers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_growers
    ADD CONSTRAINT user_growers_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

