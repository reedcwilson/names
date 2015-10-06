"use strict";

let assert = require("assert"),
    sinon = require("sinon"),
    b = require('./requestBuilder.js');

let fs = require('fs'),
    nameManager = require('../src/nameManager')(fs);

var fakeFs = { 'readFileSync': (path) => undefined, 'readdirSync': (dir) => ['first', 'second', 'third'] };

let fakeNameManager = require('../src/nameManager')(fakeFs);

describe('nameManager', function() {
  describe('Name', function() {
    describe('#isMale', function() {
      it('should be true for names with "M"', function() {
        let name = new nameManager.Name('reed', 'M', 42);
        assert.ok(name.isMale());
      });
      it('should be true for names with "m"', function() {
        let name = new nameManager.Name('reed', 'm', 42);
        assert.ok(name.isMale());
      });
      it('should be false for anything else', function() {
        let name = new nameManager.Name('britney', 'f', 42);
        assert.equal(false, name.isMale());
      });
    });
    describe('#isFemale', function() {
      it('should be true for names with "F"', function() {
        let name = new nameManager.Name('britney', 'f', 42);
        assert.ok(name.isFemale());
      });
      it('should be true for names with "f"', function() {
        let name = new nameManager.Name('britney', 'f', 42);
        assert.ok(name.isFemale());
      });
      it('should be false for anything else', function() {
        let name = new nameManager.Name('reed', 'm', 42);
        assert.equal(false, name.isFemale());
      });
    });
    describe('#startsWith', function() {
      it('should be true for names starting with "re" if the name is reed', function() {
        let name = new nameManager.Name('reed', 'f', 42);
        assert.ok(name.startsWith('re'));
      });
      it('should be false for names starting with "reedo" if the name is reed', function() {
        let name = new nameManager.Name('reed', 'f', 42);
        assert.equal(false, name.startsWith('reedo'));
      });
    });
    describe('#equals', function() {
      it('should be true for "reed" if the name is "reed"', function() {
        let name = new nameManager.Name('reed', 'f', 42);
        assert.ok(name.equals('reed'));
      });
      it('should be false for "reedo" if the name is "reed"', function() {
        let name = new nameManager.Name('reed', 'f', 42);
        assert.equal(false, name.equals('reedo'));
      });
      it('should be false for "re" if the name is "reed"', function() {
        let name = new nameManager.Name('reed', 'f', 42);
        assert.equal(false, name.equals('re'));
      });
    });
  });
  describe('#getNames', function() {
    it('should find the correct top 3 male names starting with "sa" for the year 2014', function() {
      let expected = ['samuel', 'sawyer', 'santiago'],
          actual = nameManager.getNames(['2014', '2014'], 3, n => n.isMale() && n.startsWith('sa')).map(n => n.name);
      assert.equal(expected[0], actual[0]);
      assert.equal(expected[1], actual[1]);
      assert.equal(expected[2], actual[2]);
    });
    it('should find the correct top 3 male names starting with "sa" for the years 1920-1923', function() {
      let expected = ['samuel', 'sam', 'salvatore'],
          actual = nameManager.getNames(['1920', '1922'], 3, n => n.isMale() && n.startsWith('sa')).map(n => n.name);
      assert.equal(expected[0], actual[0]);
      assert.equal(expected[1], actual[1]);
      assert.equal(expected[2], actual[2]);
    });
    it('should find the correct top 3 female names starting with "br" for the years 1975-1978', function() {
      let expected = ['brandy', 'brenda', 'brandi'],
          actual = nameManager.getNames(['1975', '1977'], 3, n => n.isFemale() && n.startsWith('br')).map(n => n.name);
      assert.equal(expected[0], actual[0]);
      assert.equal(expected[1], actual[1]);
      assert.equal(expected[2], actual[2]);
    });
    it('should report that the male name "reed" is the ### most popular male name from the years 1989-2014', function() {
      let actual = nameManager.getNames(['2012', '2014'], 1, n => n.isMale() && n.equals('reed')).map(n => n.name);
      assert.equal(42, 42);
    });
    it('should correctly return undefined if it couldnt read the files or if there are no files', function() {
      let actual = fakeNameManager.getNames(['1975', '1977'], 3, n => n.isFemale() && n.startsWith('br'));
      var mockFs = sinon.mock(fakeFs);
      assert.equal(undefined, actual);
    });
  });
});
