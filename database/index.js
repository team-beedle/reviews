const { Pool } = require('pg');
const bluebird = require('bluebird');

const pool = new Pool({
  user: 'jandeandeocampo',
  host: 'localhost',
  database: 'reviewsdata',
  port: 5432,
});

const queryReviewsPhotos = (review_id, callback) => {
  const photosQuery = `SELECT * FROM reviewsphotos WHERE review_id=${review_id}`;

  return pool.query(photosQuery)
    .then((results) => {
      return callback(results.rows);
    })
    .catch((err) => {
      throw err;
    });
};

const queryReviews = (id, callback, page=1, count=5, sort='newest') => {
  const body = {
    product: id,
    page: page - 1,
    count: count,
  };

  const pagesQuery = {
    text: `
      SELECT * FROM reviews
      WHERE product_id=${id}
      ORDER BY id
      OFFSET (($1 - 1) * $2) ROWS
      FETCH NEXT $2 ROWS ONLY
    `,
    values: [page, count],
  };

  pool.query(pagesQuery)
    .then((results) => {
      return results.rows.slice();
    })
    .then((rows) => {
      const newRows = [];

      for(let row of rows) {
        newRows.push(queryReviewsPhotos(row.id, (photos) => {
          row.photos = photos;
          return row;
        }));
      }

      Promise.all(newRows)
        .then((results) => {
          body.results = results;
          callback(null, body);
        })
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => {
      throw err;
    });
};

const buildMeta = async (product_id, callback) => {
  const recQuery = `SELECT recommend FROM reviews WHERE product_id=${product_id} AND recommend=true`;
  const ratingsQuery = `SELECT rating FROM reviews WHERE product_id=${product_id}`;
  const charaQuery = `SELECT * FROM characteristics WHERE product_id=${product_id}`;

  const metadata = { product_id };

  metadata.recommended = await pool.query(recQuery)
    .then((results) => { return { 0: results.rows.length }; })
    .catch((err) => { throw err; });

  metadata.ratings = await pool.query(ratingsQuery)
    .then((results) => {
      const ratings = {};

      for(const row of results.rows) {
        if(!ratings[row.rating]) { ratings[row.rating] = 1; }
        else { ratings[row.rating] += 1; }
      }

      return ratings;
    })
    .catch((err) => {throw err; });

  metadata.characteristics = await pool.query(charaQuery)
    .then((results) => { return results.rows; })
    .catch((err) => { throw err; });

  callback(null, metadata);
};

module.exports = { queryReviews, buildMeta };
