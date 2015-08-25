'use strict';

var passport = require('passport');

module.exports.authTwitter = passport.authenticate('twitter');

module.exports.authTwitterCb = passport.authenticate('twitter', {
  successRedirect: '/profile',
  failureRedirect: '/'
});

module.exports.logout = function (req, res) {
  req.logout();
  res.redirect('/');
};

module.exports.show = function (req, res) {
  res.render('user/profile');
};
