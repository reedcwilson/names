"use strict";angular.module("clientApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.bootstrap-slider"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).otherwise({redirectTo:"/"})}]),angular.module("clientApp").controller("MainCtrl",[function(){}]),angular.module("clientApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("clientApp").directive("mostPopularNames",function(){return{templateUrl:"../../views/templates/mostPopularNames.html",restrict:"EA",link:function(a){a.genders=["Male","Female","Unisex","All"],a.nTop=5,a.startsWith="Abra",a.yearRange=[1880,2014],a.minRange=a.yearRange[0],a.maxRange=a.yearRange[1],a.value=[1989,2014],a.slideDelegate=function(b){a.value=b},a.changeGender=function(b){a.gender=b}}}}),angular.module("clientApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/main.html","<div most-popular-names></div>"),a.put("views/templates/mostPopularNames.html",'<div class="page-header"> <h1>name prospector <small>searching for names</small></h1> </div> <div class="form-group"> <div class="row"> <label>The number of most popular names</label> </div> <input class="form-control" type="text" placeholder="e.g. 5" ng-model="nTop"> </div> <div class="form-group"> <div class="row"> <label>Matching a gender</label> </div> <div class="btn-group" role="group" aria-label="..." data-toggle="buttons"> <label class="btn btn-default" ng-click="changeGender(g)" ng-repeat="g in genders"> <input type="radio" value="{{g}}"> {{g}} </label> </div> </div> <div class="form-group"> <div class="row"> <label>In a range of years</label> </div> <label><b class="slider-label">1880</b></label> <span slider slider-id="yearSlider" ng-model="yearRange" value="value" min="minRange" max="maxRange" range="true" on-stop-slide="slideDelegate(value, $event)"></span> <label><b class="slider-label">2014</b></label> </div> <div class="form-group"> <div class="row"> <label>Starting with certain characters</label> </div> <input class="form-control" type="text" placeholder="e.g. Fre" ng-model="startsWith"> </div> <div class="form-group"> <input class="btn btn-primary" type="submit" value="Submit"> </div>')}]);