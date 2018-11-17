'use strict';
var request = require('request');

function getJsonFromUrl(url, callback){
  request.get({
      url: url,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        console.log('Error:', err);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
      } else {
        callback(data);
      }
  });
}
module.exports = getJsonFromUrl;
