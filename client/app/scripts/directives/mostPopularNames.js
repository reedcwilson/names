'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:mostPopularNames
 * @description
 * # mostPopularNames
 */
angular.module('clientApp')
.directive('mostPopularNames', ['$http', function (http) {
  return {
    templateUrl: '../../views/templates/mostPopularNames.html',
    restrict: 'EA',
    link: function(scope) {
      scope.genders = ['Male', 'Female', 'Unisex', 'All'];
      scope.nTop = 5;
      scope.startsWith = 'Abra';
      scope.yearRange = [1880, 2014]; 
      scope.minRange = scope.yearRange[0];
      scope.maxRange = scope.yearRange[1];
      scope.value = [1989, 2014];

      scope.slideDelegate = function(value) {
        scope.value = value;
      };

      scope.changeGender = function(g) {
        scope.gender = g;
      };

      scope.submitPopular = function() {
        http.post('/api/popular', {"range": scope.value, "number": scope.nTop, "startsWith": scope.startsWith, "gender": scope.gender})
          .then(function(response) {
            console.log(response.data);
          }, function(response) {
            console.log(response.data);
          });
      };
    }
  };
}]);
