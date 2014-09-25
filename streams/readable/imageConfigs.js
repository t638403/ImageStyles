var fs = require('fs');
var Transform = require('stream').Transform;

var JSONStream = require('JSONStream');
var Config = require('../../datastructures/extended/config');

var json2image = Transform({ objectMode: true });
json2image._transform = function(json, encoding, done) {
    var image = Config(json);
    json2image.push(image);
    done();
}

module.exports = function(config_file) {
    var parser = JSONStream.parse('.*')
    return {
        createReadStream:function(){
            return fs.createReadStream(config_file).pipe(parser).pipe(json2image);
        }
    }
}