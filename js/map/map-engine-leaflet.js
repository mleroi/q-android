/**
 * Leaflet map management and interactions with DOM
 */
define(function (require) {

    "use strict";

    var Backbone = require('backbone');
    var _ = require('underscore');
    var Config = require( 'root/config' );
    var $ = require( 'jquery' );
    var L = require( 'theme/leaflet/leaflet' );
    var MapModel = require( 'theme/js/map/map-model' );

    return Backbone.Model.extend({

        defaults: {
            id : "",
            default_data: {},
            map_data: null,
            map_leaflet: null,
        },

        /**
         * Backbone model initialization
         */
        initialize: function() {
            //Bind callback methods to this:
            _.bindAll( this, 'update', 'saveCurrentData' );
        },

        /**
         * Initialize map data and leaflet map
         */
        initMap: function () {
            if ( !this.isMapActive() && $('#'+this.get('id')).length ) {

                //Instanciate new map model:
                this.set('map_data', new MapModel( _.extend( { id:this.get('id') }, this.get('default_data') ) ) );

                //Fetch memorized map data (position, zoom etc):
                this.get('map_data').fetch();

                //Clear all previous map instances:
                this.remove();

                //Initialize Leaflet map:
                var center = [this.get('map_data').get('center').lat, this.get('map_data').get('center').lng];
                this.set('map_leaflet', L.map( this.get('id') ).setView( center, this.get('map_data').get('zoom') ) );
                L.tileLayer( 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    zoom: this.get('map_data').get('zoom'),
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                } ).addTo( this.get('map_leaflet') );

                //Memorize map position and zoom when zooming, moving and leaving the map:
                this.get('map_leaflet').on( 'zoomend', this.saveCurrentData );
                this.get('map_leaflet').on( 'moveend', this.saveCurrentData );
                this.get('map_leaflet').on( 'unload', this.saveCurrentData );
            }
        },

        /**
         * Update Leaflet map with current map data (position, zoom etc)
         */
        update: function () {

            if ( !this.isMapActive() ) {
                this.initMap();
            }

            var newLatLng = new L.LatLng( this.get('map_data').get('center').lat, this.get('map_data').get('center').lng );
            this.get('map_leaflet').panTo( newLatLng );
            this.get('map_leaflet').setZoom( this.get('map_data').get('zoom') );

        },

        /**
         * Remove Leaflet map and empty map element
         */
        remove: function() {

            var $map = $('#'+this.get('id'));
            if ( $map.length && $map.html().length ) {
                this.get('map_leaflet').remove();
                $map.html('');
            }

            this.set('map_leaflet', null);
        },

        /**
         * Save current map data into local storage
         */
        saveCurrentData: function() {
            var current_center = this.get('map_leaflet').getCenter();
            this.get('map_data').set('center',{ lat: current_center.lat, lng: current_center.lng });
            this.get('map_data').set('zoom', this.get('map_leaflet').getZoom());
            this.get('map_data').save();
        },

        /**
         * Check if the map is currently active
         */
        isMapActive: function() {
            var $map = $('#'+this.get('id'));
            return this.get('map_leaflet') !== null && $map.length && $map.html().length;
        }
    });

});
