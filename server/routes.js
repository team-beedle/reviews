const express = require('express');
const db = require('../database/index.js');

const app = express();

app.use(express.json());

app.get('/reviews/', (req, res) => {
  db.queryReviews(req.query.product_id, (err, result) => {
    if (err) { throw err; }
    res.status(200).send(result);
  }, req.query.page, req.query.count, req.query.sort);
});


app.get('/reviews/meta', (req, res) => {
  db.buildMeta(req.query.product_id, (err, result) => {
    if (err) { throw err; }
    res.status(200).send(result);
  });
});

app.post('/reviews/', (req, res) => {
  db.postReview(req.body, (err, result) => {
    if (err) { throw err; }
    res.status(201).send(result);
  });
});

module.exports = app;