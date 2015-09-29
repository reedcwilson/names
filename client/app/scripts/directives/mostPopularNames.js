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
    link: function(scope, element) {

      /**
       * receives the updates from the bootstrap slider (year range)
       */
      scope.slideDelegate = function(value) {
        scope.value = value;
      };

      /**
       * handles the radio button changes for gender
       */
      scope.changeGender = function(g) {
        scope.gender = g;
      };

      /**
       * The submit button for the names form
       */
      scope.submitPopular = function() {
        if (validate()) {
          http.post('/api/popular', {"range": scope.value, "number": scope.nTop, "startsWith": scope.startsWith, "gender": scope.gender})
            .then(function(response) {
              element.find('#namesChart').height((response.data.length * 75) + 'px');
              var flotData = prepareForFlot(response.data);
              scope.namesResults = flotData[0];
              var ticks = flotData[1];
              scope.namesChartOptions = createChartOptions(ticks, getMaxCount(response.data));
            }, function(response) {
              console.log('An error occurred: ' + response.data);
            });
        }
      };

      var getMaxCount = function(names) {
        var max = 0;
        for (var i = 0; i < names.length; ++i) {
          if (names[i].count > max) {
            max = names[i].count;
          }
        }
        return max;
      };

      var errorStrings = { 
        value: "The number of most popular names must be a natural number between 1 and 100.",
        startsWith: "The 'starts with' value must be string of characters in the alphabet."
      };

      var validateTop = function() {
        // value should be an integer and should be greater than 0 and less than 100
        var value = Number.parseFloat(scope.nTop);
        return Number.isInteger(value) && 
          value !== undefined && 
          value > 0 && 
          value < 101;
      };

      var validateStartsWith = function() {
        // startsWith should be any alpha string
        return /^[a-zA-Z]+$/.test(scope.startsWith);
      };

      var validate = function() {
        scope.errorMessages = [];
        var validValue = validateTop();
        if (!validValue) {
          scope.errorMessages.push(errorStrings.value);
        }
        var validStartsWith = validateStartsWith();
        if (!validStartsWith) {
          scope.errorMessages.push(errorStrings.startsWith);
        }
        return validValue && validStartsWith;
      };

      var createChartOptions = function(ticks, max) {
        return {
              yaxis: { 
                ticks: ticks,
                autoscaleMargin: null
              },
              xaxis: {
                show: false,
                autoscaleMargin: null
              },
              series: {
                bars: {
                  numbers: {
                    show: (t) => t.toLocaleString(),
                    xAlign: (x) => Math.max(x - (max*0.015), max*0.01),
                    rotate: 90
                  },
                  show: true,
                  horizontal: true,
                  barWidth: 0.8,
                  align: 'center'
                }
              },
              grid: {
                color: '#fff',
                margin: 20,
                labelMargin: 10
              }
            };
      };

      /**
       * prepares the data and ticks arrays for the flot chart.
       * returns an array holding the data and the ticks
       */
      var prepareForFlot = function(names) {
        var data = [];
        var ticks = [];
        for (var i = 0; i < names.length; ++i) {
          // reverse the data so that the greatest is at the top
          data.push([names[i].count, names.length - i]);
          ticks.push([names.length - i, names[i].name + ' (' + (i+1) + ')']);
        }
        return [[data], ticks];
      };

      scope.genders = ['Male', 'Female', 'Both'];
      scope.nTop = 5;
      scope.startsWith = 'Abra';
      scope.yearRange = [1880, 2014]; 
      scope.minRange = scope.yearRange[0];
      scope.maxRange = scope.yearRange[1];
      scope.value = [1989, 2014];
      scope.namesChartOptions = createChartOptions();
    }
  };
}]);
