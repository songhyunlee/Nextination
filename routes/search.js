var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var cities = require('../cities.js').data;
var search = express.Router();

search.use(jsonParser);

search.get('/:term', function(req, res) {
  var cityInfo = [];
  cities.forEach(function(city){
    if(city.name.toLowerCase().indexOf(req.params.term.toLowerCase()) !== -1) {
      cityInfo.push(city);
    }
    if (city.country.toLowerCase().indexOf(req.params.term.toLowerCase()) !== -1) {
      cityInfo.push(city);
    }
  });
  res.send(cityInfo);
});

module.exports = search;
