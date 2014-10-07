global.moduleRoot = __dirname;
var defaultConfigurationDirectory = __dirname + '/config';

module.exports = function(settings) {

    if(!settings || !settings.sourceDir || !settings.targetDir){
        throw 'Source and target directory are mandatory';
    }
    // Set image directories (mandatory)
    global.imagesSourceDirectory = settings.sourceDir;
    global.imagesTargetDirectory = settings.targetDir;

    // Set configuration files
    var imagePropertiesFile = settings.imagePropertiesFile || defaultConfigurationDirectory + '/images/properties.json';
    var stylePropertiesFile = settings.stylePropertiesFile || defaultConfigurationDirectory + '/styles/properties.json';
    var styleFunctionsFile = settings.styleFunctionsFile || defaultConfigurationDirectory + '/styles/functions';
    var styleFunctions = require(styleFunctionsFile);

    // Set Readable stream files
    var imageProperties = settings.ImageProperties || require('./streams/read/imageProperties')(imagePropertiesFile);
    var styleProperties = settings.StyleProperties || require('./streams/read/styleProperties')(stylePropertiesFile);
    var defaultFilenamesReadable = settings.filenames || require(global.moduleRoot + '/streams/read/filenames')(global.imagesSourceDirectory);

    // Load Transform stream files
    var images = require(global.moduleRoot + '/streams/transform/images')(imageProperties);
    var styledImages = require(global.moduleRoot + '/streams/transform/styledImages')(styleProperties, styleFunctions);

    // Load Writable stream file
    var styledImagesWriter = require(global.moduleRoot + '/streams/write/styledImagesWriter')();

    return {
        run:function(filenamesReadable) {
            if(!filenamesReadable) {
                filenamesReadable = defaultFilenamesReadable;
            }
            filenamesReadable.pipe(images).pipe(styledImages).pipe(styledImagesWriter);
        },
        clean:function() {
            // Check target dir for inconsistencies and remove garbage.
            defaultFilenamesReadable.pipe(styledImages).pipe(process.stdout);
        }
    }

}