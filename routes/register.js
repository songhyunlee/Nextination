var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var users = require('../users.js').data;
var register = express.Router();

register.use(jsonParser);

register.post('/', function(req, res){
  var newUser = {};
  newUser.name = req.body.name;
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  users.push(newUser);
  res.send(newUser);
})

module.exports = register;
