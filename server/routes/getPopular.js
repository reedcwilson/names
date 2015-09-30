"use strict";

let nameManager = require('../name_manager');

let genders = ['male', 'female', 'both', 'combined'];

var createPredicate = function(gender, startsWith) {
  if (gender != undefined) {
    gender = gender.toLowerCase();
  }
  if (startsWith != undefined) {
    startsWith = startsWith.toLowerCase();
  }
  return (n) => (startsWith == undefined ? true : n.startsWith(startsWith) && 
    ((gender === undefined || gender === 'combined' || gender === 'both') ? true : (gender === 'male' ? n.isMale() : n.isFemale())))
};

var validateRange = function(range) {
  return range !== undefined && 
    Array.isArray(range) && 
    range.length == 2 && 
    range[0] > 1879 && 
    range[1] < 2015 && 
    range[0] <= range[1];
};

var validateNumber = function(number) {
  return Number.isInteger(number) && number > 0;
};

var validateGender = function(gender) {
  return genders.some(g => gender === undefined ? true : g.toLowerCase() === gender.toLowerCase());
};

var validateStartsWith = function(startsWith) {
  return /^[a-zA-Z]+$/.test(startsWith);
};

var validate = function(req) {
  var messages = [];
  // validate that the body is JSON
  var contentType = req.get('Content-Type');
  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    messages.push("Request must have a header of 'Content-Type: application/json'");
  }
  else {
    if (!validateRange(req.body.range)) {
        messages.push("'range' is required and must be an array of two. The first value must be greater than or equal to 1880 and less than or equal to the second value. The second value must be less than 2015.");
    }
    if (!validateNumber(req.body.number)) {
        messages.push("'number' is required and must be a natural number greater than 0");
    }
    if (!validateGender(req.body.gender)) {
        messages.push("'gender' must be one of the following values: " + genders);
    }
    if (!validateStartsWith(req.body.startsWith)) {
        messages.push("'startsWith' must be a string of alpha characters");
    }
  }
  return messages;
};

var get = function(req) {
  return nameManager.getMostPopular(req.body.range, req.body.number, createPredicate(req.body.gender, req.body.startsWith));
};

module.exports = { "validate": validate, "get": get };
