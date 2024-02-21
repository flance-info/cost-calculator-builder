<?php

namespace cBuilder\Classes;

use cBuilder\Classes\Appearance\Presets\CCBPresetGenerator;
use cBuilder\Classes\Database\Orders;
use cBuilder\Classes\Database\Payments;

class CCBUpdatesCallbacks {

	public static function calculator_add_container_blur() {
		$presets = CCBPresetGenerator::get_static_preset_from_db();
		foreach ( $presets as $idx => $preset ) {
			if ( isset( $preset['desktop']['colors'] ) ) {
				$colors = $preset['desktop']['colors'];
				if ( isset( $colors['container_color'] ) ) {
					$container_bg = $colors['container_color'];

					unset( $colors['container_color'] );
					$colors['container']         = CCBPresetGenerator::get_container_default( $container_bg );
					$preset['desktop']['colors'] = $colors;
				}
			}
			$presets[ $idx ] = $preset;
		}

		CCBPresetGenerator::update_presets( $presets );
	}


	/**
	 *  Add 'Summary header font' options to Typography block
	 */
	public static function ccb_add_summary_header_appearance() {
		$presets = CCBPresetGenerator::get_static_preset_from_db();

		foreach ( $presets as $idx => $preset ) {
			if ( isset( $preset['data'] ) && ! isset( $preset['data']['desktop']['typography']['summary_header_size'] ) ) {
				$preset_data = $preset['data'];
				if ( ! isset( $preset_data['desktop']['typography']['summary_header_size'] ) ) {
					$preset_data['desktop']['typography']['summary_header_size'] = 14;
				}
				if ( ! isset( $preset_data['mobile']['typography']['summary_header_size'] ) ) {
					$preset_data['mobile']['typography']['summary_header_size'] = 14;
				}

				if ( ! isset( $preset_data['desktop']['typography']['summary_header_font_weight'] ) ) {
					$preset_data['desktop']['typography']['summary_header_font_weight'] = 700;
				}
				if ( ! isset( $preset_data['mobile']['typography']['summary_header_font_weight'] ) ) {
					$preset_data['mobile']['typography']['summary_header_font_weight'] = 700;
				}

				$preset['data']  = $preset_data;
				$presets[ $idx ] = $preset;
			}
		}

		CCBPresetGenerator::update_presets( $presets );
	}

	/**
	 * 3.1.51
	 */
	public static function ccb_update_min_date_info_to_unselectable() {
		$calculators = self::get_calculators();

		foreach ( $calculators as $calculator ) {
			$fields = get_post_meta( $calculator->ID, 'stm-fields', true );

			foreach ( $fields as $key => $field ) {
				if ( isset( $field['alias'] ) && preg_replace( '/_field_id.*/', '', $field['alias'] ) === 'datePicker' ) {
					$field['not_allowed_dates'] = array(
						'all_past' => false,
						'current'  => false,
						'period'   => array(
							'start' => null,
							'end'   => null,
						),
					);

					if ( isset( $field['min_date'] ) && $field['min_date'] ) {
						$field['is_have_unselectable']          = 'true';
						$field['not_allowed_dates']['all_past'] = 'true';

						if ( $field['min_date_days'] > 0 ) {
							$field['not_allowed_dates']['current'] = true;
							$field['days_from_current']            = $field['min_date_days'] - 1;
						}
					}
					$fields[ $key ] = $field;
				}
			}
			update_post_meta( $calculator->ID, 'stm-fields', (array) $fields );
		}
	}

	/**
	 * 3.1.34
	 * Add 'Total field text transform' option to Typography block
	 */
	public static function ccb_add_text_transform_appearance() {
		$presets = CCBPresetGenerator::get_static_preset_from_db();

		$default_text_transform = 'capitalize';
		foreach ( $presets as $idx => $preset ) {
			if ( isset( $preset['data'] ) ) {
				$preset_data = $preset['data'];

				if ( ! isset( $preset_data['desktop']['typography']['total_text_transform'] ) ) {
					$preset_data['desktop']['typography']['total_text_transform'] = $default_text_transform;
				}

				if ( ! isset( $preset_data['mobile']['typography']['total_text_transform'] ) ) {
					$preset_data['mobile']['typography']['total_text_transform'] = $default_text_transform;
				}

				$preset['data']  = $preset_data;
				$presets[ $idx ] = $preset;
			}
		}

		CCBPresetGenerator::update_presets( $presets );
	}

