var Item = require(global.moduleRoot + '/datastructures/item');

var Style = function(styleProperties) {
    var item = Item(styleProperties);
    item.type = function(){return 'Style';};
    item.eq = function(image) {return (item.value().name == image.value().name || false)};
    return item;
};

module.exports = Style;