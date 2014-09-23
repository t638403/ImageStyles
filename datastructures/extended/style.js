var _ = require('underscore');
var Item = require('../core/item');
var Style = function(value) {
    return _.extend({
        type:function(){return 'Style';}
    }, Item(value));
};
module.exports = Style;