const axios = require('axios');

module.exports = app => {
  app.get('/api/verify/:email', (req, res) => {
    axios(
      `https://api.kickbox.com/v2/verify?email=${req.params.email}&apikey=${
        process.env.KB_API_KEY
      }`
    )
      .then(result => {
        res.status(200).send(result.data);
      })
      .catch(err => {
        res.status(422).send(err);
      });
  });
};
