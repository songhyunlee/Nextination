var express = require('express');
var request = require('request');
var cookieParser = require('cookie-parser')();
var bodyParser = require('body-parser');
var cities = require('./cities.js').data;
var users = require('./users.js').data;
var jsonParser = bodyParser.json();
var sessions = [];
var app = express();

app.use(jsonParser);
app.use(cookieParser);

app.use(function (req, res, next) {
  next();
})

app.use(express.static('./public'));

app.post('/register/:name', function(req, res){
  var newUser = {};
  newUser.name = req.body.name;
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  users.push(newUser);

  res.send(newUser);
})

app.post('/login', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var currentUser = {};
  users.forEach(function (user) {
    if (user.username == username && user.password == password) {
      currentUser.name = user.name;
      currentUser.username = user.username;
      currentUser.password = user.password;
      currentUser.nextcity = user.nextcity;

      var userId = Date.now();
      currentUser.id = userId;
      res.cookie('userId', userId);

      sessions.push(currentUser);
    }
  })
  res.send()
})

app.post('/login/home', function(req, res){
  var id = req.cookies.userId;
  var matched = {};
  sessions.forEach(function(session) {
    if(session.id == id) {
      matched.id = id;
      matched.name = session.name;
      matched.nextcity = session.nextcity;
    }
    res.send(matched);
  })
})

app.get('/search/:term', function(req, res) {
  var cityInfo = [];
  console.log(req.params.term);
  console.log(req.body);
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
