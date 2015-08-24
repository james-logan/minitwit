"use strict";

var expect = require('chai').expect
  , request = require('supertest');

var app = require('../../app')
  , database = require('../../lib/mongo');

describe('Admin Dashboard', function() {
  describe('GET /admin', function() {

    // Create the dummy user data in the database for testing
    before(function(done) { 
      var users = [
        { name : 'Bob', admin_status: true},
        { name : 'Tim' , admin_status: false},
        { name : 'Kate', admin_status: true }
      ];
      database.connect(function(err,db) {
        db.collection('user').drop( // but clear collection first
          function() {
            db.collection('user').insert( users ,
              function(err) {
                if(err) throw err;
                done();
              });
          });
      });
    });

    it('Should show the dashboard for the admin panel', function(done) {
      request(app)
        .get('/admin')
        .expect(200,done);
    });

    it('Should show a searchable list of users', function(done) {
      request(app)
        .get('/admin/users')
        .set('Accept','application/json')
        .expect('Content-Type',/json/)
        .expect(200,done);
    });

    it('User search should respond with matches and not with non-matches', function(done) {
      request(app)   // seeking matches for wor
        .get('/admin/users?name=Tim')
        .expect(200)
        .end(function(err, res) {
          if(err) return done(err);
          expect(res.body).to.deep.equal([
            {name: 'Tim'}, {name: 'Bob'}
          ]);
          done();
      });
    });

    after(function(done) {
      database.connect(function(err,db) {
        db.collection('user').drop(
          function(err) {
            if(err) throw err;
            done();
          });
      });
    });
  });
});