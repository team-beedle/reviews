const express = require('express');
const db = require('../database/index.js');

const app = express();

app.get('/meta', (req, res) => {
  db.queryReviews(req.query.product_id, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send(result.rows);
    }
  });
});


app.get('/', (req, res) => {
  console.log(req.query);
  db.queryReviews(req.query.product_id, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send(result.rows);
    }
  });
});

module.exports = app;