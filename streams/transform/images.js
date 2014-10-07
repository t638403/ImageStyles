var path = require('path');
var Writable = require('stream').Readable;
var Transform = require('stream').Transform;
var Image = require(global.moduleRoot + '/datastructures/Image')

module.exports = function(imagePropertiesReadable) {
    var filenamesBuffer = {};
    var imagePropertiesBuffer = {};
    var isDoneFilenameStream = false;
    var isDoneImagePropertiesStream = false;
    var isDoneBoth = function() {return (isDoneFilenameStream && isDoneImagePropertiesStream);}
    var pushRemainingFiles = function() {
        for (var path in filenamesBuffer) {
            if (filenamesBuffer.hasOwnProperty(path)) {
                // TODO Somehow, these filenamesBuffer[path] are Buffers in stead of strings
                images.push(Image(filenamesBuffer[path]));
            }
        }
    }

    var images = new Transform({objectMode: true });
    images._read = function(){};

    images._write = function(filename, enc, next) {
        var imageProperties = imagePropertiesBuffer[filename];
        if(!imageProperties) {
            filenamesBuffer[filename] = {path:filename};
        } else {
            images.push(Image(imageProperties));
            delete imagePropertiesBuffer[filename];
        }
        next();
    }

    images._flush = function() {
        isDoneFilenameStream = true;
        if(isDoneBoth()) {
            pushRemainingFiles();
            images.push(null)
        }
    }

    var imagePropertiesTransform = new Transform({objectMode: true });
    imagePropertiesTransform._write = function(imageProperties, enc, next) {
        var image = filenamesBuffer[imageProperties.path];
        if(!image) {
            imagePropertiesBuffer[imageProperties.path] = imageProperties;
        } else {
            images.push(Image(imageProperties));
            delete filenamesBuffer[imageProperties.path];
        }
        next();
    }

    imagePropertiesTransform._flush = function() {
        isDoneImagePropertiesStream = true;
        if(isDoneBoth()) {
            pushRemainingFiles();
            images.push(null)
        }
    }

    imagePropertiesReadable.pipe(imagePropertiesTransform);

    return images;
}