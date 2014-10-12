var fs = require('fs');
var path = require('path');

var FileIterator = function(sourceDir) {
    var dirs = [sourceDir];
    var files = [];
    var hasFiles = function() {return (files.length > 0 || false);}
    var hasDirs = function() {return (dirs.length > 0 || false);}
    var explore = function(dir, exporationIsDone) {
        fs.readdir(dir, function(err, list) {
            if(err) {return exporationIsDone(err);}
            var items = list.length;
            list.forEach(function(file_or_dir, index) {
                file_or_dir = path.join(dir, file_or_dir);
                fs.stat(file_or_dir, function(err, stat) {
                    if(err) {return exporationIsDone(err);}
                    if (stat && stat.isDirectory()) {
                        dirs.push(file_or_dir);
                    } else {
                        files.push(file_or_dir);
                    }
                    if(!--items) {
                        exporationIsDone();
                    }
                });
            });
        });
    }

    var api = {
        hasNext:function(hasNext) {
            if(hasFiles()) {
                hasNext(null, true);
            } else if(hasDirs()) {
                explore(dirs.pop(), function(err){
                    if(err) {return hasNext(err);}
                    api.hasNext(hasNext);
                });
            } else {
                hasNext(null, false);
            }
        },
        next:function(returnFile) {
            api.hasNext(function(err, hasNext) {
                if(err) {return returnFile(err);}
                if(hasNext) {
                    returnFile(null, files.pop());
                } else {
                    returnFile(null, null);
                }
            });
        },
        each:function(iterator) {
            api.next(function(err, next) {
                if(next) {
                    iterator(next);
                    api.each(iterator);
                }
            });
        }
    }
    return api;
}

module.exports = FileIterator;