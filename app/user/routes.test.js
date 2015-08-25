'use strict';

var expect = require('chai').expect;
var request = require('supertest');

var app = require('../../app/');

describe('User Routes', function () {
  describe('GET /logout', function () {
    it('should redirect to /', function (done) {
      request(app)
        .get('/logout')
        .expect(302)
        .expect('Moved Temporarily. Redirecting to /', done);
    });
  });

  describe('GET /profile', function () {
    it('should redirect to /', function (done) {
      request(app)
        .get('/profile')
        .expect(302)
        .expect('Moved Temporarily. Redirecting to /', done);
    });
  });

  describe('GET /auth/twitter', function () {
    it('should redirect to twitter auth', function (done) {
      request(app)
        .get('/auth/twitter')
        .expect(302)
        .end(function (err, res) {
          var regex = /^https:\/\/api\.twitter\.com\/oauth\/authenticate\?oauth_token=/;

          if (err) throw err;

          expect(res.headers.location).to.match(regex);
          done();
        });
    });
  });

  describe('GET /auth/twitter/cb', function () {
    it('should redirect to twitter auth without a token', function (done) {
      request(app)
        .get('/auth/twitter/cb')
        .expect(302)
        .end(function (err, res) {
          var regex = /^https:\/\/api\.twitter\.com\/oauth\/authenticate\?oauth_token=/;

          if (err) throw err;

          expect(res.headers.location).to.match(regex);
          done();
        });
    });

    it('should fail properly with a bad token', function (done) {
      request(app)
        .get('/auth/twitter/cb?oauth_token=foo&oauth_verifier=bar')
        .expect(500)
        .end(function (err, res) {
          if (err) throw err;

          expect(res.text).to.contain('Error: Failed to find request token in session');
          done();
        });
    });
  });
});
