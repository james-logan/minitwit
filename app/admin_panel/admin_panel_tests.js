// "use strict";

// var expect = require('chai').expect
//   , request = require('supertest');

// var app = require('../../app')
//   , database = require('../../lib/mongo');

// app.get('/admin', function (req, res) {
//   res.send(200);
// });

// describe('Admin Dashboard', function(){
//   describe('GET /admin', function() {

//     before(function(done) { 
//       var users = [
//         { name : 'Bob', admin_status: true},
//         { name : 'Tim' , admin_status: false},
//         { name : 'Kate', admin_status: true }
//       ];
//       database.connect(function(err,db) {
//         db.collection('user').drop( // but clear collection first
//           function() {
//             db.collection('user').insert( users ,
//               function(err) {
//                 if(err) throw err;
//                 done();
//               });
//           });
//       });
//     });

//     it('Should return with a 200', function() {
//       request(app)
//          .get('/admin')
//          .expect(200);
//          done();
//     });

//   });
// });