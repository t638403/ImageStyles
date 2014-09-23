var _ = require('underscore');
var Item = require('../core/item');
var Image = function(value) {
    return _.extend({
        type:function(){return 'Image';}
    }, Item(value));
};
module.exports = Image;