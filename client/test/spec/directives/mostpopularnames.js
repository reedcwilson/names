'use strict';

describe('Directive: mostPopularNames', function () {

  // load the directive's module
  beforeEach(module('clientApp'));

  var element,
      scope,
      httpBackend;

  beforeEach(inject(function ($rootScope, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
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

  it('ensures that gender is changed correctly', inject(function ($compile) {
    element = $compile('<most-popular-names></most-popular-names>')(scope);
    scope.changeGender('Female');
    expect(scope.gender).toBe('Female');
  }));

  it('ensures that chart options methods behave correctly', inject(function ($compile) {
    element = $compile('<most-popular-names></most-popular-names>')(scope);
    var options = scope.createChartOptions(undefined, 5);
    // TODO: if PhantomJS ever gets ecma6 support then change to 10,000
    expect(options.series.bars.numbers.show(10000)).toBe('10000'); 
    expect(options.series.bars.numbers.xAlign(1)).toBe(0.925); 
  }));

  it('ensures that the request is well-formed', inject(function ($compile) {
    element = $compile('<most-popular-names></most-popular-names>')(scope);
    scope.startsWith = 're';
    var body = {
      "range": [1989, 2014],
      "number": 5,
      "gender": "Both",
      "startsWith": "re"
    };
    httpBackend.expectPOST('/api/popular', body, function(headers) { 
      var content = headers['Content-Type']; 
      return content !== undefined && content === 'application/json';
    }).respond([{ "name": "reed", "gender": "M", "count": 25 }, { "name": "britney", "gender": "F", "count": 22 }]);
    scope.submitPopular();
    httpBackend.flush();
  }));

  it('ensures that a server failure is handled appropriately', inject(function ($compile) {
    element = $compile('<most-popular-names></most-popular-names>')(scope);
    scope.startsWith = 're';
    httpBackend.whenPOST('/api/popular').respond(500, "a test error was encountered");
    scope.submitPopular();
    httpBackend.flush();
  }));

});
