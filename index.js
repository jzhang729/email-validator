const PORT = process.env.PORT || 5000;
const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

path.join(__dirname, 'public');

app.use(bodyParser.json());

routes(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
