let express = require('express');
let router = express.Router();
let httpsGetRequest = require('../helpers/fetch');

const host = 'api.foursquare.com';
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;

router.get('/', (req, res) => {
  // should return error if no zipcode was found
  let zipcode = req.query.zipcode || 10001;
  let path = `/v2/venues/search?client_id=${client_id}&client_secret=${client_secret}&v=20190801&near=${zipcode}&query=ice+cream&limit=10&radius=8046`;
  options = {
      host: host,
      method: 'GET',
      path: path,
      port: 443,
      headers: {
        Accept: 'application/json',
        client_id: client_id,
        client_secret: client_secret
      }
    };
    httpsGetRequest(options)
    .then((data) => {
      res.send(data.response);
    })
    // should send something else
    .catch((e) => {
      console.log(e);
      res.send({});
    })
});

module.exports = router;
