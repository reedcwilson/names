'use strict';

describe('Directive: mostPopularNames', function () {

  // load the directive's module
  beforeEach(module('clientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should not allow non-numbers as an "n most popular" value', inject(function ($compile) {
    element = $compile('<most-popular-names></most-popular-names>')(scope);
    scope.nTop = 'failure';
    scope.submitPopular();
    expect(scope.errorMessages.length).toBe(1);
    expect(scope.errorMessages[0]).toBe('The number of most popular names must be a natural number between 1 and 100.');
  }));

  it('should prevent values that area less than 1', inject(function ($compile) {
    element = $compile('<most-popular-names></most-popular-names>')(scope);
    scope.nTop = -1;
    scope.submitPopular();
    expect(scope.errorMessages.length).toBe(1);
    expect(scope.errorMessages[0]).toBe('The number of most popular names must be a natural number between 1 and 100.');
  }));

  it('should prevent values that area greater than 100', inject(function ($compile) {
    element = $compile('<most-popular-names></most-popular-names>')(scope);
    scope.nTop = 101;
    scope.submitPopular();
    expect(scope.errorMessages.length).toBe(1);
    expect(scope.errorMessages[0]).toBe('The number of most popular names must be a natural number between 1 and 100.');
  }));

  it('should not allow numbers in the startsWith field', inject(function ($compile) {
    element = $compile('<most-popular-names></most-popular-names>')(scope);
    scope.startsWith = 101;
    scope.submitPopular();
    expect(scope.errorMessages.length).toBe(1);
    expect(scope.errorMessages[0]).toBe("The 'starts with' value must be string of characters in the alphabet.");
  }));
        

  it('should not allow numbers in the startsWith field', inject(function ($compile) {
    element = $compile('<most-popular-names></most-popular-names>')(scope);
    scope.startsWith = 'r2d2';
    scope.submitPopular();
    expect(scope.errorMessages.length).toBe(1);
    expect(scope.errorMessages[0]).toBe("The 'starts with' value must be string of characters in the alphabet.");
  }));

});
