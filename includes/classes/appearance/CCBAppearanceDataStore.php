<?php

namespace cBuilder\Classes\Appearance;

/**
 * Class CCBAppearanceDataStore
 * @package cBuilder\Classes\Appearance
 */
class CCBAppearanceDataStore {

	public function get_text_transform_options(): array {
		return array(
			'capitalize' => __( 'Capitalize', 'cost-calculator-builder' ),
			'uppercase'  => __( 'Uppercase', 'cost-calculator-builder' ),
			'lowercase'  => __( 'Lowercase', 'cost-calculator-builder' ),
			'none'       => __( 'None', 'cost-calculator-builder' ),
		);
	}

	public function get_box_style_option(): array {
		return array(
			'vertical'   => array(
				'label' => __( 'Vertical', 'cost-calculator-builder' ),
				'icon'  => 'ccb-icon-Union-26',
			),
			'horizontal' => array(
				'label' => __( 'Horizontal', 'cost-calculator-builder' ),
				'icon'  => 'ccb-icon-Union-25',
			),
			'two_column' => array(
				'label' => __( 'Two columns', 'cost-calculator-builder' ),
				'icon'  => 'ccb-icon-Union-27',
			),
		);
	}

	public function get_font_weight_options(): array {
		return array(
			'400'     => 'Regular (400)',
			'500'     => 'Medium (500)',
			'600'     => 'Bold (600)',
			'700'     => 'Bolder (700)',
			'inherit' => 'inherit',
		);
	}

	public function get_border_style_options(): array {
		return array(
			'dotted' => __( 'Dotted', 'cost-calculator-builder' ),
			'dashed' => __( 'Dashed', 'cost-calculator-builder' ),
			'solid'  => __( 'Solid', 'cost-calculator-builder' ),
			'double' => __( 'Double', 'cost-calculator-builder' ),
			'groove' => __( 'Groove', 'cost-calculator-builder' ),
			'ridge'  => __( 'Ridge', 'cost-calculator-builder' ),
			'inset'  => __( 'Inset', 'cost-calculator-builder' ),
			'outset' => __( 'Outset', 'cost-calculator-builder' ),
			'none'   => __( 'None', 'cost-calculator-builder' ),
			'hidden' => __( 'Hidden', 'cost-calculator-builder' ),
		);
	}

	public function get_description_position(): array {
		return array(
			'before' => __( 'Before field', 'cost-calculator-builder' ),
			'after'  => __( 'After field', 'cost-calculator-builder' ),
		);
	}
}
