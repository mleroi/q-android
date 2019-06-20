/**
 * Social sharing feature
 */
define([
    'jquery',
    'core/theme-app',
    ], function($,App) {

    App.on( 'screen:showed',function( current_screen,view ){

        var currentScreenObject = App.getCurrentScreenObject();

        if (current_screen.screen_type == "single") {

           $( '#share-button' ).attr( 'data-url', currentScreenObject.permalink );
           $( '#share-button' ).attr( 'data-title', currentScreenObject.title );
           $( '#share-button' ).attr( 'data-thumbnail', currentScreenObject.thumbnail && currentScreenObject.thumbnail.src ? currentScreenObject.thumbnail.src : '' );

        }

    });

    App.on('screen:leave',function( current_screen,queried_screen,view ){

        if (current_screen.screen_type === 'single') {
            // Unset data necessary for sharing (useful if the share button is outside of post content: in top nav bar for example)
            $( '#share-button' ).attr( 'data-url', '' ).attr( 'data-title', '' ).attr( 'data-thumbnail', '' );
        }

    });

    function shareButtonTapOff( e ) {

        e.preventDefault();

        // Get data to be shared

        var shareUrl = null;
        if ( $( this ).attr( 'data-url' ) != '' ) {
            shareUrl = $( this ).attr( 'data-url' );
        }

        var shareMessage = "I've just discovered a great article and I think it may interest you.";

        var shareSubject = null;
        if ( $( this ).attr( 'data-title' ) != '' ) {
            shareSubject = $( this ).attr( 'data-title' );
        }

        var shareThumbnail = null;
        if ( $( this ).attr( 'data-thumbnail' ) != '' ) {
            shareThumbnail = $( this ).attr( 'data-thumbnail' );
        }

        // Launch OS sharing center (and check if the necessary Phonegap plugin is available - https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin/)
        try {

            window.plugins.socialsharing.share(
                shareMessage, // Message
                shareSubject, // Subject
                shareThumbnail, // Image
                shareUrl, // Link
                function( result ) { /*alert( 'Success' );*/ }, // Success feedback
                function( result ) { /*alert( 'Failed' );*/ }  // Error feedback
            );

        } catch( err ) {
            console.log( "Sharing plugin is not available - you're probably in the browser" );
        }

    }

    $( "#app-layout" ).on( "touchend", "#share-button", shareButtonTapOff );

});
