var _ = require('underscore');
var Item = require(global.module_root + '/datastructures/item');
var Image = function(obj) {
    if(!_.isObject(obj)) {throw 'Item must be an object';}
    var api = _.extend({
        type:function(){return 'Image';},
        path:function(path) {
            if(!_.isUndefined(path) && _.isString(path)) {
                obj.path = path;
                return api;
            }
            return obj.path;
        },
        hasFocus:function() {return _.has(obj, 'focus') && _.has(obj.focus, 'x') && _has(obj.focus, 'y');},
        focus:function(focus) {
            if(!_.isUndefined(focus) && _.osObject(focus) && _.has(focus, 'x') && _has(focus, 'y')) {
                obj.focus = focus;
                return api;
            }
            return obj.focus;
        },
        update:function(o) {
            api.value(_.extend(api.value(),o));
        }
    }, Item(obj), {
        eq:function(image) {return (api.value().path == image.value().path || false)}
    });
    return api;
};
module.exports = Image;