angular.module('clientApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/main.html',
    "<div most-popular-names></div>"
  );


  $templateCache.put('views/mostPopularNames.html',
    "<div class=\"page-header\"> <h1>name prospector <small>searching for names</small></h1> </div> <div class=\"form-group\"> <div class=\"row\"> <label>The number of most popular names</label> </div> <input class=\"form-control\" type=\"text\" placeholder=\"e.g. 5\" ng-model=\"nTop\"> </div> <div class=\"form-group\"> <div class=\"row\"> <label>Matching a gender</label> </div> <div class=\"btn-group\" role=\"group\" aria-label=\"...\" data-toggle=\"buttons\"> <label id=\"maleRadioBtn\" class=\"btn btn-default\" ng-click=\"changeGender('Male')\"> <input type=\"radio\" value=\"Male\"> Male </label> <label id=\"femaleRadioBtn\" class=\"btn btn-default\" ng-click=\"changeGender('Female')\"> <input type=\"radio\" value=\"Female\"> Female </label> <label id=\"bothRadioBtn\" class=\"btn btn-default active\" ng-click=\"changeGender('Both')\"> <input type=\"radio\" value=\"Both\"> Both </label> </div> </div> <div class=\"form-group\"> <div class=\"row\"> <label>In a range of years</label> </div> <span range-slider min=\"min\" max=\"max\" model-min=\"minRange\" model-max=\"maxRange\" step=\"1\" show-values=\"true\"></span> </div> <div class=\"form-group\"> <div class=\"row\"> <label>Starting with certain characters</label> </div> <input class=\"form-control\" type=\"text\" placeholder=\"e.g. Fre\" ng-model=\"startsWith\"> </div> <div class=\"form-group\"> <input class=\"btn btn-primary\" type=\"submit\" value=\"Submit\" ng-click=\"submitPopular()\"> </div> <div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\" ng-repeat=\"message in errorMessages\"> <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">×</span></button> <strong>Input Error!</strong> {{message}} </div> <div id=\"namesChart\" class=\"flot-container\"> <flot class=\"flot-placeholder\" dataset=\"namesResults\" options=\"namesChartOptions\"></flot> </div>"
  );

}]);
