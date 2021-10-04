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

-- COPY CSV FROM A LOCAL PATH

COPY products(id)
FROM '/Users/jandeandeocampo/Desktop/product_id.csv'
DELIMITER ','
CSV HEADER;

COPY reviews(review_id, product_id, rating, date_posted, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/jandeandeocampo/Desktop/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics(id, product_id, characteristics_name)
FROM '/Users/jandeandeocampo/Desktop/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY reviewsphotos(id, review_id, photo_url)
FROM '/Users/jandeandeocampo/Desktop/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristicreviews(id, characteristic_id, review_id, characteristic_value)
FROM '/Users/jandeandeocampo/Desktop/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

CREATE INDEX reviews_from_reviews ON reviews(review_id);
CREATE INDEX products_from_reviews ON reviews(product_id);
CREATE INDEX reviews_from_photos ON reviewsphotos(review_id);
