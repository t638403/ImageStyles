var fs = require('fs');
var Transform = require('stream').Transform;

var JSONStream = require('JSONStream');
var Style = require('../../datastructures/extended/style');
var Set = require('../../datastructures/core/set');

module.exports = function(config_file, types) {

    var parser = JSONStream.parse('.*')
    var styles = Set();

    var json2styles = Transform({ objectMode: true });
    json2styles._transform = function(json, encoding, done) {
        var style = Style(json);
        style.apply = types[json.type];
        styles.add(style);
        done();
    }

    json2styles._flush = function(done) {
        json2styles.push(styles);
        done();
    };

    return {
        createReadStream:function(){
            return fs.createReadStream(config_file).pipe(parser).pipe(json2styles);
        }
    }
}