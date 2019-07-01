/**
 * Plug map logic into the app.
 * (Require this map-run.js file in functions.js)
 */
define([
    'jquery',
    'core/theme-app',
    'theme/js/map/map-engine-leaflet'
    ], function($,App,Map) {

        //Initialize leaflet map object with default values
        var MyMap = new Map({
            id:"map",
            default_data: {
                center: { lat: 45.7640, lng: 4.8357 },
                zoom: 6
            }
        });

        //Create a custom screen for our map, with id "map" and template "map.html":
        App.addCustomRoute( 'map', 'map' );

        //Display our map when map screen is showed:
        App.on( 'screen:showed', function( current_screen ) {

            if ( current_screen.item_id === 'map' ) {
                MyMap.update();
            }

        });

        //Unload the map when we leave the map screen:
        App.on( 'screen:leave', function ( current_screen, queried_screen  ) {

            if ( current_screen.item_id === 'map' ) {
                MyMap.remove();
            }

        } );

});
