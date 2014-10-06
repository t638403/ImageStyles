var _ = require('underscore');
var Tuple = require('./tuple');

var Set = function() {

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
        cartesianProduct:function(s2, CartesianTuple, CartesianSet) {
            var t = CartesianTuple || Tuple;
            var s = CartesianSet || Set;
            var cp = s();
            api.each(function(i1){
                s2.each(function(i2){
                    cp.add(t(i1, i2));
                });
            });
            return cp;
        },
        each:function(iterator) {_.each(a, iterator);}
    };
    return api;
};

module.exports = Set;