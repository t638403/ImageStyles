var fs = require('fs');
var JSONStream = require('JSONStream');

module.exports = function(imagePropertiesFile){
    return fs.createReadStream(imagePropertiesFile).pipe(JSONStream.parse('.*'));
}