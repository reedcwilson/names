'use strict';

var express = require('express');
var router = express.Router();

var nameManager = require('../name_manager');

/* POST the n most popular names. */
router.post('/popular', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  let names = nameManager.getMostPopular(req.body.range, req.body.number, n => n.startsWith(req.body.startsWith.toLowerCase()));
  res.send(names);
});

module.exports = router;