	/**
	 * 3.1.32
	 * Add default webhooks settings
	 */
	public static function ccb_add_default_webhook_settings() {
		$calculators = self::get_calculators();
		foreach ( $calculators as $calculator ) {
			$calc_settings = get_option( 'stm_ccb_form_settings_' . $calculator->ID );
			if ( empty( $calc_settings['webhooks'] ) ) {
				$calc_settings['webhooks']['enableSendForms']  = false;
				$calc_settings['webhooks']['enableEmailQuote'] = false;
				$calc_settings['webhooks']['enablePaymentBtn'] = false;

				update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $calculator->ID ), apply_filters( 'stm_ccb_sanitize_array', $calc_settings ) );
			}
		}
	}

	/**
	 * 3.1.31
	 * Update "Add svg color to Appearance
	 */
	public static function calculator_add_svg_color_appearance() {
		$presets = CCBPresetGenerator::get_static_preset_from_db();

		foreach ( $presets as $idx => $preset ) {
			if ( isset( $preset['data'] ) ) {
				$preset_data = $preset['data'];

				if ( ! isset( $preset_data['desktop']['colors']['svg_color'] ) ) {
					$preset_data['desktop']['colors']['svg_color'] = 0;
				}

				$preset['data']  = $preset_data;
				$presets[ $idx ] = $preset;
			}
		}

		CCBPresetGenerator::update_presets( $presets );
	}

	/**
	 * 3.1.29
	 * Update "Deliver Service" template in wp posts
	 * change "Type of Service" field from drop down to radio
	 */
	public static function ccb_update_template_delivery_service_field() {
		$templateName = 'Delivery Service';

		$args = array(
			'post_type'   => 'cost-calc',
			'post_status' => array( 'draft' ),
			'title'       => $templateName,
		);

		if ( class_exists( 'Polylang' ) ) {
			$args['lang'] = '';
		}

		$calcTemplates = get_posts( $args );

		if ( count( $calcTemplates ) === 0 ) {
			return;
		}

		$newTemplateData = CCBCalculatorTemplates::get_template_by_name( $templateName );
		if ( ! isset( $newTemplateData ) ) {
			return;
		}

		if ( ! isset( $newTemplateData['ccb_fields'] ) || count( $newTemplateData['ccb_fields'] ) === 0 ) {
			return;
		}

		update_post_meta( $calcTemplates[0]->ID, 'stm-formula', (array) $newTemplateData['ccb_formula'] );
		update_post_meta( $calcTemplates[0]->ID, 'stm-fields', (array) $newTemplateData['ccb_fields'] );
	}

	/**
	 * 3.1.23
	 * Update woo_products settings
	 * create category_ids option
	 * add all category ids if woo_products enabled empty value ( cause by default is "All categories" )
	 * add to array chosen value ( category_id )  if exist
	 */
	public static function ccb_make_woo_product_category_id_multiple() {
		$calculators    = self::get_calculators();
		$all_categories = ccb_woo_categories();
		$category_ids   = array();
		if ( ! ( $all_categories instanceof \WP_Error ) ) {
			$category_ids = array_column( $all_categories, 'term_id' );
		}

		foreach ( $calculators as $calculator ) {
			$calc_settings = get_option( 'stm_ccb_form_settings_' . $calculator->ID );
			$woo_products  = $calc_settings['woo_products'];

			/** create new option for list of category ids */
			$woo_products['category_ids'] = array();
			if ( null !== $woo_products['category_id'] ) {
				array_push( $woo_products['category_ids'], $woo_products['category_id'] );
			}

			if ( $woo_products['enable'] ) {
				$woo_products['category_ids'] = $category_ids;
			}

			$calc_settings['woo_products'] = $woo_products;
			update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $calculator->ID ), apply_filters( 'stm_ccb_sanitize_array', $calc_settings ) );
		}
	}


	/**
	 * Update Payments table total column.
	 */
	public static function ccb_update_payments_table_total_column() {
		global $wpdb;
		$payment_table = Payments::_table();
		if ( $wpdb->get_var( $wpdb->prepare( 'SHOW COLUMNS FROM `%1s` LIKE %s;', $payment_table, 'total' ) ) ) { // phpcs:ignore
			$wpdb->query(
				$wpdb->prepare(
				"ALTER TABLE `%1s` CHANGE `total` `total` double NOT NULL DEFAULT '0.00000000';", // phpcs:ignore
					$payment_table
				)
			);
		}
	}

	/**
	 * Add Payments table.
	 */
	public static function ccb_add_payments_table() {
		Payments::create_table();
	}

	/**
	 * Move Payments data from order to payment table.
	 */
	public static function move_from_order_to_payment_table() {
		$orders = Orders::get_all();
		foreach ( $orders as $order ) {
			$exist = Payments::get( 'order_id', $order['id'] );
			if ( null !== $exist ) {
				continue;
			}

			$payment_type = Payments::$defaultType; // phpcs:ignore
			if ( ! empty( $order['payment_method'] ) && in_array( $order['payment_method'], Payments::$typeList, true ) ) { // phpcs:ignore
				$payment_type = $order['payment_method'];
			}

			$payment = array(
				'order_id'   => $order['id'],
				'type'       => $payment_type,
				'status'     => ! empty( $order['status'] ) ? $order['status'] : Payments::$defaultStatus, // phpcs:ignore
				'total'      => $order['total'],
				'currency'   => $order['currency'],
				'created_at' => wp_date( 'Y-m-d H:i:s' ),
				'updated_at' => wp_date( 'Y-m-d H:i:s' ),
			);

			if ( Payments::$completeStatus === $payment['status'] ) { // phpcs:ignore
				$payment['paid_at'] = wp_date( 'Y-m-d H:i:s' );
			}
			Payments::insert( $payment );
		}
		self::drop_payment_fields_from_order_table();
	}

	/**
	 * Update Orders table, remove payment_method, currency, total
	 */
	public static function drop_payment_fields_from_order_table() {
		global $wpdb;
		try {
			if ( $wpdb->get_var( $wpdb->prepare( 'SHOW COLUMNS FROM `%1s` LIKE %s;', Orders::_table(), 'payment_method' ) ) ) {  // phpcs:ignore
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE `%1s` DROP  COLUMN `payment_method`;', Orders::_table() ) );  // phpcs:ignore
			}

			if ( $wpdb->get_var( $wpdb->prepare( 'SHOW COLUMNS FROM `%1s` LIKE %s;', Orders::_table(), 'currency' ) ) ) {  // phpcs:ignore
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE `%1s` DROP  COLUMN `currency`;', Orders::_table() ) );  // phpcs:ignore
			}

			if ( $wpdb->get_var( $wpdb->prepare( 'SHOW COLUMNS FROM `%1s` LIKE %s;', Orders::_table(), 'total' ) ) ) {  // phpcs:ignore
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE `%1s` DROP  COLUMN `total`;', Orders::_table() ) );  // phpcs:ignore
			}
		} catch ( \Exception $e ) {
			ccb_write_log( $e );
		}
	}

	/**
	 * Create wp_cc_order table
	 */
	public static function cc_create_orders_table() {
		\cBuilder\Classes\Database\Orders::create_table();
	}

	public static function ccb_appearance_totals( $totals, $descriptions ) {
		$formulas = array();
		foreach ( $totals as $idx => $total ) {
			$ccbDesc = strpos( $descriptions, '[ccb-total-' . $idx . ']' );
			if ( false !== $ccbDesc ) {
				$formulas[] = array(
					'idx'   => $idx,
					'title' => $total['label'],
					'alias' => $total['alias'] ?? '',
				);
			}
		}

		return $formulas;
	}

	public static function get_total_fields( $calc_id ) {
		$fields = get_post_meta( $calc_id, 'stm-fields', true );
		$totals = array();
		foreach ( $fields as $field ) {
			if ( isset( $field['_tag'] ) && 'cost-total' === $field['_tag'] ) {
				$totals[] = $field;
			}
		}

		return $totals;
	}

	public static function preset_exist( $presets, $colors ) {
		$exist = false;
		foreach ( $presets as $key => $preset ) {
			if ( isset( $preset['data'] ) ) {
				if ( $preset['data']['desktop']['colors'] == $colors && ! is_numeric( $exist ) ) { // phpcs:ignore
					$exist = $key;
				}
			}
		}

		return $exist;
	}

	public static function theme_exist( $themes, $colors ) {
		$exist = false;

		foreach ( $themes as $key => $theme ) {
			if ( isset( $theme['data'] ) ) {
				$theme_colors = $theme['data']['desktop']['colors'];

				$colors_lower = array();
				foreach ( $colors as $color_key => $color ) {
					if ( 'container' === $color_key ) {
						$colors_lower[ $color_key ]          = $color;
						$colors_lower[ $color_key ]['color'] = strtolower( $color['color'] );
					} elseif ( ! empty( $color ) ) {
						$colors_lower[ $color_key ] = strtolower( $color );
					}
				}

				$theme_colors_lower = array();
				foreach ( $theme_colors as $color_key => $color ) {
					if ( 'container' === $color_key ) {
						$theme_colors_lower[ $color_key ]          = $color;
						$theme_colors_lower[ $color_key ]['color'] = strtolower( $color['color'] );
					} else {
						$theme_colors_lower[ $color_key ] = strtolower( $color );
					}
				}

				if ( ! $exist && $theme_colors_lower == $colors_lower ) { // phpcs:ignore
					$exist = $key;
				}
			}
		}

		return $exist;
	}

	public static function get_calculators() {
		$args = array(
			'posts_per_page' => - 1,
			'post_type'      => 'cost-calc',
			'post_status'    => array( 'publish' ),
		);

		if ( class_exists( 'Polylang' ) ) {
			$args['lang'] = '';
		}

		$calculators = new \WP_Query( $args );

		return $calculators->posts;
	}

	public static function calculator_add_templates() {
		CCBCalculatorTemplates::render_templates();
		CCBCalculators::create_sample_calculator();
		ccb_set_admin_url();
	}

	public static function calculator_email_templates_footer_toggle() {
		$general_settings = get_option( 'ccb_general_settings' );

		if ( isset( $general_settings['email_templates'] ) ) {
			if ( ! isset( $general_settings['email_templates']['footer'] ) ) {
				$general_settings['email_templates']['footer'] = true;

				update_option( 'ccb_general_settings', apply_filters( 'calc_update_options', $general_settings ) );
			}
		}
	}

	public static function calculator_add_styles() {
		$general_settings = get_option( 'ccb_general_settings', \cBuilder\Classes\CCBSettingsData::general_settings_data() );
		if ( isset( $general_settings['general'] ) && empty( $general_settings['general']['styles'] ) ) {
			$general_settings['styles'] = array(
				'radio'             => '',
				'checkbox'          => '',
				'toggle'            => '',
				'radio_with_img'    => '',
				'checkbox_with_img' => '',
			);
		}
	}

	public static function ccb_add_thank_you_page_settings() {
		$settings    = \cBuilder\Classes\CCBSettingsData::settings_data();
		$calculators = self::get_calculators();
		foreach ( $calculators as $calculator ) {
			$calc_settings = get_option( 'stm_ccb_form_settings_' . $calculator->ID );
			if ( ! isset( $calc_settings['thankYouPage'] ) ) {
				$calc_settings['thankYouPage'] = $settings['thankYouPage'];
			}
			update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $calculator->ID ), apply_filters( 'stm_ccb_sanitize_array', $calc_settings ) );
		}
	}

	public static function ccb_sync_calc_settings() {
		$settings    = \cBuilder\Classes\CCBSettingsData::settings_data();
		$calculators = self::get_calculators();

		foreach ( $calculators as $calculator ) {
			$calc_settings = get_option( 'stm_ccb_form_settings_' . $calculator->ID );
			$sync_settings = ccb_array_merge_recursive_left_source( $settings, $calc_settings ); // phpcs:ignore
			update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $calculator->ID ), apply_filters( 'stm_ccb_sanitize_array', $sync_settings ) );
		}
	}

	public static function ccb_sync_general_settings() {
		$calc_options_settings = get_option( 'ccb_general_settings' );
		$calc_static_settings  = \cBuilder\Classes\CCBSettingsData::general_settings_data();
		$sync_settings         = ccb_array_merge_recursive_left_source( $calc_static_settings, $calc_options_settings ); // phpcs:ignore

		update_option( 'ccb_general_settings', $sync_settings );
	}

	public static function ccb_update_checkbox_conditions() {
		$calculators = self::get_calculators();
		foreach ( $calculators as $calculator ) {
			$conditions = get_post_meta( $calculator->ID, 'stm-conditions', true );

			if ( ! empty( $conditions['links'] ) ) {
				foreach ( $conditions['links'] as $index => $link ) {

					$options_from = $link['options_from'] ?? '';
					$condition    = $link['condition'] ?? array();

					if ( ( str_contains( $options_from, 'checkbox' ) || str_contains( $options_from, 'toggle' ) ) ) {
						foreach ( $condition as $condition_key => $condition_item ) {
							foreach ( $condition_item['conditions'] as $inner_key => $inner_condition ) {
								if ( in_array( $inner_condition['condition'], array( '==', '!=' ), true ) && ! isset( $inner_condition['checkedValues'] ) ) {
									$inner_condition['checkedValues'] = array( $inner_condition['key'] );
									$inner_condition['key']           = '';
									$inner_condition['condition']     = '==' === $inner_condition['condition'] ? 'in' : 'not in';

									$link['condition'][ $condition_key ]['conditions'][ $inner_key ] = $inner_condition;
								}
							}
						}
					}

					$conditions['links'][ $index ] = $link;
				}
			}

			update_post_meta( $calculator->ID, 'stm-conditions', apply_filters( 'stm_ccb_sanitize_array', $conditions ) );
		}
	}

	public static function ccb_add_invoice_success_btn() {
		$general_settings = get_option( 'ccb_general_settings' );

		if ( isset( $general_settings['invoice'] ) ) {
			if ( ! isset( $general_settings['invoice']['successText'] ) ) {
				// don't change domain 'cost-calculator-builder-pro' because if user already change this text into another will extend automatically
				$general_settings['invoice']['successBtn'] = __( 'Email Quote Successfully Sent!', 'cost-calculator-builder-pro' );
			}

			if ( ! isset( $general_settings['invoice']['errorText'] ) ) {
				// don't change domain 'cost-calculator-builder-pro' because if user already change this text into another will extend automatically
				$general_settings['invoice']['errorText'] = __( 'Fill in the required fields correctly.', 'cost-calculator-builder-pro' );
			}
		}

		update_option( 'ccb_general_settings', $general_settings );
	}

	public static function fix_payment_totals( $formulas, $totals ) {
		foreach ( $formulas as $key => $formula ) {
			if ( ! isset( $formula['alias'] ) && isset( $formula['idx'] ) && isset( $totals[ $formula['idx'] ] ) ) {
				if ( isset( $totals[ $formula['idx'] ]['alias'] ) ) {
					$formulas[ $key ]['alias'] = $totals[ $formula['idx'] ]['alias'];
				}
			}
		}

		return $formulas;
	}

	public static function ccb_update_payment_totals() {
		$calculators = self::get_calculators();

		foreach ( $calculators as $calculator ) {
			$totals        = self::get_total_fields( $calculator->ID );
			$calc_settings = get_option( 'stm_ccb_form_settings_' . $calculator->ID );

			if ( isset( $calc_settings['formFields']['formulas'] ) ) {
				$calc_settings['formFields']['formulas'] = self::fix_payment_totals( $calc_settings['formFields']['formulas'], $totals );
			}

			if ( isset( $calc_settings['woo_checkout']['formulas'] ) ) {
				$calc_settings['woo_checkout']['formulas'] = self::fix_payment_totals( $calc_settings['woo_checkout']['formulas'], $totals );
			}

			update_option( 'stm_ccb_form_settings_' . $calculator->ID, $calc_settings );
		}
	}

	public static function ccb_update_legacy_totals() {
		$calculators = self::get_calculators();

		foreach ( $calculators as $calculator ) {
			$fields = get_post_meta( $calculator->ID, 'stm-fields', true );
			foreach ( $fields as $key => $field ) {
				if ( 'cost-total' === $field['_tag'] && ! isset( $field['legacyFormula'] ) ) {
					if ( ! isset( $field['formulaView'] ) ) {
						$fields[ $key ]['formulaView'] = false;
					}
					$fields[ $key ]['legacyFormula'] = $field['costCalcFormula'];
				}
			}

			update_post_meta( $calculator->ID, 'stm-fields', $fields );

			$formulas = get_post_meta( $calculator->ID, 'stm-formula', true );
			foreach ( $formulas as $key => $formula ) {
				foreach ( $fields as $field ) {
					if ( isset( $field['formulaView'] ) && isset( $field['alias'] ) && isset( $formula['alias'] ) && $field['alias'] === $formula['alias'] ) {
						$formulas[ $key ]['formula'] = $field['formulaView'] ? $field['legacyFormula'] : $formulas[ $key ]['formula'];
					}
				}
			}

			update_post_meta( $calculator->ID, 'stm-formula', $formulas );
		}
	}

	public static function ccb_add_show_value_option() {
		$calculators = self::get_calculators();

		foreach ( $calculators as $calculator ) {
			$fields        = get_post_meta( $calculator->ID, 'stm-fields', true );
			$change_fields = array( 'dropDown', 'dropDown_with_img', 'radio_with_img', 'checkbox_with_img' );

			foreach ( $fields as $key => $field ) {
				if ( isset( $field['alias'] ) ) {
					$field_name = preg_replace( '/_field_id.*/', '', $field['alias'] );
					if ( in_array( $field_name, $change_fields, true ) && ! isset( $field['show_value_in_option'] ) ) {
						if ( 'radio_with_img' === $field_name && isset( $field['summary_view'] ) && 'show_value' !== $field['summary_view'] ) {
							$field['show_value_in_option'] = false;
						} elseif ( in_array( $field_name, array( 'dropDown', 'dropDown_with_img' ), true ) && ! $field['allowCurrency'] ) {
							$field['show_value_in_option'] = false;
						} else {
							$field['show_value_in_option'] = true;
						}
					}
				}
				$fields[ $key ] = $field;
			}

			update_post_meta( $calculator->ID, 'stm-fields', (array) $fields );
		}
	}

	public static function ccb_add_price_for_file() {
		$calculators = self::get_calculators();

		foreach ( $calculators as $calculator ) {
			$fields = get_post_meta( $calculator->ID, 'stm-fields', true );

			foreach ( $fields as $key => $field ) {
				if ( isset( $field['alias'] ) && str_contains( $field['alias'], 'file' ) && ! isset( $field['allowPrice'] ) ) {
					$field['allowPrice']       = true;
					$field['calculatePerEach'] = false;

					$fields[ $key ] = $field;
				}
			}

			update_post_meta( $calculator->ID, 'stm-fields', $fields );
		}
	}

	public static function ccb_checkbox_box_style() {
		$calculators = self::get_calculators();

		foreach ( $calculators as $calculator ) {
			$fields = get_post_meta( $calculator->ID, 'stm-fields', true );

			foreach ( $fields as $key => $field ) {
				if ( isset( $field['alias'] ) && str_contains( $field['alias'], 'radio_with_img' ) && 'default' === $field['styles']['style'] ) {
					$field['styles']['box_style'] = 'horizontal';
					$fields[ $key ]               = $field;
				}
			}

			update_post_meta( $calculator->ID, 'stm-fields', $fields );
		}
	}

	public static function ccb_convert_presets_into_theme() {
		$presets_idxes = array();
		$calculators   = self::get_calculators();
		$presets       = CCBPresetGenerator::get_static_preset_from_db();
		$themes        = CCBPresetGenerator::default_presets();
		$all_themes    = array_merge( $themes, $presets );

		$calc_preset_store = array();

		foreach ( $calculators as $calculator ) {
			$idx = get_post_meta( $calculator->ID, 'ccb_calc_preset_idx', true );

			if ( ! CCBPresetGenerator::preset_exist( $idx ) && isset( $presets[ $idx ]['desktop'] ) ) {
				$preset = $presets[ $idx ];
				$colors = $preset['desktop']['colors'];

				$key = self::theme_exist( $all_themes, $colors );
				if ( $key ) {
					unset( $presets[ $idx ] );
					CCBPresetGenerator::update_preset_key( $calculator->ID, sanitize_text_field( $key ) );
				} else {
					if ( ! in_array( intval( $idx ), $presets_idxes, true ) ) {
						$presets_idxes[] = intval( $idx );
					}

					if ( isset( $calc_preset_store[ $idx ] ) && is_array( $calc_preset_store[ $idx ] ) ) {
						$calc_preset_store[ $idx ][] = $calculator->ID;
					} else {
						$calc_preset_store[ $idx ] = array( $calculator->ID );
					}
				}
			} elseif ( CCBPresetGenerator::preset_exist( $idx ) ) {
				CCBPresetGenerator::update_preset_key( $calculator->ID, sanitize_text_field( $idx ) );
			} else {
				CCBPresetGenerator::update_preset_key( $calculator->ID );
			}
		}

		$new_themes  = CCBPresetGenerator::get_static_preset_from_db( true );
		$theme_count = count( $new_themes );

		if ( count( $presets ) > 0 ) {
			foreach ( $presets as $idx => $preset ) {
				if ( ! in_array( $idx, $presets_idxes, true ) ) {
					unset( $presets[ $idx ] );
				} elseif ( isset( $preset['desktop'] ) && isset( $calc_preset_store[ $idx ] ) ) {
					$new_theme                       = CCBPresetGenerator::generate_new_preset( $theme_count + 1, $preset );
					$new_themes[ $new_theme['key'] ] = $new_theme;
					$ids                             = $calc_preset_store[ $idx ];

					foreach ( $ids as $id ) {
						CCBPresetGenerator::update_preset_key( $id, $new_theme['key'] );
					}
					$theme_count++;
				}
			}
		}

		CCBPresetGenerator::update_presets( $new_themes );
	}

	public static function ccb_move_box_style_from_settings() {
		$calculators = self::get_calculators();

		foreach ( $calculators as $calculator ) {
			$presets       = CCBPresetGenerator::get_static_preset_from_db();
			$calc_settings = get_option( 'stm_ccb_form_settings_' . $calculator->ID );

			if ( isset( $calc_settings['general']['boxStyle'] ) ) {
				$box_style  = $calc_settings['general']['boxStyle'];
				$preset_key = get_post_meta( $calculator->ID, 'ccb_calc_preset_idx', true );

				if ( str_contains( $preset_key, 'saved' ) && isset( $presets[ $preset_key ] ) ) {
					$theme_box_style = $box_style;

					if ( isset( $presets[ $preset_key ]['data']['desktop']['layout']['box_style'] ) ) {
						$theme_box_style = $presets[ $preset_key ]['data']['desktop']['layout']['box_style'];
					}

					if ( $theme_box_style !== $box_style ) {
						$preset = $presets[ $preset_key ];

						$preset['data']['desktop']['layout']['box_style'] = $box_style;
						$new_theme                                        = CCBPresetGenerator::extend_preset( count( $presets ) + 1, $preset['data'] );
						$presets[ $new_theme['key'] ]                     = $new_theme;

						CCBPresetGenerator::update_preset_key( $calculator->ID, $new_theme['key'] );
					}
				}

				unset( $calc_settings['general']['boxStyle'] );
				update_option( 'stm_ccb_form_settings_' . $calculator->ID, $calc_settings );
			}

			CCBPresetGenerator::update_presets( $presets );
		}
	}

	public static function calculator_add_invoice_close_btn() {
		$general_settings = get_option( 'ccb_general_settings' );
		if ( empty( $general_settings['invoice']['closeBtn'] ) ) {
			$general_settings['invoice']['closeBtn'] = 'Close';
		}

		update_option( 'ccb_general_settings', apply_filters( 'calc_update_options', $general_settings ) );
	}

	public static function ccb_change_font_weight_options() {
		$presets = CCBPresetGenerator::get_static_preset_from_db();
		$replace = array(
			'bold'   => 700,
			'bolder' => 700,
			'normal' => 500,
		);

		$valid   = array( 400, 500, 600, 700 );
		$devices = array( 'desktop', 'mobile' );
		$props   = array( 'header_font_weight', 'summary_header_font_weight', 'label_font_weight', 'description_font_weight', 'total_field_font_weight', 'total_font_weight', 'fields_btn_font_weight' );

		foreach ( $presets as $key => $preset ) {
			if ( isset( $preset['data']['desktop']['typography'] ) ) {
				foreach ( $devices as $device ) {
					$typography = $preset['data'][ $device ]['typography'];
					foreach ( $props as $prop ) {
						if ( ! empty( $typography[ $prop ] ) && isset( $replace[ $typography[ $prop ] ] ) ) {
							$typography[ $prop ] = $replace[ $typography[ $prop ] ];
						}

						if ( ! ( 'inherit' !== $typography[ $prop ] && is_numeric( $typography[ $prop ] ) && in_array( intval( $typography[ $prop ] ), $valid, true ) ) ) {
							$typography[ $prop ] = 500;
						}
					}

					$preset['data'][ $device ]['typography'] = $typography;
					$presets[ $key ]                         = $preset;
				}
			}
		}

		CCBPresetGenerator::update_presets( $presets );
	}

	public static function calculator_woo_products_by_product() {
		$calculators = self::get_calculators();

		foreach ( $calculators as $calculator ) {
			$calc_settings = get_option( 'stm_ccb_form_settings_' . $calculator->ID );

			if ( isset( $calc_settings['woo_products'] ) && ! isset( $calc_settings['woo_products']['by_category'] ) ) {
				$calc_settings['woo_products']['by_category'] = true;
				$calc_settings['woo_products']['by_product']  = false;
				$calc_settings['woo_products']['product_ids'] = array();

				update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $calculator->ID ), apply_filters( 'stm_ccb_sanitize_array', $calc_settings ) );
			}
		}
	}

	public static function ccb_set_saved() {
		$calculators = self::get_calculators();

		foreach ( $calculators as $calculator ) {
			update_post_meta( $calculator->ID, 'calc_saved', true );
		}
	}


	public static function ccb_added_payment_gateways() {
		$default_general_settings = CCBSettingsData::general_settings_data();

		if ( ! empty( $default_general_settings ) ) {
			$general_settings = get_option( 'ccb_general_settings' );
			$update_data      = self::set_payment_gateway( $general_settings, $default_general_settings );
			update_option( 'ccb_general_settings', $update_data );
		}

		$calculators      = self::get_calculators();
		$default_settings = CCBSettingsData::settings_data();
		foreach ( $calculators as $calculator ) {
			$calc_settings = get_option( 'stm_ccb_form_settings_' . $calculator->ID );
			if ( ! empty( $calc_settings ) ) {
				if ( isset( $calc_settings['stripe']['use_in_all'] ) ) {
					unset( $calc_settings['stripe']['use_in_all'] );
				}
				$inner_update_data = self::set_payment_gateway( $calc_settings, $default_settings );

				update_option( 'stm_ccb_form_settings_' . $calculator->ID, $inner_update_data );
			}
		}
	}

	private static function set_payment_gateway( $settings, $default_settings ) {
		if ( ! isset( $settings['payment_gateway'] ) ) {
			$paypal_settings = $settings['paypal'];
			$stripe_settings = $settings['stripe'];
			$payment_gateway = $default_settings['payment_gateway'];

			$payment_gateway['paypal'] = $paypal_settings;

			if ( isset( $stripe_settings['enable'] ) ) {
				$payment_gateway['cards']['enable']                            = $stripe_settings['enable'];
				$payment_gateway['cards']['card_payments']['stripe']['enable'] = $stripe_settings['enable'];
			}

			if ( isset( $stripe_settings['use_in_all'] ) ) {
				$payment_gateway['cards']['use_in_all']                        = $stripe_settings['use_in_all'];
				$payment_gateway['cards']['card_payments']['stripe']['enable'] = $stripe_settings['use_in_all'];
			}

			$payment_gateway['cards']['card_payments']['stripe']['secretKey']  = $stripe_settings['secretKey'];
			$payment_gateway['cards']['card_payments']['stripe']['publishKey'] = $stripe_settings['publishKey'];
			$payment_gateway['cards']['card_payments']['stripe']['currency']   = $stripe_settings['currency'];

			if ( isset( $paypal_settings['formulas'] ) ) {
				$payment_gateway['formulas'] = $paypal_settings['formulas'];
			}

			if ( isset( $stripe_settings['formulas'] ) ) {
				$payment_gateway['formulas'] = $stripe_settings['formulas'];
			}

			$settings['payment_gateway'] = $payment_gateway;
			return $settings;
		}

		return $settings;
	}

	public static function ccb_update_payment_type_enum() {
		global $wpdb;
		$payment_table = Payments::_table();
		if ( $wpdb->get_var( $wpdb->prepare( 'SHOW COLUMNS FROM `%1s` LIKE %s;', $payment_table, 'type' ) ) ) { // phpcs:ignore
			$wpdb->query(
				$wpdb->prepare(
					"ALTER TABLE `%1s` MODIFY COLUMN `type` ENUM('paypal', 'stripe', 'woocommerce', 'cash_payment', 'twoCheckout', 'razorpay', 'no_payments') NOT NULL DEFAULT 'no_payments';", // phpcs:ignore
					$payment_table
				)
			);
		}
	}

	/**
	 * 3.1.80
	 * Add Terms and Conditions default settings to general settings
	 */
	public static function ccb_general_settings_terms_and_conditions_update() {
		$general_settings = get_option( 'ccb_general_settings' );

		if ( ! isset( $general_settings['form_fields']['terms_and_conditions'] ) ) {
			$general_settings['form_fields']['terms_use_in_all']                  = false;
			$general_settings['form_fields']['terms_and_conditions']['checkbox']  = false;
			$general_settings['form_fields']['terms_and_conditions']['text']      = 'By clicking this box, I agree to your';
			$general_settings['form_fields']['terms_and_conditions']['link']      = '';
			$general_settings['form_fields']['terms_and_conditions']['link_text'] = '';
			$general_settings['form_fields']['terms_and_conditions']['page_id']   = '';

			update_option( 'ccb_general_settings', apply_filters( 'calc_update_options', $general_settings ) );
		}

	}

	/**
	 * 3.1.80
	 * Add Terms and Conditions default settings to calculator settings
	 */
	public static function ccb_calculator_settings_terms_and_conditions_update() {
		$calculators = self::get_calculators();

		foreach ( $calculators as $calculator ) {
			$calc_settings = get_option( 'stm_ccb_form_settings_' . $calculator->ID );

			if ( ! isset( $calc_settings['formFields']['terms_and_conditions'] ) ) {
				$calc_settings['formFields']['accessTermsEmail']                  = false;
				$calc_settings['formFields']['terms_and_conditions']['checkbox']  = false;
				$calc_settings['formFields']['terms_and_conditions']['text']      = 'By clicking this box, I agree to your';
				$calc_settings['formFields']['terms_and_conditions']['link']      = '';
				$calc_settings['formFields']['terms_and_conditions']['link_text'] = '';
				$calc_settings['formFields']['terms_and_conditions']['page_id']   = '';

				$calc_settins['texts']['form_fields']['terms_and_conditions_field'] = 'Please, check out our terms and click on the checkbox';

				update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $calculator->ID ), apply_filters( 'stm_ccb_sanitize_array', $calc_settings ) );
			}
		}
	}
}
