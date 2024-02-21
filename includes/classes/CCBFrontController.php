<?php

namespace cBuilder\Classes;

use cBuilder\Helpers\CCBFieldsHelper;

class CCBFrontController {

	public static function init() {
		add_action(
			'wp_enqueue_scripts',
			function () {
				wp_enqueue_script( 'jquery' );
			}
		);
		add_shortcode( 'stm-calc', array( self::class, 'render_calculator' ) );
		add_shortcode( 'stm-thank-you-page', array( self::class, 'render_thank_you_page' ) );
		add_filter( 'ccb_order_data_by_id', array( self::class, 'get_order_data_by_id' ) );
	}

	/**
	 * todo all template params must be here in controller
	 */
	public static function render_calculator( $attr ) {

		wp_enqueue_script( 'cbb-resize-sensor-js', CALC_URL . '/frontend/dist/sticky/ResizeSensor.js', array(), CALC_VERSION, true );
		wp_enqueue_script( 'cbb-sticky-sidebar-js', CALC_URL . '/frontend/dist//sticky/sticky-sidebar.js', array( 'cbb-resize-sensor-js' ), CALC_VERSION, true );

		wp_enqueue_style( 'ccb-icons-list', CALC_URL . '/frontend/dist/css/icon/style.css', array(), CALC_VERSION );
		wp_enqueue_style( 'calc-builder-app', CALC_URL . '/frontend/dist/css/style.css', array(), CALC_VERSION );

		$params   = shortcode_atts( array( 'id' => null ), $attr );
		$language = substr( get_bloginfo( 'language' ), 0, 2 );

		if ( ! is_admin() || ! empty( $_GET['page'] ) && 'cost_calculator_builder' === $_GET['action'] ) {  // phpcs:ignore WordPress.Security.NonceVerification
			wp_enqueue_script( 'calc-builder-main-js', CALC_URL . '/frontend/dist/bundle.js', array( 'cbb-sticky-sidebar-js' ), CALC_VERSION, true );
			wp_localize_script(
				'calc-builder-main-js',
				'ajax_window',
				array(
					'ajax_url'   => admin_url( 'admin-ajax.php' ),
					'language'   => $language,
					'templates'  => CCBFieldsHelper::get_fields_templates(),
					'pro_active' => ccb_pro_active(),
					'the_id'     => get_the_ID(),
				)
			);
		}

		if ( isset( $params['id'] ) && get_post( $params['id'] ) ) {
			$calc_id       = $params['id'];
			$id            = apply_filters( 'wpml_object_id', $calc_id, 'cost-calc', true );
			$calc_settings = CCBSettingsData::get_calculator_settings( $calc_id );
			$fields        = self::getCalculatorFields( $calc_id, $calc_settings );

			return \cBuilder\Classes\CCBTemplate::load(
				'/frontend/render',
				array(
					'calc_id'          => $id,
					'language'         => $language,
					'translations'     => CCBTranslations::get_frontend_translations(),
					'settings'         => $calc_settings['settings'],
					'general_settings' => $calc_settings['general_settings'],
					'fields'           => $fields,
				)
			);
		}

		return '<p style="text-align: center">' . __( 'No selected calculator', 'cost-calculator-builder' ) . '</p>';
	}

	private static function getCalculatorFields( $calc_id, $calc_settings ) {
		$fields = get_post_meta( $calc_id, 'stm-fields', true ) ?? array();

		if ( ! empty( $fields ) ) {
			array_walk(
				$fields,
				function ( &$field_value, $k ) use ( $calc_settings ) {

					/** set wc prooduct meta type */
					$field_value['wc_product_meta_link'] = '';
					if ( $calc_settings['settings']['woo_products']['enable'] && array_key_exists( 'alias', $field_value ) ) {
						$key = array_search( $field_value['alias'], array_column( $calc_settings['settings']['woo_products']['meta_links'], 'calc_field' ), true );
						if ( false !== $key ) {
							$field_value['wc_product_meta_link'] = $calc_settings['settings']['woo_products']['meta_links'][ $key ]['woo_meta'];
						}
					}
					/** set wc prooduct meta type |end */

					if ( array_key_exists( 'required', $field_value ) ) {
						$field_value['required'] = $field_value['required'] ? 'true' : 'false';
					}
				}
			);
		}
		return $fields;
	}

