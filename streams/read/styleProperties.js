var fs = require('fs');
var JSONStream = require('JSONStream');


module.exports = function(stylePropertiesFile){
    return fs.createReadStream(stylePropertiesFile).pipe(JSONStream.parse('.*'));
}