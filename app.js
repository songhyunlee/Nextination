var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cities = require('./cities.js').data;
var users = require('./users.js').data;
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

app.post('/register/:name', function(req, res){
  var newUser = {};
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.password = req.body.password;
  users.push(newUser);

  res.send(newUser);
  console.log(users);
})

app.post('/login', function(req, res){
  console.log(req.body);
  var email = req.body.useremail;
  var password = req.body.userpassword;
  function autenticate(users, email, password) {
    var match = users.filter((person) => person.name == user);
    if (match.length > 0) {
      if (match[0].password === password) {
        var userId = Date.now();
        var session = {};
        session.email = req.body.email;
        session.id = userId;
        res.cookie('userId','userId');
      } else {
        return false;
      }
    }
  }

  res.send()
})

app.get('/search/:term', function(req, res) {
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

app.post('/search/:term', function(req, res) {
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
  var locationUrl = 'http://dataservice.accuweather.com/locations/v1/search';
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
  var forecastUrl = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/' + locationKey + '?apikey=' + apiKey + '&details=true';

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


app.listen(8080);

// req.url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e297c1e760675b2c72bb5c0ceffd355f&lat=48.864716&lon=2.349014&format=json&auth_token=72157667638567973-faf171092cc109ee&api_sig=041b0238843840c5ce973ac5ea3ba0e4'
//https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e297c1e760675b2c72bb5c0ceffd355f&tags=paris&format=json&auth_token=72157667638567973-faf171092cc109ee&api_sig=4caa8738acc7d76c03e1a2d83952b5f0
