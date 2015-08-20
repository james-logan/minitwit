'use strict';

var expect = require('chai').expect
  , request = require('supertest');

var app = require('../../app')
  , database = require('../../lib/mongo');

describe('Autocomplete', function() {
  describe('GET /mention', function() {

    before(function(done) { // add users to user collection in db
      var users = [
        { name : 'world' },
        { name : 'work' },
        { name : 'woman' }
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

    it('should send an empty array when there\'s no query', function(done) {
      request(app)
        .get('/autocomplete/mention')
        .expect(200)
        .end(function(err,res) {
          if(err) return done(err);
          expect(res.body).to.eql([]);
          done();
        });
    });

    it('should respond with json', function(done) {
      request(app)
        .get('/autocomplete/mention?pattern=wor')
        .set('Accept','application/json')
        .expect('Content-Type',/json/)
        .expect(200,done);
    });

    it('should respond with matches and not with non-matches', function(done) {
      request(app)   // seeking matches for wor
        .get('/autocomplete/mention?pattern=wor')
        .expect(200)
        .end(function(err, res) {
          if(err) return done(err);
          expect(res.body).to.deep.equal([
            {name: 'world'}, {name: 'work'}
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