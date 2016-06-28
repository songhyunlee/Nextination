var express = require('express');
var bodyParser = require('body-parser');
var cities = require('./cities.js').data;
var moment = require('moment-timezone');
var jsonParser = bodyParser.json();

var app = express();

app.use(jsonParser);

app.use(function (req, res, next) {
  console.log(req.url);
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
  console.log(cityInfo);
});

app.listen(8080);
