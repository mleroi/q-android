<?php

add_filter( 'wpak_page_data', 'wpak_add_page_taxonomy_terms', 10, 3 );
function wpak_add_page_taxonomy_terms( $post_data, $post, $component ) {
    
    //When sending data for our "Term list" page component
    if ( $component->slug === 'term-list' ) {

        //Retrieve the terms for the taxonomy 'category'
        //(Replace 'category' by your own custom taxonomy)
        $terms = get_terms(['taxonomy'=>'category']); 

        //Add term list to our page's data:
        $post_data['terms'] = !empty( $terms ) && !is_wp_error( $terms ) ? $terms : [];

    }
    
    return $post_data;
}

/**
 * Add search params sent by the app to the search component's query.
 */
add_filter( 'wpak_posts_list_query_args', 'wpak_search_component_query', 10, 2 );
function wpak_search_component_query( $query_args, $component ) {

    $search_filters = WpakWebServiceContext::getClientAppParam( 'search_filters' );
    if ( !empty( $search_filters ) ) {

        if ( $component->slug === 'search' ) {

            $tax_query = [];

            //Build our search taxonomy query
            //(Replace 'category' by your own custom taxonomy)
            if ( !empty( $search_filters[ 'category' ] ) ) {
                $tax_query[] = [               
                    'taxonomy' => 'category',
                    'field' => 'slug',
                    'terms' => $search_filters[ 'category' ]
                ];
            }

            if ( !empty( $tax_query ) ) {
                $query_args[ 'tax_query' ] = $tax_query;
            }
        }
        
    }

    return $query_args;
}