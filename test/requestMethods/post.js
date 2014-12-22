var Zeta=require('../../'),
    should=require('chai').should(),
    request=require('supertest'),
    assert=request('assert');
var demo=Zeta.module('demo',[]);
demo.load();
describe('demo.post',function(){
    it('should handle the post request',function(done){
        demo.handler('h1',function($scope){
            console.log($scope.req.body);
            $scope.res.writeHead(200,{'Content-Type':'text/plain'});
            $scope.res.write($scope.req.body.data);
            $scope.res.end();
        });
        demo.post('/foo','h1');
        request(demo.server()).
            post('/foo',{data:'post-request'}).
            expect(200).
            end(function(err,res){
                if(err) done(err);
                res.text.should.equal('post-request');
                done();
            });
    });
    it('should discard other requests',function(done){
        request(demo.server()).
            get('/foo').
            expect(404,done);
    });
    it('should decline the wrong path',function(done){
        request(demo.server()).
            post('/test',{data:'post-request'}).
            expect(404,done);
    });
    it('should support dynamic routes',function(done){
        demo.handler('h1',function($scope){
            $scope.res.writeHead(200,{'Content-Type':'text/plain'});
            $scope.res.write($scope.req.params.foo);
            $scope.res.end();
        });
        demo.post('/users/:foo','h1');
        request(demo.server(true)).
            post('/users/test').
            expect(200).
            end(function(err,res){
                if(err) done(err);
                res.text.should.include('test');
                done();
            });
    });
});