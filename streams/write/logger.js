var Writable = require('stream').Writable;
var logger = Writable({ objectMode: true });
logger._write = function(obj, encoding, next) {
    console.log('- ' + obj.image().value().path + ' + ' + obj.style().value().name);
    next();
}
logger.on('pipe', function(){console.log('=== start ===');});
logger.on('finish', function(){console.log('=== end ===');});

module.exports = logger;