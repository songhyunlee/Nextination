var express = require('express');
var cookieParser = require('cookie-parser')();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var cities = require('../cities.js').data;
var users = require('../users.js').data;
var sessions = [];
var login = express.Router();

login.use(jsonParser);
login.use(cookieParser);

login.post('/', function(req, res){
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

login.post('/home', function(req, res){
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

module.exports = login;
