define([
    'jquery',
    'core/theme-app',
    'theme/js/map/map-model'
    ], function($,App,MapModel) {

        var MyMap = new MapModel({
            id:"map",
            center: { lat: 45.7640, lng: 4.8357 }
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
