-- do not run this without inserting your paths!

\c reviewsData

COPY reviews(id, product_id, rating, date_posted, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM 'path'
DELIMITER ','
CSV HEADER;

COPY characteristics(id, product_id, characteristics_name)
FROM '/Users/jandeandeocampo/Desktop/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY reviewsphotos(id, review_id, photo_url)
FROM '/Users/jandeandeocampo/Desktop/reviewsphotos.csv'
DELIMITER ','
CSV HEADER;
