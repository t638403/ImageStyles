var _ = require('underscore');
var Item = require('../core/item');
var Config = function(obj) {
    if(!_.isObject(obj)) {throw 'Item must be an object';}
    var api = _.extend({
        type:function(){return 'Config';},
        path:function(path) {
            if(!_.isUndefined(path) && _.isString(path)) {
                obj.path = path;
                return api;
            }
            return obj.path;
        },
        update:function(o) {
            api.value(_.extend(api.value(),o));
        }
    }, Item(obj), {
        eq:function(image) {return (api.value().path == image.value().path || false)}
    });
    return api;
};
module.exports = Config;