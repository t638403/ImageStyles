var Tuple = require(global.moduleRoot + '/datastructures/tuple');
var StyledImage = function (image, style) {
    var tuple = Tuple(image, style);
    tuple.type = function(){return 'StyledImage';};
    tuple.image = function(){
        return (tuple.first().type() == 'Image')?tuple.first():tuple.second();
    }
    tuple.style = function(){
        return (tuple.first().type() == 'Style')?tuple.first():tuple.second();
    }
    tuple.eq = function(styledImage) {
        return ( (tuple.image().eq(styledImage.image()) && tuple.style().eq(styledImage.style())) || false );
    }

    return tuple;
};

module.exports = StyledImage;