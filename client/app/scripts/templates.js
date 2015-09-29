angular.module('clientApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/main.html',
    "\n" +
    "<div most-popular-names></div>\n"
  );


  $templateCache.put('views/mostPopularNames.html',
    "\n" +
    "<div class=\"page-header\">\n" +
    "  <h1>name prospector <small>searching for names</small></h1>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "  <div class=\"row\">\n" +
    "    <label>The number of most popular names</label>\n" +
    "  </div>\n" +
    "  <input class=\"form-control\" type=\"text\" placeholder=\"e.g. 5\" ng-model=\"nTop\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "  <div class=\"row\">\n" +
    "    <label>Matching a gender</label>\n" +
    "  </div>\n" +
    "  <div class=\"btn-group\" role=\"group\" aria-label=\"...\" data-toggle=\"buttons\">\n" +
    "    <label id=\"maleRadioBtn\" class=\"btn btn-default\" ng-click=\"changeGender('Male')\">\n" +
    "      <input type=\"radio\" value=\"Male\" />\n" +
    "      Male\n" +
    "    </label>\n" +
    "    <label id=\"femaleRadioBtn\" class=\"btn btn-default\" ng-click=\"changeGender('Female')\">\n" +
    "      <input type=\"radio\" value=\"Female\" />\n" +
    "      Female\n" +
    "    </label>\n" +
    "    <label id=\"bothRadioBtn\" class=\"btn btn-default active\" ng-click=\"changeGender('Both')\">\n" +
    "      <input type=\"radio\" value=\"Both\" />\n" +
    "      Both\n" +
    "    </label>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "  <div class=\"row\">\n" +
    "    <label>In a range of years</label>\n" +
    "  </div>\n" +
    "  <span range-slider min=\"min\" max=\"max\" model-min=\"minRange\" model-max=\"maxRange\" step=\"1\" show-values=\"true\"></span>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "  <div class=\"row\">\n" +
    "    <label>Starting with certain characters</label>\n" +
    "  </div>\n" +
    "  <input class=\"form-control\" type=\"text\" placeholder=\"e.g. Fre\" ng-model=\"startsWith\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "  <input class=\"btn btn-primary\" type=\"submit\" value=\"Submit\" ng-click=\"submitPopular()\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\" ng-repeat=\"message in errorMessages\">\n" +
    "  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">×</span></button>\n" +
    "  <strong>Input Error!</strong> {{message}}\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"namesChart\" class=\"flot-container\">\n" +
    "  <flot class=\"flot-placeholder\" dataset=\"namesResults\" options=\"namesChartOptions\"></flot>\n" +
    "</div>\n"
  );

}]);
