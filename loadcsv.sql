-- do not run this without inserting your paths!

\c reviewsdata

COPY products(id) FROM '/Users/jandeandeocampo/Desktop/product_id.csv' DELIMITER ',' CSV HEADER;

COPY reviews(id, product_id, rating, date_posted, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
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