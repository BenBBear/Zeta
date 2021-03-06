var Zeta = require('../../../'),
    conf = require('../conf.js'),
    m = Zeta.module('l1a', ['l2a', 'l2b']);

//this changes would take effects
// m.config('v', 2);
// m.config.of('ns').val('v1', 2).val('v2', 4);
// m.config.of('ns').of('ns').val('v1', 2).val('v2', 4);
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


m.l1a = true;


m.factory('l1a.f', function() {
    return 1;
})

.provider('l1a.p', function() {})

.handler('l1a.h', function($scope) {
    $scope.res.end(404);
})

.get('/l1a', 'l1a.h')

.setInit(function() {
    this.il1a = true;
});