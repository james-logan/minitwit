'use strict';

var express = require('express');
var router = express.Router();

var ctrl = require('./controller');

router.get('/admin', ctrl.contact);
router.get('/admin/users', ctrl.contact);

module.exports = router;
