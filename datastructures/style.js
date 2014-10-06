var _ = require('underscore');
var Item = require(global.module_root + '/datastructures/item');
var Style = function(properties) {
    return _.extend({
        type:function(){return 'Style';},
        apply:properties.function
    }, Item(properties));
};
module.exports = Style;