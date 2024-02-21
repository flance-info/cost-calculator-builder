<?php

namespace cBuilder\Helpers;

use cBuilder\Classes\CCBProTemplate;
use cBuilder\Classes\CCBTemplate;

/**
 * Cost Calculator Fields Helper
 */
class CCBFieldsHelper {
	private static $file_field_formats = array( 'png', 'jpg/jpeg', 'gif', 'webp', 'svg', 'pdf', 'csv', 'doc/docx', 'ppt/pptx', 'pps/ppsx', 'odt', 'xls/xlsx', 'psd', 'key', 'mp3', 'm4a', 'ogg', 'wav', 'mp4', 'mov', 'avi', 'mpg', 'ogv', '3gp', '3g2', 'ai', 'cdr', 'rar', 'zip', 'dxf', 'dwg' );

	/**
	 * Field templates
	 * @return array
	 */
	public static function get_fields_templates() {
		$templates = array(
			'line'         => CCBTemplate::load( 'frontend/fields/cost-line' ),
			'html'         => CCBTemplate::load( 'frontend/fields/cost-html' ),
			'toggle'       => CCBTemplate::load( 'frontend/fields/cost-toggle' ),
			'text-area'    => CCBTemplate::load( 'frontend/fields/cost-text' ),
			'checkbox'     => CCBTemplate::load( 'frontend/fields/cost-checkbox' ),
			'quantity'     => CCBTemplate::load( 'frontend/fields/cost-quantity' ),
			'radio-button' => CCBTemplate::load( 'frontend/fields/cost-radio' ),
			'range-button' => CCBTemplate::load( 'frontend/fields/cost-range' ),
			'drop-down'    => CCBTemplate::load( 'frontend/fields/cost-drop-down' ),
			'total'        => CCBTemplate::load( 'frontend/fields/cost-total' ),
		);

		if ( ccb_pro_active() ) {
			$templates['group']                = CCBProTemplate::load( 'frontend/fields/cost-group' );
			$templates['repeater']             = CCBProTemplate::load( 'frontend/fields/cost-repeater' );
			$templates['date-picker']          = CCBProTemplate::load( 'frontend/fields/cost-date-picker' );
			$templates['time-picker']          = CCBProTemplate::load( 'frontend/fields/cost-time-picker' );
			$templates['multi-range']          = CCBProTemplate::load( 'frontend/fields/cost-multi-range' );
			$templates['file-upload']          = CCBProTemplate::load( 'frontend/fields/cost-file-upload' );
			$templates['radio-with-image']     = CCBProTemplate::load( 'frontend/fields/cost-radio-with-image' );
			$templates['checkbox-with-image']  = CCBProTemplate::load( 'frontend/fields/cost-checkbox-with-image' );
			$templates['drop-down-with-image'] = CCBProTemplate::load( 'frontend/fields/cost-drop-down-with-image' );
		}

		return $templates;
	}

