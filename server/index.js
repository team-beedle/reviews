const app = require('./routes.js');
const port = 3005;

app.listen(port, () => {
  console.log(`Now listening at ${port}...`);
});
