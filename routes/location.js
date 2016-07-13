var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var location = express.Router();

location.use(jsonParser);

location.post('/:term', function(req, res) {
  var apiKey = 'u6IfjmqSdlmpYxTG7hOWZ6A4phtXdHcC';
  var locationUrl = 'https://dataservice.accuweather.com/locations/v1/search';
  console.log(req.body)
  request({
    url: locationUrl,
    qs: {
      apikey: apiKey,
      q: req.body.name,
      format: 'json',
      cache: true,
    }
  }, function(error, response, body) {
    res.send(body);
  })
});

module.exports = location;
