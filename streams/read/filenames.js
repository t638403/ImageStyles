var Readable = require('stream').Readable;
var FileIterator = require(global.moduleRoot + '/datastructures/FileIterator');

module.exports = function(dir) {
    var fileIterator = FileIterator(dir);
    var filenames = new Readable();
    filenames._read = function() {
        fileIterator.next(function(err, nextFile) {
            if(err) {throw err;}
            filenames.push(nextFile)
        });
    }
    return filenames;
}