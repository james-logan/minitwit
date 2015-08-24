var express = require('express')
var router = express();

var app = require('../../app')
var database = require('../../lib/mongo');

app.get('/admin', function(req, res){
  res.send(200);
});

app.get('admin/users', function(req, res){
  res.send(200);
});
