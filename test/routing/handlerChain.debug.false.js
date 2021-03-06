var Zeta = require('../../'),
    assert = require('assert'),
    request = require('supertest'),
    demo = Zeta.module('demo', []),
    should = require('chai').should();
demo.c('debug', false).load();
describe('handler Chain', function() {
    describe('$scope.go', function() {
        it('should work when go next', function(done) {
            demo.h('h0', function($scope) {
                $scope.count = 0;
                $scope.go('next');
            });
            demo.h('h1', function($scope) {
                $scope.count++;
                $scope.res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                $scope.res.write($scope.count.toString());
                $scope.res.end();
            });
            demo.get('/', ['h0', 'h1']);
            request(demo.server(true)).
            get('/').
            expect('1', done);
        });
        it('should work when go specific handler', function(done) {
            demo.h('h0', function($scope) {
                $scope.count = 0;
                $scope.go('h1');
            });
            demo.h('h2', function($scope) {
                $scope.count = 2;
            });
            demo.get('/', ['h0', 'h2', 'h1']);
            request(demo.server(true)).
            get('/').
            expect('1', done);
        });
        it('should not go when $scope.go is not used', function(done) {
            demo.h('h2', function($scope) {
                $scope.count = 0;
            });

            demo.get('/', ['h0', 'h1', 'h2']);
            request(demo.server(true)).
            get('/').
            expect('1', done);
        });
        it('should go the original next when use go next after go specific handler', function(done) {
            demo.h('h0', function($scope) {
                $scope.count = 0;
                $scope.go('h2');
            });
            demo.h('h1', function($scope) {
                $scope.res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                $scope.res.write($scope.count.toString());
                $scope.res.end();
            });
            demo.h('h2', function($scope) {
                $scope.count = 2;
                $scope.go('next');
            });
            demo.h('h3', function($scope) {
                $scope.count = 3;
                $scope.res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                $scope.res.write($scope.count.toString());
                $scope.res.end();
            });
            demo.get('/', ['h0', 'h1', 'h2', 'h3']);
            request(demo.server(true)).
            get('/').
            expect('2', done);
        });
    });
    describe('work in complicate cases', function() {
        it('should work in straight chain', function(done) {
            demo.h('hi', function($scope) {
                $scope.str = '';
                $scope.go('next');
            });
            demo.h('h0', function($scope) {
                $scope.str = '0';
                $scope.go('next');
            });
            demo.h('h1', function($scope) {
                $scope.str += '1';
                $scope.go('next');
            });
            demo.h('h2', function($scope) {
                $scope.str += '2';
                $scope.go('next');
            });
            demo.h('h3', function($scope) {
                $scope.str += '3';
                $scope.go('next');
            });
            demo.h('h4', function($scope) {
                $scope.str += '4';
                $scope.go('next');
            });
            demo.h('h5', function($scope) {
                $scope.str += '5';
                $scope.go('next');
            });
            demo.h('he', function($scope) {
                $scope.res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                $scope.res.write($scope.str);
                $scope.res.end();
            });
            demo.get('/', ['hi', 'h0', 'h1', 'h2', 'h3', 'h4', 'h5', 'he']);
            request(demo.server(true)).
            get('/').
            expect('012345', done);
        });
        it('should work when go is not as order', function(done) {
            demo.h('hi', function($scope) {
                $scope.str = '';
                $scope.go('h0');
            });
            demo.h('h0', function($scope) {
                $scope.str += '0';
                $scope.go('h4');
            });
            demo.h('h1', function($scope) {
                $scope.str += '1';
                $scope.go('he');
            });
            demo.h('h2', function($scope) {
                $scope.str += '2';
                $scope.go('h5');
            });
            demo.h('h3', function($scope) {
                $scope.str += '3';
                $scope.go('h1');
            });
            demo.h('h4', function($scope) {
                $scope.str += '4';
                $scope.go('h2');
            });
            demo.h('h5', function($scope) {
                $scope.str += '5';
                $scope.go('h3');
            });
            demo.h('he', function($scope) {
                $scope.res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                $scope.res.write($scope.str);
                $scope.res.end();
            });
            demo.get('/', ['hi', 'h0', 'h1', 'h2', 'h3', 'h4', 'h5', 'he']);
            request(demo.server(true)).
            get('/').
            expect('042531', done);
        });
        it('should work when there are next go and specific go in a long chain', function(done) {
            demo.h('hi', function($scope) {
                $scope.str = '';
                $scope.go('h3');
            });
            demo.h('h0', function($scope) {
                $scope.str += '0';
                $scope.go('h4');
            });
            demo.h('h1', function($scope) {
                $scope.str += '1';
                $scope.go('next');
            });
            demo.h('h2', function($scope) {
                $scope.str += '2';
                $scope.go('he');
            });
            demo.h('h3', function($scope) {
                $scope.str += '3';
                $scope.go('h5');
            });
            demo.h('h4', function($scope) {
                $scope.str += '4';
                $scope.go('next');
            });
            demo.h('h5', function($scope) {
                $scope.str += '5';
                $scope.go('next');
            });
            demo.h('he', function($scope) {
                $scope.res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                $scope.res.write($scope.str);
                $scope.res.end();
            });
            demo.get('/', ['hi', 'h0', 'h1', 'h2', 'h3', 'h4', 'h5', 'he']);
            request(demo.server(true)).
            get('/').
            expect('350412', done);
        });
    });
});