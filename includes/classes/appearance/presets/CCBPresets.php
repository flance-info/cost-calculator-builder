<?php

namespace cBuilder\Classes\Appearance\Presets;

/**
 * Class CCBPresets
 * @package cBuilder\Classes\Appearance\Presets
 */
class CCBPresets {
	private $field;

	/**
	 * CCBPresets constructor.
	 * @param mixed $preset_key
	 */
	public function __construct( $preset_key ) {
		$this->field = new CCBPresetGenerator( $preset_key );
	}

	/**
	 * @return array[]
	 */
	public function calc_preset_data( $preset_key ): array {
		return array(
			'desktop'    => $this->field->generate_desktop_data(),
			'mobile'     => $this->field->generate_mobile_data(),
			'preset_key' => $preset_key,
		);
	}

	/**
	 * @return array
	 */
	public function calc_presets_list(): array {
		$presets         = $this->field->get_preset_from_db();
		$preset_data     = array();
		$default_presets = CCBPresetGenerator::default_presets();

		foreach ( $presets as $preset ) {
			$default_presets[] = $preset;
		}

		foreach ( $default_presets as $preset ) {
			if ( isset( $preset['title'] ) ) {
				$preset_data[] = array(
					'title'     => $preset['title'],
					'key'       => $preset['key'],
					'image'     => $preset['image'],
					'box_style' => $preset['data']['desktop']['layout']['box_style'] ?? 'vertical',
				);
			}
		}

		$preset_data[] = array(
			'title'     => __( 'Custom', 'cost-calculator-builder' ),
			'key'       => 'custom',
			'image'     => array(
				'vertical'   => CALC_URL . '/frontend/dist/img/appearance/theme-custom.png',
				'horizontal' => CALC_URL . '/frontend/dist/img/appearance/theme-custom.png',
				'two_column' => CALC_URL . '/frontend/dist/img/appearance/theme-custom.png',
			),
			'box_style' => 'vertical',
		);

		return $preset_data;
	}
}
