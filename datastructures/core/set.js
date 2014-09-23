var Item = require('./item');
var Tuple = require('./tuple');

var Set = function(ExtendedItem, CartesianTuple, CartesianSet) {

    var i = ExtendedItem || Item;
    var t = CartesianTuple || Tuple;
    var s = CartesianSet || Set;

    var a = [];

    var api = {
        contains:function(item) {
            for(var index = 0; index < a.length; index++) {
                if(a[index].eq(item)) {return true;}
            }
            return false;
        },
        add:function(item) {
            if(!api.contains(item)) {a.push(item);}
            return item;
        },
        addRaw:function(value) {api.add(i(value));},
        cartesianProduct:function(s2) {
            var cp = s();
            api.each(function(i1){
                s2.each(function(i2){
                    cp.add(t(i1, i2));
                });
            });
            return cp;
        },
        each:function(iterator) {
            for(var index = 0; index < a.length; index++) {
                iterator(a[index], index);
            }
        }
    };
    return api;
};

module.exports = Set;