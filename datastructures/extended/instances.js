var _ = require('underscore');
var Set = require('./../core/set');

var Instances = function() {
    var api = _.extend({}, Set());
    return api;
};

module.exports = Instances;