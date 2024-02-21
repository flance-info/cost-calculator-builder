<?php

namespace cBuilder\Helpers;

/**
 * Cost Calculator Conditions Helper
 * field nodes/links etc
 */


class CCBConditionsHelper {

	/** ALL FIELDS
	 * 'checkbox','datepicker','dropDown', 'dropDown_with_img', 'html', 'checkbox_with_img'
	 * 'line', 'multi_range', 'quantity', 'radio', 'radio_with_img'
	 * 'range', 'range_datePicker', 'text',
	 * 'toggle', 'total', 'file_upload_with_price', 'file_upload'
	 */

	public static $conditionStates = array(
		array(
			'title'  => 'Is selected',
			'value'  => '==',
			'fields' => array( 'dropDown', 'radio', 'dropDown_with_img', 'radio_with_img' ),
		),
		array(
			'title'  => 'Is selected (value)',
			'value'  => '==',
			'fields' => array( 'checkbox', 'checkbox_with_img', 'toggle' ),
		),
		array(
			'title'  => 'Is selected (label(s))',
			'value'  => 'in',
			'fields' => array( 'checkbox', 'toggle', 'checkbox_with_img' ),
		),
		array(
			'title'  => 'Is selected (option)',
			'value'  => 'contains',
			'fields' => array( 'checkbox', 'toggle', 'checkbox_with_img' ),
		),
		array(
			'title'  => 'Is not selected (label(s))',
			'value'  => 'not in',
			'fields' => array( 'checkbox', 'toggle', 'checkbox_with_img' ),
		),
		array(
			'title'  => 'Is equal to',
			'value'  => '==',
			'fields' => array( 'multi_range', 'quantity', 'range', 'range_datePicker', 'range_timePicker', 'total', 'file_upload_with_price' ),
		),
		array(
			'title'  => 'Is less than',
			'value'  => '<=',
			'fields' => array( 'checkbox', 'dropDown', 'dropDown_with_img', 'checkbox_with_img', 'radio_with_img', 'multi_range', 'quantity', 'radio', 'range', 'range_datePicker', 'toggle', 'total', 'file_upload_with_price' ),
		),
		array(
			'title'  => 'Is greater than',
			'value'  => '>=',
			'fields' => array( 'checkbox', 'dropDown', 'dropDown_with_img', 'checkbox_with_img', 'radio_with_img', 'multi_range', 'quantity', 'radio', 'range', 'range_datePicker', 'toggle', 'total', 'file_upload_with_price' ),
		),
		array(
			'title'  => 'Is not equal to',
			'value'  => '!=',
			'fields' => array( 'checkbox', 'dropDown', 'dropDown_with_img', 'checkbox_with_img', 'radio_with_img', 'multi_range', 'quantity', 'radio', 'range', 'range_datePicker', 'toggle', 'total', 'file_upload_with_price' ),
		),
	);

