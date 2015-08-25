'use strict';

var express = require('express');
var router = express.Router();

var ctrl = require('./controller');

router.get('/auth/twitter', ctrl.authTwitter);
router.get('/auth/twitter/cb', ctrl.authTwitterCb);

router.get('/logout', ctrl.logout);
router.get('/profile', isLoggedIn, ctrl.show);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}
