var _ = require('underscore');
var Item = require(global.module_root + '/datastructures/item');

var Image = function(imageProperties) {
    var item = Item(imageProperties);
    item.type = function(){return 'Image';};
    item.eq = function(image) {return ( item.value().path == image.value().path || false );};
    return item;
};

module.exports = Image;