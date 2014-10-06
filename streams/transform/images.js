var Writable = require('stream').Readable;
var Transform = require('stream').Transform;
var Image = require(global.module_root + '/datastructures/Image')

module.exports = function(imagePropertiesReadable) {
    var filenamesBuffer = {};
    var imagePropertiesBuffer = {};
    var isDoneFilenameStream = false;
    var isDoneImagePropertiesStream = false;
    var isDoneBoth = function() {return (isDoneFilenameStream && isDoneImagePropertiesStream);}
    var pushRemainingFiles = function() {
        for (var path in filenamesBuffer) {
            if (filenamesBuffer.hasOwnProperty(path)) {
                combined.push(Image(filenamesBuffer[path]));
            }
        }
    }

    var combined = new Transform({objectMode: true });
    combined._read = function(){};

    combined._write = function(filename, enc, next) {
        var imageProperties = imagePropertiesBuffer[filename];
        if(!imageProperties) {
            filenamesBuffer[filename] = {path:filename};
        } else {
            combined.push(Image(imageProperties));
            delete imagePropertiesBuffer[filename];
        }
        next();
    }

    combined._flush = function() {
        isDoneFilenameStream = true;
        if(isDoneBoth()) {
            pushRemainingFiles();
            combined.push(null)
        }
    }

    var imagePropertiesTransform = new Transform({objectMode: true });
    imagePropertiesTransform._write = function(imageProperties, enc, next) {
        var image = filenamesBuffer[imageProperties.path];
        if(!image) {
            imagePropertiesBuffer[imageProperties.path] = imageProperties;
        } else {
            combined.push(Image(imageProperties));
            delete filenamesBuffer[imageProperties.path];
        }
        next();
    }

    imagePropertiesTransform._flush = function() {
        isDoneImagePropertiesStream = true;
        if(isDoneBoth()) {
            pushRemainingFiles();
            combined.push(null)
        }
    }

    imagePropertiesReadable.pipe(imagePropertiesTransform);

    return combined;
}