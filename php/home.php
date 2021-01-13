<?php
/*
 * Add thumbnail size of featured image to display in home page lists
 */
function wpak_add_home_custom_data( $post_data, $post, $component ) {

    // Add post featured image in thumbnail size.
    // Usage in app's templates: <%= post.thumbnail.thumb %>
    $thumbnail_id = get_post_thumbnail_id( $post->ID );
    if ( $thumbnail_id ) {
        $image_post = get_post( $thumbnail_id );
        if ( $image_post ) {
            if ( !empty( $post_data['thumbnail'] ) ) {
                $thumb = wp_get_attachment_image_src( $thumbnail_id, 'thumbnail' );
                $post_data['thumbnail']['thumb'] = $thumb[0];
            }
        }
    }

    return $post_data; // Return the modified $post_data

}

add_filter( 'wpak_post_data', 'wpak_add_home_custom_data', 10, 3 );
