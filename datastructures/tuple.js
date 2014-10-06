var Tuple = function(i1, i2) {
    var api = {
        first:function(){return i1;},
        second:function(){return i2;},
        eq:function(tuple) {
            return (i1.eq(tuple.first()) && i2.eq(tuple.second()));
        }
    }
    return api;
}

module.exports = Tuple;