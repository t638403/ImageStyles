var Transform = require('stream').Transform;
var AsyncRecursiveDirectoryReadable = require('./AsyncRecursiveDirectoryReadable');
var File = require('../../datastructures/extended/file');

var str2file = Transform({ objectMode: true });
str2file._transform = function(chunk, encoding, done) {
    var file = File({path:chunk.toString()});
    str2file.push(file);
    done();
}

module.exports = function(images_dir) {
    return {
        createReadStream:function() {
            var image_paths = new AsyncRecursiveDirectoryReadable(images_dir);
            return image_paths.pipe(str2file);
        }
    }
}