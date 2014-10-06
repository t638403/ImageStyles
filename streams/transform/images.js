var Writable = require('stream').Readable;
var Transform = require('stream').Transform;
var Image = require(global.module_root + '/datastructures/Image')

module.exports = function(imagePropertiesReadable) {
    var filenamesBuffer = {};
    var imagePropertiesBuffer = {};
    var isDoneFilenameStream = false;
    var isDoneImagePropertiesStream = false;
    var isDoneBoth = function() {return (isDoneFilenameStream && isDoneImagePropertiesStream);}

    var combined = new Transform({objectMode: true });
    combined._read = function(){};

    combined._write = function(filename, enc, next) {
        var image = imagePropertiesBuffer[filename];
        if(!image) {
            filenamesBuffer[filename] = new Image({path:filename});
        } else {
            combined.push(image);
            delete imagePropertiesBuffer[filename];
        }
        next();
    }
    combined._flush = function() {
        isDoneFilenameStream = true;
        if(isDoneBoth()) {
            for (var path in filenamesBuffer) {
                if (filenamesBuffer.hasOwnProperty(path)) {
                    combined.push(filenamesBuffer[path]);
                }
            }
            combined.push(null)
        }
    }

    var imagePropertiesTransform = new Transform({objectMode: true });
    imagePropertiesTransform._write = function(imageProperties, enc, next) {
        var image = filenamesBuffer[imageProperties.path];
        if(!image) {
            imagePropertiesBuffer[imageProperties.path] = new Image(imageProperties);
        } else {
            image.update(imageProperties);
            combined.push(image);
            delete filenamesBuffer[imageProperties.path];
        }
        next();
    }

    imagePropertiesTransform._flush = function() {
        isDoneImagePropertiesStream = true;
        if(isDoneBoth()) {
            for (var path in filenamesBuffer) {
                if (filenamesBuffer.hasOwnProperty(path)) {
                    combined.push(filenamesBuffer[path]);
                }
            }
            combined.push(null)
        }
    }

    imagePropertiesReadable.pipe(imagePropertiesTransform);

    return combined;
}