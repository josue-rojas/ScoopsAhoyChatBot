const https = require('https');

function httpsGetRequest(options) {
  // options.path = encodeURIComponent(options.path);
  return new Promise((resolve, reject) => {
    https.get(options, (res) => {
      // error handling
      // some code from : https://nodejs.org/api/http.html#http_http_get_options_callback
      const { statusCode } = res;
      const contentType = res.headers['content-type'];
      let error;
      if (statusCode !== 200) {
        error = new Error(`Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n'
          + `Expected application/json but received ${contentType}`);
      }
      if (error) {
        res.resume();
        reject(error);
      }
      // handle data
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (e) {
          reject(new Error(e));
        }
      })
      // other errors
        .on('error', (e) => {
          reject(new Error(e));
        });
    });
  });
}

module.exports = httpsGetRequest;
