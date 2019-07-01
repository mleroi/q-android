/**
 * Map model used to memorize map current data into local storage
 */
define(function (require) {

    "use strict";

    var Backbone = require('backbone');
    var Config = require( 'root/config' );
    require('localstorage');

    var MapModel = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage( "Map-" + Config.app_slug ),
        defaults: {
            id : "",
            center: { lat: 45.7640, lng: 4.8357 },
            zoom: 13
        }
    });

    return MapModel;
});
