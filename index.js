var _ = require('underscore');
var when = require('when');
var images = require('./datastructures/extended/images');
var styles = require('./datastructures/extended/styles');
var instances = require('./datastructures/extended/instances');
var instance = require('./datastructures/core/tuple');

var images_dir = __dirname + '/defaults/source';
var styles_dir = __dirname + '/defaults/target';

when.all([images(images_dir).read(), styles(styles_dir).read()]).then(function(images_and_styles) {
    images_and_styles[0].cartesianProduct(images_and_styles[1]).each(function(instance) {
        console.log(instance.image().value(), instance.style().value());
    });
});