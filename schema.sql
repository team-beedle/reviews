DROP DATABASE IF EXISTS reviewsData;
CREATE DATABASE reviewsData;

\c reviewsdata

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
  response varchar(255),
  helpfulness integer
);

CREATE TABLE IF NOT EXISTS reviewsPhotos (
  id integer primary key,
  review_id integer references reviews(review_id),
  photo_url varchar(255)
);

CREATE TABLE IF NOT EXISTS characteristics (
  id integer primary key,
  product_id integer references products(id),
  characteristics_name varchar(25)
);

CREATE TABLE IF NOT EXISTS characteristicReviews (
  id integer primary key,
  characteristic_id integer references characteristics(id),
  review_id integer references reviews(review_id),
  characteristic_value integer
);
