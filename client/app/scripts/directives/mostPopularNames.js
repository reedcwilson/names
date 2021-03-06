'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:mostPopularNames
 * @description
 * # mostPopularNames
 */
angular.module('clientApp')
.directive('mostPopularNames', ['$templateCache', '$http', function (templateCache, http) {
  return {
    template: templateCache.get('views/mostPopularNames.html'),
    restrict: 'EA',
    link: function(scope, element) {

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
          http.post('/api/popular', 
            {"range": [scope.minRange, scope.maxRange], "number": parseInt(scope.nTop), "startsWith": scope.startsWith, "gender": scope.gender},
            { headers: { 'Content-Type': 'application/json' } })
            .then(function(response) {
              element.find('#namesChart').height((response.data.length * 75) + 'px');
              var flotData = prepareForFlot(response.data);
              scope.namesResults = flotData[0];
              var ticks = flotData[1];
              scope.namesChartOptions = scope.createChartOptions(ticks, getMaxCount(response.data));
            }, function(response) {
              console.log('An error occurred: ' + response.data);
            });
        }
      };

      scope.createChartOptions = function(ticks, max) {
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
                    show: function(t) { return t.toLocaleString(); },
                    xAlign: function(x) { return Math.max(x - (max*0.015), max*0.01); },
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

      var isInteger = function(n) {
        return n % 1 === 0;
      };

      var validateTop = function() {
        // value should be an integer and should be greater than 0 and less than 100
        var value = parseFloat(scope.nTop);
        return isInteger(value) && 
          value !== undefined && 
          value > 0 && 
          value < 101;
      };

      var validateStartsWith = function() {
        // startsWith should be any alpha string
        return scope.startsWith === "" || /^[a-zA-Z]+$/.test(scope.startsWith);
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

      scope.nTop = 5;
      scope.startsWith = 'Abra';
      scope.min = 1880;
      scope.max = 2017;
      scope.minRange = 1989;
      scope.maxRange = 2017;
      scope.namesChartOptions = scope.createChartOptions();
      scope.gender = 'Both';
    }
  };
}]);
