define( [ 'jquery', 'core/theme-app', 'core/modules/storage' ], function ( $, App, Storage ) {

	//Memorize current search string and search result:
	var current_search = {
		search_string: '',
		found_posts: []
	};

	//Create a custom screen for our search feature:
	App.addCustomRoute( 'search', 'search' );

	//Tell core that items displayed on our custom search screen are posts:
	App.filter( 'current-screen-global', function ( current_screen_global, screen_data ) {
		if ( screen_data.item_id === 'search' ) {
			current_screen_global = 'posts';
		}
		return current_screen_global;
	} );

	//Handle search form submission: search for the requested search string 
	//among posts that are currently in local storage:
	$( "#app-layout" ).on( "submit", "#search-form", function ( e ) {
		e.preventDefault();

		//Retrieve current search string from search form:
		var search_string = $( "#search-field" ).val();
		current_search.search_string = search_string;

		//Retrieve all posts that have content or title containing the search string:
		var found_posts = App.getItems().filter( function ( post ) {
			var regex = new RegExp( search_string, 'i' );
			return regex.test( post.get( 'content' ) ) || regex.test( post.get( 'title' ) );
		} );

		//Update current_search's found posts with with the result of our search:
		current_search.found_posts = _.map( found_posts, function ( post ) { return post.toJSON(); } );

		//Re-render search screen to display results:
		App.rerenderCurrentScreen();
	} );

	//Pass our current search info to search template so that it can display search form and search results:
	App.filter( 'template-args', function ( template_args, view_type, view_template ) {

		if ( view_template === 'search' ) {
			template_args.search_string = current_search.search_string;
			template_args.posts = current_search.found_posts;
		}

		return template_args;
	} );

	// Handle screen transitions when going from the search page to a single
	App.filter( 'transition-direction', function ( transition, current_screen, next_screen ) {
		if ( current_screen.item_id === 'search' && next_screen.screen_type === 'single' ) {
			transition = 'next-screen';
		} else if ( current_screen.screen_type === 'single' && next_screen.item_id === 'search' ) {
			transition = 'previous-screen';
		}
		return transition;
	} );
	
	//Handle scroll position on search screen: 
	//First memorize scroll position before leaving the search screen:
	App.on( 'screen:leave', function( current_screen, queried_screen, current_view ) {
		if ( current_screen.item_id === "search" ) {
			Storage.set( "scroll-pos", current_screen.fragment, $( current_view.el ).scrollTop() ); // Memorize the current scroll position in local storage
		}
	} );

	//Then scroll to memorized position when coming back to search screen:
	//NOTE: This leads to flickering when coming back to search screen (we "see" the scroll happening).
	//To fix that, remove this 'screen:showed' handler from here and add a 'next_screen.item_id === "search"'
	//case directly into function.js:transition_previous_screen
	App.on( 'screen:showed', function ( current_screen, current_view ) {
		if ( current_screen.item_id === "search" ) {
			var pos = Storage.get( "scroll-pos", current_screen.fragment );
			if ( pos !== null ) {
				$( current_view.el ).scrollTop( pos );
			} else {
				$( current_view.el ).scrollTop( 0 );
			}
		}
	} );
	
} );


