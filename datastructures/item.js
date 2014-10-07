var Item = function(value) {
    var api = {
        type:function(){return 'Item';},
        value:function(v) {return value;},
        eq:function(item) {return (api.value() == item.value());}
    }
    return api;
};
module.exports = Item;