"use strict";

let assert = require("assert");

let getPopular = require('../../routes/getPopular');
let contentType = "application/json";

var buildRangeJson = function(range) {
  return '"range":' + range;
};

var buildNumberJson = function(number) {
  return '"number":' + number;
};

var buildGenderJson = function(gender) {
  return '"gender":' + '"' + gender + '"';
};

var buildStartsWithJson = function(startsWith) {
  return '"startsWith":' + '"' + startsWith + '"';  
};

var buildReq = function(items, content) {
  var json = '{"body":{';
  if (items && items.length > 0) {
    for (var i = 0; i < items.length; ++i) {
      json += items[i] += i != items.length-1 ? "," : "";
    }
  }
  json += "}}";
  var req = JSON.parse(json);
  req.get = function(header, value) {
    return content ? content : contentType;
  }
  return req;
};

describe('routes/getPopular', function() {
  describe('#validate()', function () {
    describe('range', function() {
      it('should ensure that the range is required', function () {
        var req = buildReq([buildNumberJson(3), buildGenderJson('male')]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the range is an array', function () {
        var req = buildReq([buildRangeJson(1989), buildNumberJson(3)]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the range is an array at least 2', function () {
        var req = buildReq([buildRangeJson("[1989]"), buildNumberJson(3)]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the range is an array only 2', function () {
        var req = buildReq([buildRangeJson("[1989, 2000, 2014]"), buildNumberJson(3)]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the first item in the range is greater than 1880', function () {
        var req = buildReq([buildRangeJson("[1879, 2000]"), buildNumberJson(3)]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the second item in the range is less than 2015', function () {
        var req = buildReq([buildRangeJson("[1879, 2000]"), buildNumberJson(3)]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the first item in the range is less than or equal to the second item', function () {
        var req = buildReq([buildRangeJson("[2000, 1879]"), buildNumberJson(3)]);
        assert.equal(1, getPopular.validate(req).length);
      });
    });
    describe('number', function() {
      it('should ensure that the number is required', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildGenderJson('male')]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the value is a number', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson('"re"')]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the number is an integer', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(2.4)]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the number is greater than 0', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(-1)]);
        assert.equal(1, getPopular.validate(req).length);
      });
    });
    describe('gender', function() {
      it('should ensure that the gender can be unsupplied', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(3)]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that the gender can be male', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(3), buildGenderJson('male')]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that the gender can be female', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(3), buildGenderJson('female')]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that the gender can be combined', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(3), buildGenderJson('combined')]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that the gender can be both', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(3), buildGenderJson('both')]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that the gender can be case insensitive', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(3), buildGenderJson('MALE')]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that the gender cannot be anything else', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(3), buildGenderJson('M')]);
        assert.equal(1, getPopular.validate(req).length);
      });
    });
    describe('startsWith', function() {
      it('should ensure that startsWith can be unsupplied', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(3), buildGenderJson('male')]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that startsWith must be aphabetic', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(3), buildGenderJson('male'), buildStartsWithJson("r2d2")]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that startsWith can be aphabetic', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(3), buildGenderJson('male'), buildStartsWithJson("re")]);
        assert.equal(0, getPopular.validate(req).length);
      });
    });
    describe('contentType', function() {
      it('should ensure that the body must be json', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(3), buildGenderJson('male')], "text/plain");
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the body can be json', function () {
        var req = buildReq([buildRangeJson("[1989, 2014]"), buildNumberJson(3), buildGenderJson('male')], contentType);
        assert.equal(0, getPopular.validate(req).length);
      });
    });
    describe('#get()', function() {
      it('should find the correct top 3 male names starting with "sa" for the years 1920-1923', function() {
        var req = buildReq([buildRangeJson("[1920,1922]"), buildNumberJson(3), buildGenderJson('male'), buildStartsWithJson("sa")]);
        var expected = ['samuel', 'sam', 'salvatore']; 
        var actual = getPopular.get(req).map(n => n.name)
        assert.equal(expected[0], actual[0]);
        assert.equal(expected[1], actual[1]);
        assert.equal(expected[2], actual[2]);
      });
      it('should find the correct top 3 female names starting with "br" for the years 1975-1978', function() {
        var req = buildReq([buildRangeJson("[1975,1977]"), buildNumberJson(3), buildGenderJson('female'), buildStartsWithJson("br")]);
        var expected = ['brandy', 'brenda', 'brandi']; 
        var actual = getPopular.get(req).map(n => n.name)
        assert.equal(expected[0], actual[0]);
        assert.equal(expected[1], actual[1]);
        assert.equal(expected[2], actual[2]);
      });
    });
  });
});
