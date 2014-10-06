var _ = require('underscore');
var Item = require(global.module_root + '/datastructures/item');

var Style = function(styleProperties) {
    var item = Item(styleProperties);
    item.type = function(){return 'Style';};
    item.eq = function(image) {return (item.value().name == image.value().name || false)};
    item.apply = styleProperties.function
    return item;
};

module.exports = Style;