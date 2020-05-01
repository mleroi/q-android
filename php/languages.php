<?php
/**
 * Server side languages configuration for WP-AppKit apps
 *
 * - SET LANGUAGES OPTIONS FOR YOUR APP HERE: see add_languages_config()
 * - ALSO SET POST TRANSLATIONS (TITLE, CONTENT etc) according to the WordPress multi-languages plugin used on your website: see add_post_translations()
 */

/**
 * Define languages available in the app and default language used when no language is chosen.
 * (Thoses options are then passed through app's config.js file)
 */
add_filter( 'wpak_default_options', 'add_languages_config', 10, 2 );
function add_languages_config ( $app_options, $app_id ) {

    //SET APP LANGUAGES HERE:
    $app_options['available_languages'] = [
        'en' => ['label' => 'English'],
        'es' => ['label' => 'Espanol'],
        'fr' => ['label' => 'Français'],
    ];

    //SET APP DEFAULT LANGUAGE HERE:
    $app_options['default_language'] = 'en';

    return $app_options;
}

/**
 * Customize WP-AppKit content webservice to add language translations to post data sent to the app:
 */
add_filter( 'wpak_post_data', 'add_post_translations', 10, 3 );
function add_post_translations ( $post_data, $post, $component ) {

    //For each post, add translations for its title and content.
    //We use fake test data here simply pre-fixing content by the language name.
    //To implement this for real, use the post translation function of the multi-languages plugin that
    //you are using on your website (use $post->ID to retrieve the translation of the current post).

    $post_data['translations'] = [
        'en' => [
            'content' => '<p>English!</p> '. $post_data['content'], //SET TRANSLATION FROM WORDPRESS MULTI-LANG PLUGIN
            'title' => 'English! '. $post_data['title'], //SET TRANSLATION FROM WORDPRESS MULTI-LANG PLUGIN
        ],
        'es' => [
            'content' => '<p>Espanol!</p> '. $post_data['content'], //SET TRANSLATION FROM WORDPRESS MULTI-LANG PLUGIN
            'title' => 'Espanol! '. $post_data['title'], //SET TRANSLATION FROM WORDPRESS MULTI-LANG PLUGIN
        ],
        'fr' => [
            'content' => '<p>Français!</p> '. $post_data['content'], //SET TRANSLATION FROM WORDPRESS MULTI-LANG PLUGIN
            'title' => 'Français! '. $post_data['title'], //SET TRANSLATION FROM WORDPRESS MULTI-LANG PLUGIN
        ],
    ];

    return $post_data;
}
