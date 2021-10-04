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
      ORDER BY review_id
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
        newRows.push(queryReviewsPhotos(row.review_id, (photos) => {
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
  const recQuery = `
    SELECT recommend
    FROM reviews
    WHERE product_id=${product_id}
    AND recommend=true
  `;

  const ratingsQuery = `
    SELECT rating FROM reviews
    WHERE product_id=${product_id}
  `;

  const charaQuery = `
    SELECT * FROM characteristics
    WHERE product_id=${product_id}
  `;

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
    .then((results) => {
      const characteristics = {};

      for(const row of results.rows) {
        characteristics[row.characteristics_name] = {
          id: row.id,
          value: 'placeholder',
        }
      }

      return characteristics;
    })
    .catch((err) => { throw err; });

  callback(null, metadata);
};

const postReview = async (request, callback) => {
  const _timestamp = Number(new Date());
  const {
    product_id, rating, summary, body,
    recommend, name, email,
  } = request;

  const post = {
    text: `
      INSERT INTO reviews (
        review_id, product_id, rating,
        date_posted, summary, body,
        recommend, reported,
        reviewer_name, reviewer_email
      )
      VALUES (
        nextval('serial_review_id'),
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )
    `,
    values: [
      product_id, rating, _timestamp,
      summary, body, recommend,
      false, name, email,
    ]
  };

  await pool.query(post)
    .catch((err) => {
      throw err;
    });

  const _review_id = await pool.query(`
    SELECT review_id
    FROM reviews
    ORDER BY review_id
    DESC FETCH NEXT 1 ROWS ONLY
  `)
    .then((results) => {
      return results.rows[0].review_id;
    })
    .catch((err) => {
      throw err;
    });

  for(const url of request.photos) {
    const photosPost = {
      text: `
        INSERT INTO reviewsphotos (id, review_id, photo_url)
        VALUES (nextval('serial_review_photos'), $1, $2)
      `,
      values: [_review_id, url]
    };

    await pool.query(photosPost)
      .catch((err) => { throw err; });
  }

  for(const key in request.characteristics) {
    const charasPost = {
        text: `
          INSERT INTO characteristicreviews (
            id, characteristic_id, review_id, characteristic_value)
          VALUES (nextval('serial_review_charas'), $1, $2, $3)
        `,
        values: [key, _review_id, request.characteristics[key]]
    }

    await pool.query(charasPost)
      .catch((err) => { throw err; });
  }

  callback(null, post);
};

const markReviewAsHelpful = (review_id, callback) => {
  const addToHelpfulnessQuery = {
    text: `
      UPDATE reviews
      SET helpfulness = helpfulness + 1
      WHERE review_id = $1
    `,
    values: [review_id]
  };

  pool.query(addToHelpfulnessQuery)
    .then((results) => {
      callback(null, results);
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = {
  queryReviews,
  buildMeta,
  postReview,
  markReviewAsHelpful
};
