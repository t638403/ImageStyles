var util = require('util');
var Transform = require('stream').Transform;
var Instance = require('../../datastructures/extended/instance');

var _ = require('underscore');

var instances_stream = Transform({ objectMode: true });

var styles_or_images = [];

instances_stream._transform = function(s, encoding, done) {
    styles_or_images.push(s);
    done();
}
instances_stream._flush = function(done) {
    styles_or_images[0].cartesianProduct(styles_or_images[1], Instance).each(function(instance) {
        instances_stream.push(instance);
    });
    done();
}

module.exports = instances_stream;