define([
    'jquery',
    'core/theme-app',
    'theme/js/map/map-engine-leaflet'
    ], function($,App,Map) {

        var MyMap = new Map({
            id:"map",
            default_data: {
                center: { lat: 45.7640, lng: 4.8357 },
                zoom: 6
            }
        });

        App.addCustomRoute( 'map', 'map' );

        App.on( 'screen:showed', function( current_screen ) {

            if ( current_screen.item_id === 'map' ) {
                $('#map').height( $('#map-screen').height() );
                MyMap.update();
            }

        });

        App.on( 'screen:leave', function ( current_screen, queried_screen  ) {

            if ( current_screen.item_id === 'map' ) {
                MyMap.remove();
            }

        } );

});
