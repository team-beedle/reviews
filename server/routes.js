const express = require('express');
const db = require('../database/index.js');

const app = express();

app.use(express.json());

app.get('/reviews/', (req, res) => {
  db.getReviewsForProduct(req.query.product_id, (err, result) => {
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

app.put('/reviews/:review_id/helpful', (req, res) => {
  db.markReviewAsHelpful(req.params.review_id, (err, result) => {
    if (err) { throw err; }
    res.status(204).send(result);
  })
});

app.put('/reviews/:review_id/report', (req, res) => {
  db.reportReview(req.params.review_id, (err, result) => {
    if (err) { throw err; }
    res.status(204).send(result);
  })
});

module.exports = app;