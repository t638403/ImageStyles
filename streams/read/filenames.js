var fs = require('fs');
var Readable = require('stream').Readable;
var util = require('util');

util.inherits(Filenames, Readable);

function Filenames(dir, opt) {
    Readable.call(this, opt);
    var that = this;
    this.pending = 0;
    this.dirs = [dir];

    this.hasDirsToExplore = function() {return (that.dirs.length > 0 || false);};
    this.getDir = function() {return that.dirs.pop();};
    this.addDir = function(dir) {return that.dirs.push(dir);};

    this.done = function(err) {
        if(err) {throw err;}
        if(!--that.pending) {
            that.push(null);
        } else if(that.hasDirsToExplore()) {
            var dir = that.getDir();
            that.scandir(dir);
        }
    }

    this.scandir = function(dir) {
        that.pending++;
        fs.readdir(dir, function(err, list) {
            if (err) return that.done(err);
            that.pending +=  list.length;
            list.forEach(function(file_or_dir, index) {
                file_or_dir = dir + '/' + file_or_dir;
                fs.stat(file_or_dir, function(err, stat) {
                    if (err) return that.done(err);
                    if (stat && stat.isDirectory()) {
                        that.addDir(file_or_dir);
                    } else {
                        that.push(file_or_dir);
                    }
                    that.done(null);
                });
            });
            that.pending--;
        });
    }
}

Filenames.prototype._read = function() {
    var that = this;
    if(that.hasDirsToExplore()) {
        var dir = that.getDir();
        that.scandir(dir);
    }
};

module.exports = function(dir) {return new Filenames(dir);}