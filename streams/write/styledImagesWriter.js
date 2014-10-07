var path = require('path');
var fs = require('fs');
var Writable = require('stream').Writable;
var mkdirp = require('mkdirp');

var errorCallback = function(err){
    if(err) {
        var d = new Date();
        console.log(d.toLocaleTimeString() + ' ' + err);
    }
}

module.exports = function() {

    var styledImages = Writable({ objectMode: true });
    styledImages._write = function(styledImage, encoding, next) {
        var image = styledImage.image().value();
        var style = styledImage.style().value();
        var sourceImageFilename = image.path.toString();
        var regexp = new RegExp('^' + global.imagesSourceDirectory);
        var targetImageFilename = path.join(global.imagesTargetDirectory, style.name, sourceImageFilename.replace(regexp, ''));
        var targetImagePath = targetImageFilename.replace(new RegExp(path.basename(targetImageFilename) + '$'), '');
        mkdirp(targetImagePath, function(err) {
            if(err) {console.log(err);}
            fs.unlink(targetImageFilename, function(err) {
                // errno 34 means trying to unlink non existent file
                if(err && err.errno!=34) {throw err;}
                style.function.apply(style.function, [sourceImageFilename, targetImageFilename, image, style, errorCallback]);
            });
        });
        next();
    }

    styledImages.on('pipe', function(){});
    styledImages.on('finish', function(){});

    return styledImages;

}