<?php

namespace cBuilder\Classes;

class CCBTranslations {

	/**
	 * Frontend Translation Data
	 * @return array
	 */
	public static function get_frontend_translations() {

		$translations = array(
			'empty_end_date_error'   => esc_html__( 'Please select the second date', 'cost-calculator-builder' ),
			'wrong_date_range_error' => esc_html__( 'Please select correct date range values', 'cost-calculator-builder' ),
			'empty_end_time_error'   => esc_html__( 'Please select the second time', 'cost-calculator-builder' ),
			'required_field'         => esc_html__( 'This field is required', 'cost-calculator-builder' ),
			'select_date_range'      => esc_html__( 'Select Date Range', 'cost-calculator-builder' ),
			'select_date'            => esc_html__( 'Select Date', 'cost-calculator-builder' ),
			'high_end_date_error'    => esc_html__( 'To date must be greater than from date', 'cost-calculator-builder' ),
			'high_end_multi_range'   => esc_html__( 'To value must be greater than from value', 'cost-calculator-builder' ),
			'wrong_file_url'         => esc_html__( 'Wrong file url', 'cost-calculator-builder' ),
			'big_file_size'          => esc_html__( 'File size is too big', 'cost-calculator-builder' ),
			'wrong_file_format'      => esc_html__( 'Wrong file format', 'cost-calculator-builder' ),
			'form_no_payment'        => esc_html__( 'No Payment', 'cost-calculator-builder' ),
			'min_higher_max'         => esc_html__( 'Max value must be greater than min value', 'cost-calculator-builder' ),
			'must_be_between'        => esc_html__( 'Value must be between min and max values', 'cost-calculator-builder' ),
			'must_be_greater_min'    => esc_html__( 'Value can\'t be less than min value', 'cost-calculator-builder' ),
			'must_be_less_max'       => esc_html__( 'Value can\'t be greater than max value', 'cost-calculator-builder' ),
			'days'                   => esc_html__( 'days', 'cost-calculator-builder' ),
			'files'                  => esc_html__( 'file(s)', 'cost-calculator-builder' ),

		);

		return $translations;
	}

	public static function get_backend_translations() {
		$translations = array(
			'bulk_action_attention'    => esc_html__( 'Are you sure to "%s" choosen Calculators?', 'cost-calculator-builder' ),
			'copied'                   => esc_html__( 'Copied', 'cost-calculator-builder' ),
			'not_selected_calculators' => esc_html__( 'No calculators were selected', 'cost-calculator-builder' ),
			'select_bulk'              => esc_html__( 'Select bulk action', 'cost-calculator-builder' ),
			'changes_saved'            => esc_html__( 'Changes Saved', 'cost-calculator-builder' ),
			'calculator_deleted'       => esc_html__( 'Calculator Deleted', 'cost-calculator-builder' ),
			'calculator_duplicated'    => esc_html__( 'Calculator Duplicated', 'cost-calculator-builder' ),
			'condition_link_saved'     => esc_html__( 'Condition Link Saved', 'cost-calculator-builder' ),
			'required_field'           => esc_html__( 'This field is required', 'cost-calculator-builder' ),
			'delete_order_info'        => esc_html__( 'You are going to delete order', 'cost-calculator-builder' ),
			'success_deleted'          => esc_html__( 'Items successfully deleted', 'cost-calculator-builder' ),
			'not_selected'             => esc_html__( 'Please choose at least one value', 'cost-calculator-builder' ),
			'select_image'             => esc_html__( 'Select Image', 'cost-calculator-builder' ),
			'find_element'             => esc_html__( 'Find Element', 'cost-calculator-builder' ),
			'enter_title'              => esc_html__( 'Enter title', 'cost-calculator-builder' ),
			'no_element'               => esc_html__( 'No elements on  canvas', 'cost-calculator-builder' ),
			'all_in_canvas'            => esc_html__( 'All', 'cost-calculator-builder' ),
			'triggers_other_field'     => esc_html__( 'Impact other fields', 'cost-calculator-builder' ),
			'affects_by_other_field'   => esc_html__( 'Affected by other fields', 'cost-calculator-builder' ),
			'format_error'             => sprintf( '%s <br> %s', __( 'File format is not supported.', 'cost-calculator-builder' ), __( 'Supported file formats: JPG, PNG', 'cost-calculator-builder' ) ),
		);

		return $translations;
	}
}