	/**
	 * Get all possible fields
	 * @return array
	 */
	public static function fields() {
		return array(
			array(
				'name'        => __( 'Text field', 'cost-calculator-builder' ),
				'alias'       => 'text-area',
				'type'        => 'text-area',
				'tag'         => 'cost-text',
				'icon'        => 'ccb-icon-Subtraction-7',
				'description' => __( 'Text field', 'cost-calculator-builder' ),
				'sort_type'   => 'type',
			),
			array(
				'name'        => __( 'Quantity field', 'cost-calculator-builder' ),
				'alias'       => 'quantity',
				'type'        => 'quantity',
				'tag'         => 'cost-quantity',
				'icon'        => 'ccb-icon-Subtraction-6',
				'description' => __( 'Quantity field', 'cost-calculator-builder' ),
				'sort_type'   => 'type',
			),
			array(
				'name'        => __( 'Dropdown list', 'cost-calculator-builder' ),
				'alias'       => 'drop-down',
				'type'        => 'drop-down',
				'tag'         => 'cost-drop-down',
				'icon'        => 'ccb-icon-dropdown-2',
				'description' => __( 'Dropdown list', 'cost-calculator-builder' ),
				'sort_type'   => 'selection',
			),
			array(
				'name'        => __( 'Image dropdown', 'cost-calculator-builder' ),
				'alias'       => 'drop-down-with-image',
				'type'        => 'drop-down-with-image',
				'tag'         => 'cost-drop-down-with-image',
				'icon'        => 'ccb-icon-dropdown-2',
				'description' => __( 'Image dropdown', 'cost-calculator-builder' ),
				'sort_type'   => 'selection',
			),
			array(
				'name'        => __( 'Radio select', 'cost-calculator-builder' ),
				'alias'       => 'radio',
				'type'        => 'radio-button',
				'tag'         => 'cost-radio',
				'icon'        => 'ccb-icon-Path-3511',
				'description' => __( 'Radio select', 'cost-calculator-builder' ),
				'sort_type'   => 'selection',
			),
			array(
				'name'        => __( 'Image radio', 'cost-calculator-builder' ),
				'alias'       => 'radio-with-image',
				'type'        => 'radio-with-image',
				'tag'         => 'cost-radio-with-image',
				'icon'        => 'ccb-icon-Path-3511',
				'description' => __( 'Image radio', 'cost-calculator-builder' ),
				'sort_type'   => 'selection',
			),
			array(
				'name'        => __( 'Switch toggle', 'cost-calculator-builder' ),
				'alias'       => 'toggle',
				'type'        => 'toggle',
				'tag'         => 'cost-toggle',
				'icon'        => 'ccb-icon-Path-3515',
				'description' => __( 'Switch toggle', 'cost-calculator-builder' ),
				'sort_type'   => 'checkbox',
			),
			array(
				'name'        => __( 'Checkbox', 'cost-calculator-builder' ),
				'alias'       => 'checkbox',
				'type'        => 'checkbox',
				'tag'         => 'cost-checkbox',
				'icon'        => 'ccb-icon-Path-3512',
				'description' => __( 'Checkbox', 'cost-calculator-builder' ),
				'sort_type'   => 'checkbox',
			),
			array(
				'name'        => __( 'Image checkbox', 'cost-calculator-builder' ),
				'alias'       => 'checkbox-with-image',
				'type'        => 'checkbox-with-image',
				'tag'         => 'cost-checkbox-with-image',
				'icon'        => 'ccb-icon-Path-3512',
				'description' => __( 'Image checkbox', 'cost-calculator-builder' ),
				'sort_type'   => 'checkbox',
			),
			array(
				'name'        => __( 'Date picker', 'cost-calculator-builder' ),
				'alias'       => 'datepicker',
				'type'        => 'date-picker',
				'tag'         => 'date-picker',
				'icon'        => 'ccb-icon-Path-3513',
				'description' => __( 'Date picker', 'cost-calculator-builder' ),
				'sort_type'   => 'date',
			),
			array(
				'name'        => __( 'Time picker', 'cost-calculator-builder' ),
				'alias'       => 'timepicker',
				'type'        => 'time-picker',
				'tag'         => 'time-picker',
				'icon'        => 'ccb-icon-ccb_time_picker',
				'description' => __( 'Time picker', 'cost-calculator-builder' ),
				'sort_type'   => 'date',
			),
			array(
				'name'        => __( 'Basic slider', 'cost-calculator-builder' ),
				'alias'       => 'range',
				'type'        => 'range-button',
				'tag'         => 'cost-range',
				'icon'        => 'ccb-icon-Union-5',
				'description' => __( 'Basic slider', 'cost-calculator-builder' ),
				'sort_type'   => 'slider',
			),
			array(
				'name'        => __( 'Multi range', 'cost-calculator-builder' ),
				'alias'       => 'multi-range',
				'type'        => 'multi-range',
				'tag'         => 'cost-multi-range',
				'icon'        => 'ccb-icon-Union-6',
				'description' => __( 'Multi range', 'cost-calculator-builder' ),
				'sort_type'   => 'slider',
			),
			array(
				'name'        => __( 'File upload', 'cost-calculator-builder' ),
				'alias'       => 'file-upload',
				'type'        => 'file-upload',
				'tag'         => 'cost-file-upload',
				'icon'        => 'ccb-icon-Path-2572',
				'description' => __( 'File upload', 'cost-calculator-builder' ),
				'formats'     => self::get_file_field_format_based_on_permission(),
				'sort_type'   => 'other',
			),
			array(
				'name'        => __( 'Html element', 'cost-calculator-builder' ),
				'alias'       => 'html',
				'type'        => 'html',
				'tag'         => 'cost-html',
				'icon'        => 'ccb-icon-Path-3517',
				'description' => __( 'Html element', 'cost-calculator-builder' ),
				'sort_type'   => 'other',
			),
			array(
				'name'        => __( 'Repeater', 'cost-calculator-builder' ),
				'alias'       => 'repeater',
				'type'        => 'repeater',
				'tag'         => 'cost-repeater-field',
				'icon'        => 'ccb-icon-repeater',
				'description' => __( 'Repeater Field', 'cost-calculator-builder' ),
				'sort_type'   => 'grouping',
			),
			array(
				'name'        => __( 'Section (Group)', 'cost-calculator-builder' ),
				'alias'       => 'group',
				'type'        => 'group',
				'tag'         => 'cost-group-field',
				'icon'        => 'ccb-icon-group-element',
				'description' => __( 'Group Field', 'cost-calculator-builder' ),
				'sort_type'   => 'grouping',
			),
			array(
				'name'        => __( 'Divider (line)', 'cost-calculator-builder' ),
				'alias'       => 'line',
				'type'        => 'line',
				'tag'         => 'cost-line',
				'icon'        => 'ccb-icon-Path-3518',
				'description' => __( 'Divider', 'cost-calculator-builder' ),
				'sort_type'   => 'grouping',
			),
			array(
				'name'        => __( 'Formula', 'cost-calculator-builder' ),
				'alias'       => 'total',
				'type'        => 'total',
				'tag'         => 'cost-total',
				'icon'        => 'ccb-icon-Path-3516',
				'description' => __( 'Formula', 'cost-calculator-builder' ),
				'sort_type'   => 'other',
			),
		);
	}

	private static function get_file_field_format_based_on_permission() {
		/** check is allowed all */
		if ( defined( 'ALLOW_UNFILTERED_UPLOADS' ) && ALLOW_UNFILTERED_UPLOADS !== false ) {
			return self::$file_field_formats;
		}

		/** check with wp allowed mime types */
		if ( ! function_exists( 'wp_get_current_user' ) ) {
			include ABSPATH . 'wp-includes/pluggable.php';
		}

		$allowed_file_mime_types = get_allowed_mime_types();
		$allowed_file_types      = array_keys( $allowed_file_mime_types );

		$allowed_types = array();
		foreach ( $allowed_file_types as $type ) {
			$allowed_types = array_merge( $allowed_types, explode( '|', $type ) );
		}

		foreach ( self::$file_field_formats as $field_format ) {
			$allowed = true;
			foreach ( explode( '/', $field_format ) as $sub_type ) {
				if ( ! in_array( $sub_type, $allowed_types, true ) ) {
					$allowed = false;
				}
			}

			$key = array_search( $field_format, self::$file_field_formats, true );
			if ( ! $allowed && false !== $key ) {
				unset( self::$file_field_formats[ $key ] );
			}
		}
		return self::$file_field_formats;
	}
}
