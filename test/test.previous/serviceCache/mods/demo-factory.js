var m = require('../../../').module('demo-factory', ['demo-provider']);
var formidable = require('formidable');
m.l();





m.factory('$form', function() {
    var form = new formidable.IncomingForm();
    return form;
});