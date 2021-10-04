import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 500,
  duration: '10s',
};

const generateProductId = () => {
  let min = 1;
  let total_prods = 1000000;
  let product_id = Math.floor(Math.random() * (total_prods - min + 1) + min);
  return product_id;
};

export default function () {
  http.get(`http://localhost:3005/reviews/meta/?product_id=${generateProductId()}`);
  sleep(1);
};