var _ = require('underscore');
var Tuple = require('../core/tuple');
var Instance = function (i1, i2) {
    var api = _.extend({
        type:function(){return 'Instance';},
        image:function(){
            return (api.first().type() == 'Image')?api.first():api.second();
        },
        style:function(){
            return (api.first().type() == 'Style')?api.first():api.second();
        }
    }, Tuple(i1, i2));

    return api;
};

module.exports = Instance;