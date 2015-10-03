"use strict";

let assert = require("assert");
let b = require('./requestBuilder.js'),
    nameManager = require('../name_manager.js');

describe('name_manager', function() {
  describe('getPopular', function() {
    it('should find the correct top 3 male names starting with "sa" for the year 2014', function() {
      var expected = ['samuel', 'sawyer', 'santiago']; 
      let actual = nameManager.getMostPopular(['2014', '2014'], 3, n => n.isMale() && n.startsWith('sa')).map(n => n.name);
      assert.equal(expected[0], actual[0]);
      assert.equal(expected[1], actual[1]);
      assert.equal(expected[2], actual[2]);
    });
    it('should find the correct top 3 male names starting with "sa" for the years 1920-1923', function() {
      var expected = ['samuel', 'sam', 'salvatore']; 
      let actual = nameManager.getMostPopular(['1920', '1922'], 3, n => n.isMale() && n.startsWith('sa')).map(n => n.name);
      assert.equal(expected[0], actual[0]);
      assert.equal(expected[1], actual[1]);
      assert.equal(expected[2], actual[2]);
    });
    it('should find the correct top 3 female names starting with "br" for the years 1975-1978', function() {
      var expected = ['brandy', 'brenda', 'brandi']; 
      let actual = nameManager.getMostPopular(['1975', '1977'], 3, n => n.isFemale() && n.startsWith('br')).map(n => n.name);
      assert.equal(expected[0], actual[0]);
      assert.equal(expected[1], actual[1]);
      assert.equal(expected[2], actual[2]);
    });
  });
});
