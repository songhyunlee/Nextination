var express = require('express');
var bodyParser = require('body-parser');
var cities = require('./cities.js').data;
var jsonParser = bodyParser.json();

var app = express();

app.use(jsonParser);

app.use(function (req, res, next) {
  next();
})

app.use(express.static('./'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/default.js', function(req, res) {
  res.sendFile(__dirname + '/default.js');
})

app.get('/search/:term', function(req, res) {
  var cityInfo = [];

  cities.forEach(function(city){

    if(city.name.toLowerCase().indexOf(req.params.term) !== -1) {
      cityInfo.push(city);
    }
    if (city.country.toLowerCase().indexOf(req.params.term) !== -1) {
      cityInfo.push(city);
    }
  });
  res.send(cityInfo);
});

app.post('/search/:term', function(req, res) {
  request({
    url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e297c1e760675b2c72bb5c0ceffd355f&lat=48.864716&lon=2.349014&format=json&auth_token=72157667638567973-faf171092cc109ee&api_sig=041b0238843840c5ce973ac5ea3ba0e4'
  })
  res.send()
});

app.listen(8080);
