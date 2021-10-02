DROP DATABASE IF EXISTS reviewsData;
CREATE DATABASE reviewsData;

\c reviewsdata

-- BEFORE SEEING THE DATA

-- CREATE TABLE reviews (
--   id SERIAL PRIMARY KEY,
--   starRating Decimal(2,2),
--   summary varchar(255),
--   reviewBody varchar(1000),
--   reviewDate Date,
--   reviewer varchar(20),
--   helpfulness boolean
-- );

-- CREATE TABLE photo (
--   id SERIAL PRIMARY KEY,
--   review SERIAL references reviews(id),
--   url varchar(255)
-- );

-- AFTER SEEING THE DATA


CREATE TABLE IF NOT EXISTS products (
  id integer primary key
);

CREATE TABLE IF NOT EXISTS reviews (
  review_id integer primary key,
  product_id integer references products(id),
  rating integer,
  date_posted bigint,
  summary varchar(255),
  body varchar(1000),
  recommend boolean,
  reported boolean,
  reviewer_name varchar(50),
  reviewer_email varchar(50),
  response varchar(255) default,
  helpfulness integer
);

CREATE TABLE IF NOT EXISTS reviewsPhotos (
  id integer primary key,
  review_id integer references reviews(id),
  photo_url varchar(255)
);

CREATE TABLE IF NOT EXISTS characteristics (
  id integer primary key,
  product_id integer references products(id),
  characteristics_name varchar(25)
);
