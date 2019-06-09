define(function (require) {

    "use strict";

    var Backbone = require('backbone');
    var Config = require( 'root/config' );
    var $ = require( 'jquery' );
    var L = require( 'theme/leaflet/leaflet' );
    //require('localstorage');

    return Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage( 'Map-' + Config.app_slug  ),

        defaults: {
            id : "",
            map: null,
            center: { lat: 45.7640, lng: 4.8357 },
        },

        init: function () {
            if ( !this.is_map_active() && $('#'+this.get('id')).length ) {

                //Clear all previous map instances:
                this.remove();

                var center = [this.get('center').lat, this.get('center').lng];
                this.set('map', L.map( this.get('id') ).setView( center, 13 ) );
                L.tileLayer( 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                } ).addTo( this.get('map') );
                //this.marker = L.marker( center ).addTo( this.get('map') );

                var _this = this;
                this.get('map').on('unload', function(e){
                    var current_center = _this.get('map').getCenter();
                    _this.set('center',{ lat: current_center.lat, lng: current_center.lng })
                    console.log('Unload!',_this.get('center'));
                });
            }
        },

        update: function () {

            if ( !this.is_map_active() ) {
                this.init();
            }

            var newLatLng = new L.LatLng( this.get('center').lat, this.get('center').lng );
            this.get('map').panTo( newLatLng );
            //this.marker.setLatLng( newLatLng );
        },

        remove: function() {

            var $map = $('#'+this.get('id'));
            if ( $map.length && $map.html().length ) {
                this.get('map').remove();
                $map.html('');
            }

            this.set('map', null);
            //this.marker = null;
        },

        is_map_active: function() {
            var $map = $('#'+this.get('id'));
            return this.get('map') !== null && $map.length && $map.html().length;
        }
    });

});
