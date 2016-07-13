var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var weather = express.Router();

weather.use(jsonParser);

weather.post('/', function(req, res) {
  var apiKey = 'u6IfjmqSdlmpYxTG7hOWZ6A4phtXdHcC';
  var locationKey = req.body.key;
  var forecastUrl = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/' + locationKey + '?apikey=' + apiKey + '&details=true';

  request({
    url: forecastUrl,
    qs: {
      format: 'json',
      cache: true
    }
  }, function(error, response, body) {
    res.send(body);
  })
});

module.exports = weather;
