<?php
/**
 * (To put in a php file (eg forms.php) created in WP-AppKit theme's "php" folder)
 *
 * Handle form submission on PHP side.
 * App form submission is made using the WP-AppKit "liveQuery" webservice.
 * Here we handle this webservice call, check which form was sent, sanitize posted data,
 * then send an email to the website admin.
 */

//Hook into liveQuery webservice to handle form submit
add_filter( 'wpak_live_query', 'wpak_handle_forms_submit', 10, 2 );
function wpak_handle_forms_submit( $service_answer, $query_params ) {
    //$query_params contains what was passed in liveQuery's "query_args"

    //Check that the 'form_action' action (set on app side) is 'submit':
    if ( isset( $query_params['form_action'] ) && $query_params['form_action'] === 'submit' ) {

        //Prepare our answer:
        $result = array( 'ok' => 0, 'error' => '' );

        //Check passed form data:
        if ( !empty( $query_params['form_id'] ) && !empty( $query_params['form_data'] ) ) {

            $form_data = $query_params['form_data'];
            $form_id = $query_params['form_id'];

            //This handles the form with id "contact" as defined on app side.
            //Any other form submission can be handled here by adding an "if" case following this one.
            if ( $form_id === 'contact' ) {

                //Sanitize inputs
                $firstname = sanitize_text_field( $form_data['firstname'] );
                $lastname = sanitize_text_field( $form_data['lastname'] );
                $email = sanitize_text_field( $form_data['email'] ); //email is validated hereunder
                $message = sanitize_textarea_field( $form_data['message'] );
                //For more sanitize functions see:
                //https://codex.wordpress.org/Validating_Sanitizing_and_Escaping_User_Data

                //Check sent data
                //Check not empty:
                if ( empty( $firstname ) || empty( $lastname ) || empty( $email ) || empty( $message ) ) {
                    $result['error'] = 'Please provide all fields';
                    $service_answer['form_result'] = $result;
                    return $service_answer;
                }
                //Check email validity:
                if ( !filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
                    $result['error'] = 'Please provide a valid email';
                    $service_answer['form_result'] = $result;
                    return $service_answer;
                }

                //Data check went ok. Now send email to website admin with contact form data:
                $mail_to = get_bloginfo( 'admin_email' );
                $subject = "Contact form submission from app ". wpak_get_current_app_slug();
                $body = "First name: ". $firstname ."\n".
                        "Last name:  ". $lastname ."\n".
                        "Email: ". $email ."\n\n".
                        "Message: \n". $message ."\n";

                wp_mail( $mail_to, $subject, $body );

                //If you need to do other treatments (save form data in database, etc)
                //you can do it here

                //Tell the app that everything went ok
                $result['ok'] = 1;

            } else {

                $result['error'] = 'Form ['. $form_id .'] not found';

            }

            $form_data = $query_params['form_data'];

        } else {

            $result['error'] = 'Wrong form';

        }

        //Add our result to the web service answer:
        $service_answer['form_result'] = $result;
    }

    return $service_answer;
    //This webservice answer is then handled on app side in the "success" callback in forms.js
}
