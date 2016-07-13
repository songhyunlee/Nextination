var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var photo = express.Router();

photo.use(jsonParser);

photo.post('/:term', function(req, res) {
  request({
    url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search',
    qs: {
      api_key: '0a713463c24036458c7a2c7c3b731c51',
      text: req.body.tag,
      tag: req.body.name,
      has_geo: 1,
      sort: "relevance",
      lat: req.body.lat,
      lon: req.body.lon,
      content_type: 1,
      per_page: 5,
      format: 'json',
      nojsoncallback: "?"
    }
  }, function(error, response, body) {
    res.send(body);
  })
});

module.exports = photo;
