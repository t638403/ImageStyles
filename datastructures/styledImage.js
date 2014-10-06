var _ = require('underscore');
var Tuple = require(global.module_root + '/datastructures/tuple');
var StyledImage = function (i1, i2) {
    var api = _.extend({
        type:function(){return 'StyledImage';},
        image:function(){
            console.log()
            return (api.first().type() == 'Image')?api.first():api.second();
        },
        style:function(){
            return (api.first().type() == 'Style')?api.first():api.second();
        }
    }, Tuple(i1, i2));

    return api;
};

module.exports = StyledImage;