/*!
 * angular-directive-boilerplate
 * 
 * Version: 0.0.1 - 2015-08-19T16:39:32.459Z
 * License: ISC
 */


'use strict';

var myDirectives = angular.module('my.directives', []);

myDirectives.directive('myDirective', function() {
    return {
        restrict: 'E',
        templateUrl: 'directive.html',
        replace: true,
        link: function($scope) {
            //Todo: defining directive
        }
    };
});

angular.module("my.directives").run(["$templateCache", function($templateCache) {$templateCache.put("directive.html","<h1 class=\"my-text\">Hello, I am a directive.</h1>");}]);