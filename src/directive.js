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
