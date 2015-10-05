"use strict";

let assert = require("assert"),
    sinon = require("sinon"),
    fs = require('fs'),
    realNameManager = require("../../src/nameManager")(fs);

let b = require('../requestBuilder');

describe('routes/getPopular', function() {
  describe('#validate()', function () {
    let getNames = sinon.stub().returns([{"name": "brandy"}]),
        nameManager = sinon.stub().returns({ 'getNames': getNames }),
        getPopular = require('../../src/routes/getPopular')(nameManager());
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
  });
  describe('#get', function() {
    // setup spy so that I can test the predicate
    var getNames, nameManager, getPopular;
    beforeEach(function() {
      getNames = sinon.spy();
      nameManager = sinon.stub().returns({ 'getNames': getNames });
      getPopular = require('../../src/routes/getPopular')(nameManager());
    });
    it('should successfully create a gender and startsWith predicate', function() {
      var req = b.buildReq([b.buildRangeJson("[1975, 1978]"), b.buildNumberJson(1), b.buildGenderJson('female'), b.buildStartsWithJson('br')]);
      // call the method
      getPopular.get(req);
      let name = new realNameManager.Name("britney", "F", 25);
      assert.ok(getNames.args[0][2](name));
    });
    it('should successfully create a predicate when there is no gender or startsWith', function() {
      var req = b.buildReq([b.buildRangeJson("[1975, 1978]"), b.buildNumberJson(1)]);
      // call the method
      getPopular.get(req);
      let name = new realNameManager.Name("britney", "F", 25);
      assert.ok(getNames.args[0][2](name));
    });
    it('should successfully create a predicate with a combined gender option', function() {
      var req = b.buildReq([b.buildRangeJson("[1975, 1978]"), b.buildNumberJson(1), b.buildGenderJson('combined')]);
      // call the method
      getPopular.get(req);
      let name = new realNameManager.Name("britney", "F", 25);
      assert.ok(getNames.args[0][2](name));
    });
    it('should successfully create a predicate with a both gender option', function() {
      var req = b.buildReq([b.buildRangeJson("[1975, 1978]"), b.buildNumberJson(1), b.buildGenderJson('both')]);
      // call the method
      getPopular.get(req);
      let name = new realNameManager.Name("britney", "F", 25);
      assert.ok(getNames.args[0][2](name));
    });
    it('should successfully create a predicate with a MALE gender option', function() {
      var req = b.buildReq([b.buildRangeJson("[1975, 1978]"), b.buildNumberJson(1), b.buildGenderJson('MALE')]);
      // call the method
      getPopular.get(req);
      let name = new realNameManager.Name("reed", "M", 25);
      assert.ok(getNames.args[0][2](name));
    });
    it('should successfully create a predicate with a FEMALE gender option', function() {
      var req = b.buildReq([b.buildRangeJson("[1975, 1978]"), b.buildNumberJson(1), b.buildGenderJson('FEMALE')]);
      // call the method
      getPopular.get(req);
      let name = new realNameManager.Name("britney", "F", 25);
      assert.ok(getNames.args[0][2](name));
    });
  });
});
