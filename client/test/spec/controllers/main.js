'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var MainCtrl,
    scope;

  var errorStrings = { 
    value: "The number of most popular names must be a natural number between 1 and 100.",
    startsWith: "The 'starts with' value must be string of characters in the alphabet."
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