	public static $actions = array(
		array(
			'title'     => 'Show',
			'value'     => 'show',
			'flex_grow' => '0',
			'fields'    => array( 'checkbox', 'datePicker', 'timePicker', 'dropDown', 'dropDown_with_img', 'checkbox_with_img', 'radio_with_img', 'html', 'line', 'multi_range', 'quantity', 'radio', 'range', 'range_datePicker', 'text', 'toggle', 'total', 'file_upload', 'file_upload_with_price', 'group' ),
		),
		array(
			'title'     => 'Hide',
			'value'     => 'hide',
			'flex_grow' => '0',
			'fields'    => array( 'checkbox', 'datePicker', 'timePicker', 'dropDown', 'dropDown_with_img', 'checkbox_with_img', 'radio_with_img', 'html', 'line', 'multi_range', 'quantity', 'radio', 'range', 'range_datePicker', 'text', 'toggle', 'total', 'file_upload', 'file_upload_with_price', 'group' ),
		),
		array(
			'title'     => 'Hide (leave in Total)',
			'value'     => 'hide_leave_in_total',
			'flex_grow' => '0',
			'fields'    => array( 'checkbox', 'datePicker', 'timePicker', 'dropDown', 'dropDown_with_img', 'checkbox_with_img', 'radio_with_img', 'multi_range', 'quantity', 'radio', 'range', 'range_datePicker', 'toggle' ),
		),
		array(
			'title'     => 'Disable',
			'value'     => 'disable',
			'flex_grow' => '0',
			'fields'    => array( 'checkbox', 'datePicker', 'timePicker', 'dropDown', 'dropDown_with_img', 'checkbox_with_img', 'radio_with_img', 'multi_range', 'quantity', 'radio', 'range', 'range_datePicker', 'toggle' ),
		),
		array(
			'title'     => 'Unset',
			'value'     => 'unset',
			'flex_grow' => '0',
			'fields'    => array( 'checkbox', 'datePicker', 'timePicker', 'dropDown', 'dropDown_with_img', 'checkbox_with_img', 'radio_with_img', 'quantity', 'radio', 'range_datePicker', 'toggle' ),
		),
		array(
			'title'     => 'Set value',
			'value'     => 'set_value',
			'flex_grow' => '1',
			'fields'    => array( 'quantity', 'range', 'file_upload', 'file_upload_with_price' ),
		),
		array(
			'title'     => 'Set value and disable',
			'value'     => 'set_value_and_disable',
			'flex_grow' => '1',
			'fields'    => array( 'quantity', 'range' ),
		),

		/** new actions */
		array(
			'title'     => 'Select option',
			'value'     => 'select_option',
			'flex_grow' => '1',
			'fields'    => array( 'checkbox', 'toggle', 'dropDown', 'dropDown_with_img', 'checkbox_with_img', 'radio_with_img', 'radio' ),
		),
		array(
			'title'     => 'Select option and disable',
			'value'     => 'select_option_and_disable',
			'flex_grow' => '1',
			'fields'    => array( 'checkbox', 'toggle', 'dropDown', 'dropDown_with_img', 'checkbox_with_img', 'radio_with_img', 'radio' ),
		),
		array(
			'title'     => 'Set date',
			'value'     => 'set_date',
			'flex_grow' => '1',
			'fields'    => array( 'datePicker' ),
		),
		array(
			'title'     => 'Set date and disable',
			'value'     => 'set_date_and_disable',
			'flex_grow' => '1',
			'fields'    => array( 'datePicker' ),
		),
		array(
			'title'     => 'Set time',
			'value'     => 'set_time',
			'flex_grow' => '1',
			'fields'    => array( 'timePicker' ),
		),
		array(
			'title'     => 'Set time and disable',
			'value'     => 'set_time_and_disable',
			'flex_grow' => '1',
			'fields'    => array( 'timePicker' ),
		),
		array(
			'title'     => 'Set period',
			'value'     => 'set_period',
			'flex_grow' => '2',
			'fields'    => array( 'multi_range', 'range_datePicker', 'range_timePicker' ),
		),
		array(
			'title'     => 'Set period and disable',
			'value'     => 'set_period_and_disable',
			'flex_grow' => '2',
			'fields'    => array( 'multi_range', 'range_datePicker', 'range_timePicker' ),
		),
	);

	public static function getActions() {
		return self::$actions;
	}

	public static function getConditionStates() {
		return self::$conditionStates;
	}

