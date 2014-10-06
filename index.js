global.module_root = __dirname;

var config = __dirname + '/config'
var imagesSourceDirectory = __dirname + '/images/source';
var imagesTargetDirectory = __dirname + '/images/target';

var imagePropertiesFile = config + '/images/properties.json';
var stylePropertiesFile = config + '/styles/properties.json';
var styleFunctions = require(config + '/styles/functions');

var Images = require(global.module_root + '/streams/transform/images');
var Styles = require(global.module_root + '/streams/transform/styles');
var ImageProperties = require('./streams/read/imageProperties');
var StyleProperties = require('./streams/read/styleProperties');
var Filenames = require(global.module_root + '/streams/read/filenames');

var logger = require(global.module_root + '/streams/write/logger');

var filenames = Filenames(imagesSourceDirectory);
var imageProperties = ImageProperties(imagePropertiesFile);
var styleProperties = StyleProperties(stylePropertiesFile);

var images = Images(imageProperties);
var styles = Styles(styleProperties, styleFunctions);

filenames.pipe(images).pipe(styles).pipe(logger);