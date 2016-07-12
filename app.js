var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var cities = require('./cities.js').data;
var users = require('./users.js').data;
var login = require('./routes/login.js');
var register = require('./routes/register.js');
var search = require('./routes/search.js');

var app = express();

app.use(jsonParser);

app.use(function (req, res, next) {
  next();
})

app.use(express.static('./public'));

app.use('/register', register);

app.use('/login', login);

app.use('/search', search);

app.post('/photo/:term', function(req, res) {
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

app.post('/location/:term', function(req, res) {
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

app.post('/weather', function(req, res) {
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


app.listen(process.env.PORT || 8080);
