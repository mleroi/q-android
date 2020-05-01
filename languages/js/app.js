/**
 * App customizations for languages.
 * To require in theme's functions.js to activate languages features.
 * Also see [theme]/php/languages.php to see how to add languages data to WP-AppKit content webservice.
 */
define([
    'jquery',
    'core/app',
    'core/theme-app',
    'theme/languages/js/module', //Languages module
    ], function($,CoreApp,App,Languages) {

    //Create "languages-bome" screen that displays when the app starts for the first time
    //so that the user chooses his preferred language:
    App.addCustomRoute( 'languages-home', 'languages/templates/home' );

    //Create "languages-settings" screen where the user can change his language:
    App.addCustomRoute( 'languages-settings', 'languages/templates/settings' );

    //Add "languages-settings" screen to app's menu:
    //(Can also be done directly in menu.html template instead)
    App.filter( 'menu-items', function( menu_items, navigation ) {
        menu_items.push({'id': 'languages-settings', 'label': 'Language Settings', 'type': 'page', 'link': "#languages-settings" });
        return menu_items;
    } );

    //Force the "languages-home" screen to display until the user has chosen a language:
    App.filter( 'redirect', function( redirect, queried_screen, current_screen ) {

        var current_language = Languages.getCurrentLanguage('');
        console.log('redirect',current_language);

        //While current language is empty, redirect to "language-home" screen:
        if ( current_language == '' && queried_screen.item_id != 'languages-home') {
            //Note: we have to use CoreApp.router.navigate here instead of App.navigate here so that
            //redirection works even at very first app launch.
            CoreApp.router.navigate( '#languages-home', { trigger: true } );
            redirect = true;
        }

        return redirect;
    } );

    //Handle language choice form
    //(Form defined in languages/templates/home.html and languages/templates/settings.html templates):
    $( '#app-content-wrapper' ).on( 'submit', '#language-choice-form', function( e ) {
        e.preventDefault();
        //Get the languages chosen by the user and memorize it in app local storage:
        var chosen_language = $('#language-select').val();
        Languages.setCurrentLanguage(chosen_language);

        //Display a confirmation text (CUSTOMIZE THIS MESSAGE AS NEEDED):
        $('#language-choice-result').text("Thanks, enjoy app content in "+ Languages.getCurrentLanguageData('label') +"!");
    } );

    //Pass language data to all templates so that we can display languages related informations in templates.
    //Also replace posts content and titles by their translated version in currently chosen language (note that this could also
    //be done directly in templates, using post.translations[current_language].content instead of post.content in single,
    //page and archive templates).
    App.filter( 'template-args', function( template_args, view_type, view_template ) {
        var current_language = Languages.getCurrentLanguage();

        //Pass language data to templates (used especially in languages/templates/home.html and languages/templates/settings.html templates):
        template_args.available_languages = Languages.getAvailableLanguages();
        template_args.current_language = current_language;

        //Replace posts content and titles by translated versions in single, page and archive templates.
        //Each post has a "translations" field that is added directly into webservice post data in [app-theme]/php/languages.php.
        if ( current_language.length ) {
            if( view_template == 'single' || view_template == 'page' ) {
                template_args.post.content = template_args.post.translations[current_language].content;
                template_args.post.title = template_args.post.translations[current_language].title;
            } else if ( view_template == 'archive' ) {
                _.each( template_args.posts, function(post,key) {
                    template_args.posts[key].content = template_args.posts[key].translations[current_language].content;
                    template_args.posts[key].title = template_args.posts[key].translations[current_language].title;
                });
            }
        }
        return template_args;
    } );

});
