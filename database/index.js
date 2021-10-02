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
    .then(async (rows) => {
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

    });
};

module.exports = { queryReviews };
