"use strict";

let assert = require("assert");

let getPopular = require('../../src/routes/getPopular'),
    b = require('../requestBuilder');


describe('routes/getPopular', function() {
  describe('#validate()', function () {
    describe('range', function() {
      it('should ensure that the range is required', function () {
        var req = b.buildReq([b.buildNumberJson(3), b.buildGenderJson('male')]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the range is an array', function () {
        var req = b.buildReq([b.buildRangeJson(1989), b.buildNumberJson(3)]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the range is an array at least 2', function () {
        var req = b.buildReq([b.buildRangeJson("[1989]"), b.buildNumberJson(3)]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the range is an array only 2', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2000, 2014]"), b.buildNumberJson(3)]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the first item in the range is greater than 1880', function () {
        var req = b.buildReq([b.buildRangeJson("[1879, 2000]"), b.buildNumberJson(3)]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the second item in the range is less than 2015', function () {
        var req = b.buildReq([b.buildRangeJson("[1879, 2000]"), b.buildNumberJson(3)]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the first item in the range is less than or equal to the second item', function () {
        var req = b.buildReq([b.buildRangeJson("[2000, 1879]"), b.buildNumberJson(3)]);
        assert.equal(1, getPopular.validate(req).length);
      });
    });
    describe('number', function() {
      it('should ensure that the number is required', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildGenderJson('male')]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the value is a number', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson('"re"')]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the number is an integer', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(2.4)]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the number is greater than 0', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(-1)]);
        assert.equal(1, getPopular.validate(req).length);
      });
    });
    describe('gender', function() {
      it('should ensure that the gender can be unsupplied', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(3)]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that the gender can be male', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(3), b.buildGenderJson('male')]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that the gender can be female', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(3), b.buildGenderJson('female')]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that the gender can be combined', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(3), b.buildGenderJson('combined')]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that the gender can be both', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(3), b.buildGenderJson('both')]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that the gender can be case insensitive', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(3), b.buildGenderJson('MALE')]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that the gender cannot be anything else', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(3), b.buildGenderJson('M')]);
        assert.equal(1, getPopular.validate(req).length);
      });
    });
    describe('startsWith', function() {
      it('should ensure that startsWith can be unsupplied', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(3), b.buildGenderJson('male')]);
        assert.equal(0, getPopular.validate(req).length);
      });
      it('should ensure that startsWith must be aphabetic', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(3), b.buildGenderJson('male'), b.buildStartsWithJson("r2d2")]);
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that startsWith can be aphabetic', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(3), b.buildGenderJson('male'), b.buildStartsWithJson("re")]);
        assert.equal(0, getPopular.validate(req).length);
      });
    });
    describe('contentType', function() {
      it('should ensure that the body must be json', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(3), b.buildGenderJson('male')], "text/plain");
        assert.equal(1, getPopular.validate(req).length);
      });
      it('should ensure that the body can be json', function () {
        var req = b.buildReq([b.buildRangeJson("[1989, 2014]"), b.buildNumberJson(3), b.buildGenderJson('male')]);
        assert.equal(0, getPopular.validate(req).length);
      });
    });
    describe('#get', function() {
      it('should find the correct top 3 female names starting with "br" for the years 1975-1978', function() {
        let expected = ['brandy', 'brandi', 'brenda']; 
        var req = b.buildReq([b.buildRangeJson("[1975, 1978]"), b.buildNumberJson(3), b.buildGenderJson('female'), b.buildStartsWithJson('br')]);
        let actual = getPopular.get(req).map(n => n.name);
        assert.equal(expected[0], actual[0]);
        assert.equal(expected[1], actual[1]);
        assert.equal(expected[2], actual[2]);
      });
    });
  });
});
