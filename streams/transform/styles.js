var Writable = require('stream').Readable;
var Transform = require('stream').Transform;
var Set = require(global.module_root + '/datastructures/set');
var Style = require(global.module_root + '/datastructures/style');
var StyledImage = require(global.module_root + '/datastructures/styledImage');

module.exports = function(stylePropertiesReadable, styleFunctions) {
    var images = Set()
    var styles = Set();
    var styleImages = function() {
        images.cartesianProduct(styles, StyledImage).each(function(styledImage) {
            styledImages.push(styledImage);
        });
    }

    var isDoneImageStream = false;
    var isDoneStylePropertiesStream = false;
    var isDoneBoth = function() {return (isDoneImageStream && isDoneStylePropertiesStream);}

    var styledImages = new Transform({objectMode: true });
    styledImages._read = function(){};

    styledImages._write = function(image, enc, next) {
        images.add(image);
        next();
    }
    styledImages._flush = function() {
        isDoneImageStream = true;
        if(isDoneBoth()) {
            styleImages();
            styledImages.push(null)
        }
    }

    var stylePropertiesTransform = new Transform({objectMode: true });
    stylePropertiesTransform._write = function(styleProperties, enc, next) {
        styleProperties.function = styleFunctions[styleProperties.function];
        styles.add(Style(styleProperties))
        next();
    }

    stylePropertiesTransform._flush = function() {
        isDoneStylePropertiesStream = true;
        if(isDoneBoth()) {
            styleImages();
            styledImages.push(null)
        }
    }

    stylePropertiesReadable.pipe(stylePropertiesTransform);

    return styledImages;
}