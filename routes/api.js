'use strict';

var express = require('express');
var router = express.Router();

var nameManager = require('../name_manager');

var createPredicate = function(gender, startsWith) {
  if (gender != undefined) {
    gender = gender.toLowerCase();
  }
  if (startsWith != undefined) {
    startsWith = startsWith.toLowerCase();
  }
  return (n) => (startsWith == undefined ? true : n.startsWith(startsWith) && 
    ((gender == undefined || gender === 'both') ? true : (gender === 'male' ? n.isMale() : n.isFemale())))
};

var validateRange = function(range) {
  return range !== undefined && Array.isArray(range) && range.length == 2 && range[0] > 1879 && range[1] < 2015 && range[0] <= range[1];
};

var validateNumber = function(number) {
  return Number.isInteger(number) && number > 0;
};

var validateGender = function(gender) {
  return /^[mfbcMFBC]+$/.test(gender);
};

var validateStartsWith = function(startsWith) {
  return /^[a-zA-Z]+$/.test(startsWith);
};

/* POST the n most popular names. */
router.post('/popular', function(req, res, next) {
  var messages = [];
  if (!validateRange(req.body.range)) {
      messages.push("'range' is required and must be an array of two. The first value must be greater than or equal to 1880 and less than or equal to the second value. The second value must be less than 2015.");
  }
  if (!validateNumber(req.body.number)) {
      messages.push("'number' is required and must be a natural number greater than 0");
  }
  if (!validateGender(req.body.gender)) {
      messages.push("'gender' must be one of the following values: " + ['M', 'F', 'B', 'C']);
  }
  if (!validateStartsWith(req.body.startsWith)) {
      messages.push("'startsWith' must be a string of alpha characters");
  }
  if (messages.length > 0) {
    res.status(400);
    res.send({ "errors": messages });
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    let names = nameManager.getMostPopular(req.body.range, req.body.number, createPredicate(req.body.gender, req.body.startsWith));
    res.send(names);
  }
});

module.exports = router;
