global.moduleRoot = __dirname;

var config = __dirname + '/config'
global.imagesSourceDirectory = __dirname + '/images/source';
global.imagesTargetDirectory = __dirname + '/images/target';

var imagePropertiesFile = config + '/images/properties.json';
var stylePropertiesFile = config + '/styles/properties.json';
var styleFunctions = require(config + '/styles/functions');

var Images = require(global.moduleRoot + '/streams/transform/images');
var StyledImages = require(global.moduleRoot + '/streams/transform/styledImages');
var ImageProperties = require('./streams/read/imageProperties');
var StyleProperties = require('./streams/read/styleProperties');
var Filenames = require(global.moduleRoot + '/streams/read/filenames');

var StyledImagesWriter = require(global.moduleRoot + '/streams/write/styledImagesWriter');

var filenames = Filenames(global.imagesSourceDirectory);
var imageProperties = ImageProperties(imagePropertiesFile);
var styleProperties = StyleProperties(stylePropertiesFile);

var images = Images(imageProperties);
var styledImages = StyledImages(styleProperties, styleFunctions);

var styledImagesWriter = StyledImagesWriter();

filenames.pipe(images).pipe(styledImages).pipe(styledImagesWriter);