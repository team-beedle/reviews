-- do not run this without inserting your paths!

\c reviewsdata

DROP SEQUENCE IF EXISTS serial_review_id;
DROP SEQUENCE IF EXISTS serial_review_photos;
DROP SEQUENCE IF EXISTS serial_review_charas;
CREATE SEQUENCE serial_review_id START 5774953;
CREATE SEQUENCE serial_review_photos START 2742541;
CREATE SEQUENCE serial_review_charas START 19327576;