	/**
	 * @param $calculatorList
	 * update calculator posts, post meta
	 * use action['value'] besides action.title in code
	 */
	public static function updateConditionActions( $calculatorList ) {

		$isNeedToUpdate          = false;
		$selectTypeActionReplace = array(
			'Set value'             => 'select_option',
			'Set value and disable' => 'select_option_and_disable',
		);

		foreach ( $calculatorList as $calculator ) {

			$fields               = get_post_meta( $calculator->ID, 'stm-fields', true );
			$calculatorConditions = get_post_meta( $calculator->ID, 'stm-conditions', true );

			/** if no conditions */
			if ( ! array_key_exists( 'links', $calculatorConditions ) ) {
				continue;
			}

			foreach ( $calculatorConditions['links'] as $linkKey => $nodeLink ) {
				foreach ( $nodeLink['condition'] as $conditionKey => $condition ) {

					$actionKey = array_search( $condition['action'], array_column( self::$actions, 'title' ), true );

					if ( false !== $actionKey ) {
						$isNeedToUpdate = true;
						$optionToType   = preg_replace( '/_field_id.*/', '', $condition['optionTo'] );
						$newActionValue = self::$actions[ $actionKey ]['value'];

						if ( in_array( $optionToType, array( 'dropDown', 'radio', 'radio_with_img', 'dropDown_with_img' ), true ) && array_key_exists( $condition['action'], $selectTypeActionReplace ) ) {
							$newActionValue = $selectTypeActionReplace[ $condition['action'] ];
							$toFieldKey     = array_search( $condition['optionTo'], array_column( $fields, 'alias' ), true );

							// search option by value to
							$valueKey = array_search( $condition['setVal'], array_column( $fields[ $toFieldKey ]['options'], 'optionValue' ), true );
							/** set value key as value, based on new logic */
							$calculatorConditions['links'][ $linkKey ]['condition'][ $conditionKey ]['setVal'] = (int) $valueKey;
						}

						$calculatorConditions['links'][ $linkKey ]['condition'][ $conditionKey ]['action'] = $newActionValue;
					}
				}
			}

			if ( $isNeedToUpdate ) {
				update_post_meta( $calculator->ID, 'stm-conditions', apply_filters( 'stm_ccb_sanitize_array', $calculatorConditions ) );
			}
		}
	}

	/**
	 * @param $calculatorList
	 * used to update coordinates in version 2.2.4
	 */
	public static function recalculateCoordinates( $calculatorList ) {
		foreach ( $calculatorList as $calculator ) {
			$calculatorConditions = get_post_meta( $calculator->ID, 'stm-conditions', true );

			/** if no conditions */
			if ( is_array( $calculatorConditions ) && ! array_key_exists( 'links', $calculatorConditions ) ) {
				continue;
			}

			$oldLogicXValues = array_filter(
				array_column(
					$calculatorConditions['nodes'],
					'x'
				),
				function ( $value ) {
					return ( $value < 0 || $value > 1160 );
				}
			);

			$oldLogicYValues = array_filter(
				array_column(
					$calculatorConditions['nodes'],
					'y'
				),
				function ( $value ) {
					return ( $value < 0 || $value > 437 );
				}
			);

			$isNeedRecalculateCoordinates = count( array_merge( $oldLogicXValues, $oldLogicYValues ) ) > 0;
			$isExistTarget                = count( array_column( $calculatorConditions['links'], 'target' ) ) > 0;

			if ( $isExistTarget ) {
				continue;
			}

			if ( $isNeedRecalculateCoordinates ) {
				foreach ( $calculatorConditions['nodes'] as $key => $node ) {
					$x = 1024 + (float) $node['x'];
					if ( $x < 7 ) {
						$x = 7;
					}

					$y = 140 + (float) $node['y'];
					if ( $y < 7 ) {
						$y = 7;
					}

					if ( $y > 438 ) {
						$y = 438;
					}

					$calculatorConditions['nodes'][ $key ]['y'] = $y;
					$calculatorConditions['nodes'][ $key ]['x'] = $x;
				}
			}

			foreach ( $calculatorConditions['links'] as $linkKey => $nodeLink ) {

				$fromNodeKey = array_search( $nodeLink['from'], array_column( $calculatorConditions['nodes'], 'id' ), true );
				$toNodeKey   = array_search( $nodeLink['to'], array_column( $calculatorConditions['nodes'], 'id' ), true );

				$calculatorConditions['links'][ $linkKey ]['target'] = array(
					'class_name' => 'node-output-point right side',
					'x'          => (float) $calculatorConditions['nodes'][ $fromNodeKey ]['x'] + 165,
					'y'          => (float) $calculatorConditions['nodes'][ $fromNodeKey ]['y'] + 29,
				);

				$calculatorConditions['links'][ $linkKey ]['input_coordinates'] = array(
					'x' => (float) $calculatorConditions['nodes'][ $toNodeKey ]['x'],
					'y' => (float) $calculatorConditions['nodes'][ $toNodeKey ]['y'] + 29,
				);
			}
			update_post_meta( $calculator->ID, 'stm-conditions', apply_filters( 'stm_ccb_sanitize_array', $calculatorConditions ) );
		}

	}
}