	public static function render_thank_you_page( $attr ) {
		wp_enqueue_script( 'cbb-resize-sensor-js', CALC_URL . '/frontend/dist/sticky/ResizeSensor.js', array(), CALC_VERSION, true );
		wp_enqueue_script( 'cbb-sticky-sidebar-js', CALC_URL . '/frontend/dist//sticky/sticky-sidebar.js', array( 'cbb-resize-sensor-js' ), CALC_VERSION, true );

		wp_enqueue_style( 'ccb-icons-list', CALC_URL . '/frontend/dist/css/icon/style.css', array(), CALC_VERSION );
		wp_enqueue_style( 'calc-builder-app', CALC_URL . '/frontend/dist/css/style.css', array(), CALC_VERSION );
		wp_enqueue_script( 'ccb-lodash-js', 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js', array(), CALC_VERSION, true );
		wp_add_inline_script( 'ccb-lodash-js', 'window.ccb_lodash = window.ccb_lodash ? window.ccb_lodash : _.noConflict();' );

		$params   = shortcode_atts( array( 'id' => null ), $attr );
		$language = substr( get_bloginfo( 'language' ), 0, 2 );

		wp_enqueue_script( 'calc-builder-main-js', CALC_URL . '/frontend/dist/bundle.js', array( 'ccb-lodash-js', 'cbb-sticky-sidebar-js' ), CALC_VERSION, true );
		wp_localize_script(
			'calc-builder-main-js',
			'ajax_window',
			array(
				'ajax_url'   => admin_url( 'admin-ajax.php' ),
				'language'   => $language,
				'templates'  => CCBFieldsHelper::get_fields_templates(),
				'pro_active' => ccb_pro_active(),
			)
		);

		if ( isset( $params['id'] ) && get_post( $params['id'] ) ) {
			$order_data = array();
			$order_id   = isset( $_GET['order_id'] ) ? (int) $_GET['order_id'] : null;
			$calc_id    = null;
			if ( ! is_null( $order_id ) ) {
				$order_data = apply_filters( 'ccb_order_data_by_id', $order_id );
				if ( isset( $order_data['calc_id'] ) ) {
					$calc_id = $order_data['calc_id'];
				}
			}

			$id = apply_filters( 'wpml_object_id', $calc_id, 'cost-calc', true );

			if ( defined( 'CCB_PRO' ) ) {
				return \cBuilder\Classes\CCBProTemplate::load(
					'/frontend/partials/custom-thank-you-page',
					array(
						'calc_id'      => $id,
						'order_id'     => $order_id,
						'language'     => $language,
						'order_data'   => $order_data,
						'translations' => CCBTranslations::get_frontend_translations(),
					)
				);
			}
		}

		return '';
	}

	public static function get_order_data_by_id( $id ) {
		if ( $id ) {
			$meta_data = get_option( 'calc_meta_data_order_' . $id, array() );
			$ccb_order = CCBOrderController::get_orders_by_id( $id );
			return array(
				'id'            => $ccb_order['id'],
				'calc_id'       => $ccb_order['calc_id'],
				'orderDetails'  => $ccb_order['order_details'],
				'formDetails'   => $ccb_order['form_details'],
				'paymentMethod' => $ccb_order['paymentMethod'],
				'orderDate'     => $ccb_order['date_formatted'],
				'converted'     => $meta_data['converted'],
				'totals'        => json_decode( $meta_data['totals'] ),
			);
		}

		return array();
	}
}
