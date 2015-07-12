--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

ALTER TABLE ONLY public.user_growers DROP CONSTRAINT user_growers_user_id_fkey;
ALTER TABLE ONLY public.user_growers DROP CONSTRAINT user_growers_grower_id_fkey;
ALTER TABLE ONLY public.tokens DROP CONSTRAINT tokens_user_id_fkey;
ALTER TABLE ONLY public.products DROP CONSTRAINT products_grower_id_fkey;
ALTER TABLE ONLY public.products DROP CONSTRAINT products_category_id_fkey;
ALTER TABLE ONLY public.product_orders DROP CONSTRAINT product_orders_product_id_fkey;
ALTER TABLE ONLY public.product_orders DROP CONSTRAINT product_orders_order_id_fkey;
ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_author_id_fkey;
ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_user_id_fkey;
ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_location_id_fkey;
DROP TRIGGER update_reserved ON public.product_orders;
DROP TRIGGER update_product_search ON public.products;
DROP TRIGGER update_order_status ON public.orders;
DROP TRIGGER set_product_order_cost ON public.product_orders;
DROP TRIGGER increment_reserved ON public.product_orders;
DROP TRIGGER delete_product_orders ON public.orders;
DROP TRIGGER decrement_reserved ON public.product_orders;
DROP TRIGGER check_product_order ON public.product_orders;
DROP INDEX public.users_lower_case_email_index;
DROP INDEX public.user_growers_unique_index;
DROP INDEX public.products_grower_id_index;
DROP INDEX public.products_category_id_index;
DROP INDEX public.products_active_index;
DROP INDEX public.product_search_index;
DROP INDEX public.product_orders_unique_index;
DROP INDEX public.markets_domain_unique_index;
DROP INDEX public.growers_active_index;
DROP INDEX public.categories_name_uniq_index;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.user_growers DROP CONSTRAINT user_growers_pkey;
ALTER TABLE ONLY public.tokens DROP CONSTRAINT tokens_pkey;
ALTER TABLE ONLY public.growers DROP CONSTRAINT suppliers_pkey;
ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
ALTER TABLE ONLY public.product_orders DROP CONSTRAINT product_orders_pkey;
ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pkey;
ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
ALTER TABLE ONLY public.markets DROP CONSTRAINT markets_pkey;
ALTER TABLE ONLY public.locations DROP CONSTRAINT locations_pkey;
ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
ALTER TABLE ONLY public."SequelizeMeta" DROP CONSTRAINT "SequelizeMeta_pkey";
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.user_growers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.product_orders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.posts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.orders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.markets ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.locations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.growers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.categories ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.users_id_seq;
DROP TABLE public.users;
DROP SEQUENCE public.user_growers_id_seq;
DROP TABLE public.user_growers;
DROP TABLE public.tokens;
DROP SEQUENCE public.suppliers_id_seq;
DROP SEQUENCE public.products_id_seq;
DROP TABLE public.products;
DROP SEQUENCE public.product_orders_id_seq;
DROP TABLE public.product_orders;
DROP SEQUENCE public.posts_id_seq;
DROP TABLE public.posts;
DROP SEQUENCE public.orders_id_seq;
DROP TABLE public.orders;
DROP SEQUENCE public.markets_id_seq;
DROP TABLE public.markets;
DROP SEQUENCE public.locations_id_seq;
DROP TABLE public.locations;
DROP TABLE public.growers;
DROP SEQUENCE public.categories_id_seq;
DROP TABLE public.categories;
DROP TABLE public."SequelizeMeta";
DROP FUNCTION public.update_status();
DROP FUNCTION public.update_reserved();
DROP FUNCTION public.set_product_order_cost();
DROP FUNCTION public.reset_reserved();
DROP FUNCTION public.increment_reserved();
DROP FUNCTION public.delete_product_orders();
DROP FUNCTION public.decrement_reserved();
DROP FUNCTION public.check_product_order();
DROP TYPE public.order_status;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


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
    begin

      if not (select active from products where id = NEW.product_id) then
        raise 'product must be active';
      end if;

      if not (select active from growers where id = (
        select grower_id from products where id = NEW.product_id
      )) then
        raise 'grower must be active';
      end if;

      is_open := (
        select status = 'open' from orders where id = NEW.order_id
      );

      unavailable := (
        select supply - reserved < NEW.quantity
        from products where id = NEW.product_id
      );

      if is_open and unavailable then
        raise 'not enough supply';
      end if;

      return NEW;
    end;
    $$;


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
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE "SequelizeMeta" (
    name character varying(255) NOT NULL
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE categories (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    name character varying(255) DEFAULT ''::character varying NOT NULL,
    "position" double precision DEFAULT 0 NOT NULL
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
-- Name: growers; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE growers (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    name character varying(255) DEFAULT ''::character varying NOT NULL,
    email character varying(255) DEFAULT ''::character varying NOT NULL,
    url character varying(255) DEFAULT ''::character varying NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    location character varying(255) DEFAULT ''::character varying NOT NULL,
    imaged_at timestamp with time zone,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: locations; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE locations (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    name character varying(255) DEFAULT ''::character varying NOT NULL
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
-- Name: markets; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE markets (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    open boolean DEFAULT false NOT NULL,
    domain character varying(255) DEFAULT ''::character varying NOT NULL
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
-- Name: orders; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE orders (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    status order_status DEFAULT 'open'::order_status NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    location_id integer NOT NULL
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
-- Name: posts; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE posts (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    content text NOT NULL,
    author_id integer NOT NULL,
    title character varying(255) DEFAULT ''::character varying NOT NULL
);


--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE posts_id_seq OWNED BY posts.id;


--
-- Name: product_orders; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE product_orders (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
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
-- Name: products; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE products (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    name character varying(255) DEFAULT ''::character varying NOT NULL,
    grower_id integer NOT NULL,
    cost numeric(10,2) DEFAULT 0 NOT NULL,
    supply integer DEFAULT 0 NOT NULL,
    unit character varying(255) DEFAULT ''::character varying NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    category_id integer NOT NULL,
    imaged_at timestamp with time zone,
    reserved integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    search tsvector
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
-- Name: tokens; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE tokens (
    id character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: user_growers; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE user_growers (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
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
-- Name: users; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    first character varying(255) DEFAULT ''::character varying NOT NULL,
    last character varying(255) DEFAULT ''::character varying NOT NULL,
    phone character varying(255) DEFAULT ''::character varying NOT NULL,
    imaged_at timestamp with time zone
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

ALTER TABLE ONLY posts ALTER COLUMN id SET DEFAULT nextval('posts_id_seq'::regclass);


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
-- Name: SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY "SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: markets_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY markets
    ADD CONSTRAINT markets_pkey PRIMARY KEY (id);


--
-- Name: orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: product_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY product_orders
    ADD CONSTRAINT product_orders_pkey PRIMARY KEY (id);


--
-- Name: products_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY growers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (id);


--
-- Name: user_growers_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY user_growers
    ADD CONSTRAINT user_growers_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: categories_name_uniq_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX categories_name_uniq_index ON categories USING btree (name);


--
-- Name: growers_active_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX growers_active_index ON growers USING btree (active);


--
-- Name: markets_domain_unique_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX markets_domain_unique_index ON markets USING btree (domain);


--
-- Name: product_orders_unique_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX product_orders_unique_index ON product_orders USING btree (order_id, product_id);


--
-- Name: product_search_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX product_search_index ON products USING gin (search);


--
-- Name: products_active_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX products_active_index ON products USING btree (active);


--
-- Name: products_category_id_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX products_category_id_index ON products USING btree (category_id);


--
-- Name: products_grower_id_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX products_grower_id_index ON products USING btree (grower_id);


--
-- Name: user_growers_unique_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX user_growers_unique_index ON user_growers USING btree (user_id, grower_id);


--
-- Name: users_lower_case_email_index; Type: INDEX; Schema: public; Owner: -; Tablespace: 
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
-- Name: update_order_status; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_order_status AFTER UPDATE OF status ON orders FOR EACH ROW EXECUTE PROCEDURE update_status();


--
-- Name: update_product_search; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_product_search BEFORE INSERT OR UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger('search', 'pg_catalog.english', 'name');


--
-- Name: update_reserved; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_reserved AFTER UPDATE ON product_orders FOR EACH ROW EXECUTE PROCEDURE update_reserved();


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
-- Name: posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY posts
    ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES users(id);


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
    ADD CONSTRAINT tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: user_growers_grower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_growers
    ADD CONSTRAINT user_growers_grower_id_fkey FOREIGN KEY (grower_id) REFERENCES growers(id);


--
-- Name: user_growers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_growers
    ADD CONSTRAINT user_growers_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- PostgreSQL database dump complete
--

