var _ = require('underscore');
var when = require('when');
var Set = require('./../core/set');
var Image = require('./image');
var Instance = require('./instance');
var Instances = require('./instances');

var Images = function(source_dir) {
    var api = _.extend({
        read:function(){
            return when.promise(function(resolve, reject, notify){
                _.each(['a','b','c'], function(letter) {
                    api.add(Image(letter));
                });
                resolve(api);
            });
        },
        sourceDir:function(){return source_dir;}
    }, Set(Image, Instance, Instances));
    return api;
};

module.exports = Images;