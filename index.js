var fs = require('fs');
var _ = require('underscore');
var when = require('when');
//var images = require('./datastructures/extended/images');
//var styles = require('./datastructures/extended/styles');
//var instances = require('./datastructures/extended/instances');
//var instance = require('./datastructures/core/tuple');
//
var config = __dirname + '/config'
var images_source_dir = __dirname + '/images/source';
var images_target_dir = __dirname + '/images/target';

var image_configs_json = config + '/imageConfigs.json';
var style_configs_json = config + '/styleConfigs.json';
var style_types = require(config + '/styleTypes');


var Writable = require('stream').Writable;
var logger = Writable({ objectMode: true });
logger._write = function(set_or_item, encoding, next) {
    console.log(set_or_item.type() + ' >> ' + JSON.stringify(set_or_item.image().value()) +' << >> ' +JSON.stringify(set_or_item.style().value()) + ' <<');
    //set_or_item.each(function(o) {console.log(JSON.stringify(o.value()));})
    next();
}
logger.on('pipe', function(){console.log('=== start ===');});
logger.on('finish', function(){console.log('=== end ===');});

var CombinedStream = require('combined-stream');
var image_files = require('./streams/readable/imageFiles');
var image_configs = require('./streams/readable/imageConfigs');
var image_files_and_configs2images = require('./streams/transform/FilesAndConfigs2Images');

var image_files_and_configs = CombinedStream.create();
image_files_and_configs.append(image_files(images_source_dir).createReadStream());
image_files_and_configs.append(image_configs(image_configs_json).createReadStream());

var images = image_files_and_configs.pipe(image_files_and_configs2images)
var styles = require('./streams/readable/styles')(style_configs_json, style_types).createReadStream();

var images_and_styles = CombinedStream.create();
images_and_styles.append(images);
images_and_styles.append(styles);

var images_and_styles2instances = require('./streams/transform/ImagesAndStyles2Instances');
images_and_styles.pipe(images_and_styles2instances).pipe(logger);