<?php
function gutenberg_block_gutenberg_block_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'gutenberg_block_gutenberg_block_block_init' );


function gutenberg_calculators( $data ) {
	if ( is_user_logged_in() ) {
		$args  = array(
			'post_type'      => 'cost-calc',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
		);

		$data = new \WP_Query( $args );
		$data = $data->posts;

		if ( count( $data ) > 0 ) {
			foreach ( $data as $value ) {
				$lists[ $value->ID ] = $value->post_title;
			}
		}

		return $lists;

	} else {
		return new WP_Error( 'not_authorized', 'User is not authorized to access this resource. User ID: ' . $user->ID, array( 'status' => 403 ) );
	}
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'ccb-gutenberg/v1',
			'/calculators/',
			array(
				'methods'             => 'GET',
				'callback'            => 'gutenberg_calculators',
				'permission_callback' => 'gutenberg_check_user_permission',
			)
		);
	}
);

function gutenberg_check_user_permission() {
	return is_user_logged_in();
}
