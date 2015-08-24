var express = require('express')
var router = express();

var app = require('../../app')
var database = require('../../lib/mongo');

app.get('/user', function(req, res){
  res.send(200);
});