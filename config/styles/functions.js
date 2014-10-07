var gm = require('gm');
var path = require('path');
var _ = require('underscore');

function hasFocalPointDefined(imageProperties) {
    return ((
        _.has(imageProperties, 'x')
        && _.has(imageProperties, 'y')
        && _.isNumber(imageProperties.x)
        && _.isNumber(imageProperties.y)
    ) || false)
}

module.exports = {
    cover:function(sourceImagePath, targetImagePath, imageProperties, styleProperties, callback) {
        var sourceImg = gm(sourceImagePath);
        sourceImg.size(function(err, source) {
            if(err) {return callback(err);}
            var cropped  = {width:parseInt(styleProperties.width, 10),height:parseInt(styleProperties.height, 10)};
            var factor = Math.max((cropped.width/source.width), (cropped.height/source.height));
            var scaled = {width:Math.round(factor * source.width), height:Math.round(factor * source.height)};

            var focalPoint = {x:Math.round(source.width/2), y:Math.round(source.height/2)};
            if(hasFocalPointDefined(imageProperties)) {
                focalPoint.x = parseInt(imageProperties.x, 10);
                focalPoint.y = parseInt(imageProperties.y, 10);
            }

            var resizedCenter = {x:(factor * focalPoint.x), y:(factor * focalPoint.y)};
            var croppedOffset = {x:Math.round(resizedCenter.x - (cropped.width / 2)), y:Math.round(resizedCenter.y - (cropped.height / 2))};
            if(croppedOffset.x < 0) {croppedOffset.x = 0;}
            if(croppedOffset.y < 0) {croppedOffset.y = 0;}
            if(croppedOffset.x + cropped.width > scaled.width) {
                var tooMuch =  (croppedOffset.x + cropped.width) - scaled.width;
                croppedOffset.x -= tooMuch;
            }
            if(croppedOffset.y + cropped.height > scaled.height) {
                var tooMuch =  (croppedOffset.y + cropped.height) - scaled.height;
                croppedOffset.y -= tooMuch;
            }

            sourceImg.resize(scaled.width, scaled.height,'!');
            sourceImg.crop(cropped.width, cropped.height, croppedOffset.x, croppedOffset.y);
            sourceImg.write(targetImagePath, function(err) {
                if(err) {return callback(err);}
                callback(null);
            });
        });
    }
}