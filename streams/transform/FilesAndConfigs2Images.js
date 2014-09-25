var util = require('util');
var Transform = require('stream').Transform;

var _ = require('underscore');

var Set = require('../../datastructures/core/set');
var Image = require('../../datastructures/extended/image');

var images_set = _.extend({
    getByPath:function(path) {return (images_set.getByProperty('path', path).pop() || false);}
}, Set());

var images_stream = Transform({ objectMode: true });

var configs = [];
images_stream._transform = function(file_or_config, encoding, done) {
    if(file_or_config.type() == 'File') {
        var image = new Image(file_or_config.value());
        images_set.add(image);
    } else {
        configs.push(file_or_config.value());
    }
    done();
}

images_stream._flush = function(done) {
    while(configs.length > 0) {
        var config = configs.pop();
        var image = images_set.getByPath(config.path);
        if(image) {
            image.update(config);
        }
    }
    images_stream.push(images_set);
    done();
};

module.exports = images_stream;