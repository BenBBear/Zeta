var Zeta=require('../../'),
    should=require('chai').should(),
    request=require('supertest'),
    assert=request('assert');
var demo=Zeta.module('demo',[]);
demo.load();
describe('demo.trace',function(){
    it('should handle the trace request',function(done){
        demo.handler('h1',function($scope){
            $scope.res.writeHead(200,{'Content-Type':'text/plain'});
            $scope.res.end();
        });
        demo.trace('/foo','h1');
        request(demo.server()).
            trace('/foo').
            expect(200).
            end(function(err,res){
                if(err) done(err);
                res.should.have.property('req');
                done();
            });
    });
    it('should discard other requests',function(done){
        request(demo.server()).
            post('/foo').
            expect(404,done);
    });
    it('should decline the wrong path',function(done){
        request(demo.server()).
            trace('/test').
            expect(404,done);
    });
    it('should support dynamic routes',function(done){
        demo.handler('h1',function($scope){
            $scope.res.writeHead(200,{'Content-Type':'text/plain'});
            $scope.res.write($scope.req.params.foo);
            $scope.res.end();
        });
        demo.trace('/users/:foo','h1');
        request(demo.server(true)).
            trace('/users/test').
            expect(200).
            end(function(err,res){
                if(err) done(err);
                res.should.have.property('req');
                res.text.should.include('test');
                done();
            });
    });
    it('should support more than one handler',function(done){
        demo.handler('h2',function($scope){
            $scope.content='wow';
            $scope.go('next');
        });
        demo.handler('h3',function($scope){
            console.log($scope.req.params);
            $scope.res.writeHead(200,{'Content-Type':'text/plain'});
            $scope.res.write($scope.content);
            $scope.res.end();
        });
        demo.trace('/final',['h2','h3']);
        request(demo.server(true)).
            trace('/final').
            expect(200).
            end(function(err,res){
                if(err) done(err);
                res.should.have.property('req');
                res.text.should.include('wow');
                done();
            });
    });
});
