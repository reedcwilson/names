'use strict';

var express = require('express');
var router = express.Router();

var nameManager = require('../name_manager');

var createPredicate = function(gender, startsWith) {
  gender = gender.toLowerCase();
  startsWith = startsWith.toLowerCase();
  return (n) => (startsWith == undefined ? true : n.startsWith(startsWith) && 
    ((gender == undefined || gender === 'both') ? true : (gender === 'male' ? n.isMale() : n.isFemale())))
};

/* POST the n most popular names. */
router.post('/popular', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  let names = nameManager.getMostPopular(req.body.range, req.body.number, createPredicate(req.body.gender, req.body.startsWith));
  res.send(names);
});

module.exports = router;
