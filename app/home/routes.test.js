'use strict';

var expect = require('chai').expect;
var request = require('supertest');

var app = require('../../app/');

describe('Home Routes', function () {
  describe('GET /admin', function(){
    it('Should respond with index', function(done){
      request(app)
        .get('/admin')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.text).to.contain("This is the admin dashboard page");
          done();
        });
    });
  });

  describe('GET /admin/users', function(){
    it('Should respond with an index of users', function(done){
      request(app)
        .get('/admin/users')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.text).to.contain("I'm a contact page");
          done();
        });
    });
  });
});
