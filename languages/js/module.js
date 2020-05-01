/**
 * Languages module
 * Defines language default config and languages related functions used in [theme]/languages/js/app.js
 * and can be also required in [theme]/functions.js if needed.
 */
define([
    'core/app',
    'core/modules/persistent-storage',
    ], function(CoreApp,Storage) {

    /*************************************************************************
     * Languages settings
     */

    //Set available languages and default language from app options setted in [theme]/php/languages.php:
    var available_languages = CoreApp.options.get('available_languages').get('value');
    var default_language = CoreApp.options.get('default_language').get('value');

    /*************************************************************************
     * Language module that can be used elsewhere in theme's Javascript modules
     * (used in languages/js/app.js and can be used in functions.js also for example).
     */

    var languages = {};

    //Get current language from local storage:
    languages.getCurrentLanguage = function(default_if_empty) {
        default_if_empty = (default_if_empty || default_if_empty == '') ? default_if_empty : default_language;
        return Storage.get('languages','current_language',default_if_empty);
    };

    //Set current language into local storage:
    languages.setCurrentLanguage = function(language) {
        Storage.set('languages','current_language',language);
    };

    //Get specific data about current language:
    languages.getCurrentLanguageData = function(data) {
        return available_languages[this.getCurrentLanguage()][data];
    };

    //Get all available languages:
    languages.getAvailableLanguages = function() {
        return available_languages;
    }

    return languages

});
