var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var cities = require('./cities.js').data;
var users = require('./users.js').data;
var login = require('./routes/login.js');
var register = require('./routes/register.js');
var search = require('./routes/search.js');
var photo = require('./routes/photo.js');
var location = require('./routes/location.js');
var weather = require('./routes/weather.js')

var app = express();

app.use(jsonParser);

app.use(function (req, res, next) {
  next();
})

app.use(express.static('./public'));

app.use('/register', register);

app.use('/login', login);

app.use('/search', search);

app.use('/photo', photo);

app.use ('/location', location);

app.use('/weather', weather);


app.listen(process.env.PORT || 8080);
