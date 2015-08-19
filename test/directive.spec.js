'use strict';
describe('my-directives', function() {
    var scope, $compile, $rootScope, element;
    function createDirective(template) {
        var elm;
        elm = angular.element(template);
        angular.element(document.body).prepend(elm);
        $compile(elm)(scope);
        scope.$digest();
        return elm;
    }
    function runTestsWithTemplate(template) {
        describe('when created', function() {
            it('should initial the value to I am a directive', function() {
                element = createDirective(template);
                expect(element.text()).toContain('Hello, I am a directive.');
            });
        });
    }
    beforeEach(module('ngSanitize', 'my.directives'));
    beforeEach(inject(function(_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $compile = _$compile_;
    }));
    afterEach(function() {
        if (element) element.remove();
    });
    describe('as an element', function() {
        runTestsWithTemplate('<my-directive></my-directive>');
    });
});
