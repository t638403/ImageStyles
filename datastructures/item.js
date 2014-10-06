var _ = require('underscore');
var Item = function(value) {
    var api = {
        type:function(){return 'Item';},
        value:function(v) {
            if(!_.isUndefined()) {value = v; return api;}
            return value;
        },
        eq:function(item) {return (api.value() == item.value());}
    }
    return api;
};
module.exports = Item;