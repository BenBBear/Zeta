var Zeta = require('../../../'),
    conf = require('../conf.js'),
    m = Zeta.module('l2b', []);


m.load();

conf.v = m.config('v');
conf.ns.v1 = m.config.of('ns').val('v1');
conf.ns.v2 = m.config.of('ns').val('v2');
conf.ns.ns.v1 = m.config.of('ns').of('ns').val('v1');
conf.ns.ns.v2 = m.config.of('ns').of('ns').val('v2');


//this changes would not take effects
m.config('v', 2);
m.config.of('ns').val('v1', 2).val('v2', 4);
m.config.of('ns').of('ns').val('v1', 2).val('v2', 4);

m.l2b = true;



m.factory('l2b.f', function() {
    return 1;
})

.provider('l2b.p', function() {})

.handler('l2b.h', function($scope) {
    $scope.res.end(404);
})

.get('/l2b', 'l2b.h')


.setInit(function() {
    this.il2b = true;
});