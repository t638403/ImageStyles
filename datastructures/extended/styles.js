var _ = require('underscore');
var when = require('when');
var Set = require('./../core/set');
var Style = require('./style');
var Instance = require('./instance');
var Instances = require('./instances');

var Styles = function(target_dir) {
    var api = _.extend({
        read:function(){
            return when.promise(function(resolve, reject, notify){
                _.each([1, 2, 3], function(digit) {
                    api.add(Style(digit));
                });
                resolve(api);
            });
        },
        getTargetDir:function(){return target_dir;}
    }, Set(Style, Instance, Instances));
    return api;
};

module.exports = Styles;