/**
 * Handle app forms submission.
 * Put this file in [your-app-theme]/js/forms.js, and require it in functions.js.
 */
define([
    'jquery',
    'core/theme-app',
    ], function($,App) {

    //Define forms that will be used in the app, along with their corresponding field names.
    //Forms (HTML) must also be defined in app templates with class="app-form",
    //and are handled on server side in php/forms.php.
    var forms = {
        contact: { //Form id
            fields: [
                'firstname', //Field name
                'lastname',
                'email',
                'message',
            ],
            messages: {
                submitting: "Sending message...",
                success: "Message sent successfully! Thank you for contacting us.",
                error: "An error occurred"
            }
        }
    };

    //Create a custom app screen called "contact" associated to template "contact.html", where the contact form is implemented.
    //We also add a link to this contact screen in app menu (see menu.html template).
    App.addCustomRoute( 'contact', 'contact' );

    /*************************************************************
     * You shouldn't have to modify what follows
     */

    //Handle app forms submission
    $('#app-layout').on('submit','.app-form', function(e) {

        e.preventDefault();

        var form_id = $(this).attr('id');

        if( forms.hasOwnProperty(form_id) ) {
            var form = forms[form_id];

            //Retrieve form data
            var form_data = {};
            $.each(form.fields, function(index, field_name){
                form_data[field_name] = $('[name='+ field_name +']').val();
            });

            //Get feeback wrapper:
            var $feedback = $('.feedback', this);
            $feedback.text('').removeClass('success error').hide();

            //Get submit button and set the "submitting" message:
            var $submitButton = $('input[type=submit]', this);
            var original_submit_button_message = $submitButton.val().length ? $submitButton.val() : 'Submit';
            $submitButton.val(form.messages.submitting).prop('disabled', true);

            //Configure WP-AppKit liveQuery web service to submit the form to the server:

            //Define our custom query that we will handle on server side using the 'wpak_live_query' hook in php/forms.php
            var query_args = {
                form_action: 'submit',
                form_id: form_id,
                form_data: form_data
            };

            //Define query options:
            var options = {
                success: function( answer ) { //The liveQuery webservice call went ok

                    if ( answer.form_result.ok === 1 ) {
                        //Form submitted ok.
                        //Display some success feedback to the user.
                        $feedback.text(form.messages.success).addClass('success').show();
                        //Remove submit button so that we don't submit again
                        $submitButton.remove();
                    } else {
                        //An error occurred.
                        //Display an error feedback to the user.
                        $feedback.text(form.messages.error +': '+ answer.form_result.error).addClass('error').show();
                        $submitButton.val(original_submit_button_message);
                        $submitButton.prop('disabled', false);
                    }

                },
                error: function( error ) {

                    //This is if the liveQuery web service ajax call failed (no network)
                    //Display an error feedback to the user.

                    $feedback.text(form.messages.error +': network error.').addClass('error').show();

                    $submitButton.val(original_submit_button_message);
                    $submitButton.prop('disabled', false);

                },
                auto_interpret_result: false, //This is to tell WP-AppKit that we're doing our own custom query
            };

            //Finally submit our form data to the server using liveQuery webservice:
            App.liveQuery( query_args, options );
        }
    });

});
