var rm = require('remove')
global.moduleRoot = __dirname;

var ImageStyles = function(settings) {

    if(!settings || !settings.sourceDir || !settings.targetDir){
        throw 'Source and target directory are mandatory';
    }
    // Set image directories (mandatory)
    global.imagesSourceDirectory = settings.sourceDir;
    global.imagesTargetDirectory = settings.targetDir;

    // Set configuration files
    var imagePropertiesFile = settings.imagePropertiesFile;
    var stylePropertiesFile = settings.stylePropertiesFile;
    var styleFunctionsFile = settings.styleFunctionsFile;
    var styleFunctions = require(styleFunctionsFile);

    // Set Readable stream files
    var imageProperties = settings.imageProperties || require('./streams/read/imageProperties')(imagePropertiesFile);
    var styleProperties = settings.styleProperties || require('./streams/read/styleProperties')(stylePropertiesFile);
    var filenamesReadable = settings.filenames || require(global.moduleRoot + '/streams/read/filenames')(global.imagesSourceDirectory);

    var api = {
        style:function(done) {
            // Load Transform stream files
            var images = require(global.moduleRoot + '/streams/transform/images')(imageProperties);
            var styledImages = require(global.moduleRoot + '/streams/transform/styledImages')(styleProperties, styleFunctions);

            // Load Writable stream file
            var styledImagesWriter = require(global.moduleRoot + '/streams/write/styledImagesWriter')();

            filenamesReadable.pipe(images).pipe(styledImages).pipe(styledImagesWriter);

            styledImagesWriter.on('finish', done);
        },
        clean:function(done) {
            // TODO implement
            // Check target dir for inconsistencies with source dir and remove garbage and/or apply missing styles
            done();
        },
        clear:function(done){
            rm(global.imagesTargetDirectory, done);
        },
        reset:function(done) {
            api.clear(function(){
                api.style(done);
            });
        }
    }
    return api;
}

module.exports = ImageStyles;