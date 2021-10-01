const { Pool } = require('pg');

const pool = new Pool({
  user: 'jandeandeocampo',
  host: 'localhost',
  database: 'reviewsdata',
  port: 5432,
});

const queryReviews = (id, callback) => {
  pool.query(`SELECT * FROM reviews WHERE id=${id}`, (err, res) => {
    callback(err, res);
  });
};

module.exports = { queryReviews };
