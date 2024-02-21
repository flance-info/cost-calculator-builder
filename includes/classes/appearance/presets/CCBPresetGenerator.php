<?php

namespace cBuilder\Classes\Appearance\Presets;

use cBuilder\Classes\Appearance\CCBAppearanceDataStore;
use cBuilder\Classes\Appearance\CCBAppearanceTypeGenerator;

class CCBPresetGenerator {

	private $type;
	private $store;
	private $preset_data;

	public function __construct( $key ) {
		$this->type        = new CCBAppearanceTypeGenerator();
		$this->store       = new CCBAppearanceDataStore();
		$this->preset_data = $this->get_preset_by_key( $key );
	}

	/**
	 * @return array
	 */
	public function generate_mobile_data(): array {
		return array(
			'typography'            => $this->get_typography( $this->get_preset_data( 'mobile', 'typography' ) ),
			'elements_sizes'        => $this->get_elements_sizes( $this->get_preset_data( 'mobile', 'elements_sizes' ), true ),
			'spacing_and_positions' => $this->get_spacing_and_positions( $this->get_preset_data( 'mobile', 'spacing_and_positions' ) ),
		);
	}

	/**
	 * @return array
	 */
	public function generate_desktop_data(): array {
		$shadows_default = array(
			'container_shadow' => self::get_shadows_default(),
		);

		return array(
			'layout'                => $this->get_layout( $this->get_preset_data( 'desktop', 'layout' ) ),
			'colors'                => $this->get_colors( $this->get_preset_data( 'desktop', 'colors' ) ),
			'typography'            => $this->get_typography( $this->get_preset_data( 'desktop', 'typography' ) ),
			'borders'               => $this->get_borders( $this->get_preset_data( 'desktop', 'borders' ) ),
			'shadows'               => $this->get_shadows( $this->get_preset_data( 'desktop', 'shadows', $shadows_default ) ),
			'elements_sizes'        => $this->get_elements_sizes( $this->get_preset_data( 'desktop', 'elements_sizes' ) ),
			'spacing_and_positions' => $this->get_spacing_and_positions( $this->get_preset_data( 'desktop', 'spacing_and_positions' ), true ),
			'others'                => $this->get_others( $this->get_preset_data( 'desktop', 'others' ) ),
		);
	}

	public function get_shadows( $data ): array {
		return array(
			'label' => __( 'Shadows', 'cost-calculator-builder' ),
			'name'  => 'shadows',
			'data'  => array(
				'container_shadow' => $this->type->get_shadow_field( __( 'Container shadow', 'cost-calculator-builder' ), 'container_shadow', $data['container_shadow']['color'], $data['container_shadow']['blur'], $data['container_shadow']['x'], $data['container_shadow']['y'], 'col-12' ),
			),
		);
	}

	/**
	 * @param $data
	 * @return array
	 */
	public function get_borders( $data ): array {
		return array(
			'label' => __( 'Borders', 'cost-calculator-builder' ),
			'name'  => 'borders',
			'data'  => array(
				'container_border' => $this->type->get_border_field( __( 'Container border', 'cost-calculator-builder' ), 'container_border', $data['container_border']['type'], $data['container_border']['width'], $data['container_border']['radius'], 'col-12' ),
				'fields_border'    => $this->type->get_border_field( __( 'Fields border', 'cost-calculator-builder' ), 'fields_border', $data['fields_border']['type'], $data['fields_border']['width'], $data['fields_border']['radius'], 'col-12' ),
				'button_border'    => $this->type->get_border_field( __( 'Button border', 'cost-calculator-builder' ), 'button_border', $data['button_border']['type'], $data['button_border']['width'], $data['button_border']['radius'], 'col-12' ),
			),
		);
	}

	/**
	 * @param $data
	 * @return array
	 */
	public function get_colors( $data ): array {
		$svg_color = $data['svg_color'] ?? 0;
		return array(
			'label' => __( 'Colors', 'cost-calculator-builder' ),
			'name'  => 'colors',
			'data'  => array(
				'container'       => $this->type->get_container_background( __( 'Container', 'cost-calculator-builder' ), 'container', $data['container'], 'col-12' ),
				'primary_color'   => $this->type->get_color_field( __( 'Text color', 'cost-calculator-builder' ), 'primary_color', $data['primary_color'], 'col-6' ),
				'accent_color'    => $this->type->get_color_field( __( 'Accent (button & pickers)', 'cost-calculator-builder' ), 'accent_color', $data['accent_color'], 'col-6' ),
				'secondary_color' => $this->type->get_color_field( __( 'Form fields', 'cost-calculator-builder' ), 'secondary_color', $data['secondary_color'], 'col-6' ),
				'error_color'     => $this->type->get_color_field( __( 'Error Color', 'cost-calculator-builder' ), 'error_color', $data['error_color'], 'col-6' ),
				'svg_color'       => $this->type->get_toggle_field( __( 'Apply accent color to SVG icons', 'cost-calculator-builder' ), 'svg_color', $svg_color, 'col-12' ),
			),
		);
	}

	/**
	 * @param $data
	 * @param false $description
	 * @return array
	 */
	public function get_spacing_and_positions( $data, bool $description = false ): array {
		$result = array(
			'label' => __( 'Spacing & Positions', 'cost-calculator-builder' ),
			'name'  => 'spacing_and_positions',
			'data'  => array(
				'field_side_indents' => $this->type->get_number_type_field( __( 'Field side indent', 'cost-calculator-builder' ), 'field_side_indents', 0, 100, 1, $data['field_side_indents'], 'px', 'col-6' ),
				'field_spacing'      => $this->type->get_number_type_field( __( 'Field spacing (px)', 'cost-calculator-builder' ), 'field_spacing', 0, 100, 1, $data['field_spacing'], 'px', 'col-6' ),
				'container_margin'   => $this->type->get_indent_field( __( 'Container margin (px)', 'cost-calculator-builder' ), 'container_margin', $data['container_margin'], 'col-12' ),
				'container_padding'  => $this->type->get_indent_field( __( 'Container padding (px)', 'cost-calculator-builder' ), 'container_padding', $data['container_padding'], 'col-12' ),
			),
		);

		if ( $description ) {
			$result['data']['description_position'] = $this->type->get_select_field( __( 'Description position', 'cost-calculator-builder' ), 'description_position', $data['description_position'], $this->store->get_description_position(), 'col-12' );
		}

		return $result;
	}

	/**
	 * @param $data
	 * @return array
	 */
	public function get_elements_sizes( $data, $is_mobile = false ): array {
		$result = array(
			'label' => __( 'Sizes', 'cost-calculator-builder' ),
			'name'  => 'elements_sizes',
			'data'  => array(
				'field_and_buttons_height' => $this->type->get_number_type_field( __( 'Field & button height (px)', 'cost-calculator-builder' ), 'field_and_buttons_height', 0, 100, 1, $data['field_and_buttons_height'], 'px', 'col-6' ),
			),
		);

		if ( ! $is_mobile ) {
			$result['data']['container_vertical_max_width']   = $this->type->get_number_type_field( __( 'Vertical max-width (px)', 'cost-calculator-builder' ), 'container_vertical_max_width', 0, 2000, 1, $data['container_vertical_max_width'], 'px', 'col-6' );
			$result['data']['container_horizontal_max_width'] = $this->type->get_number_type_field( __( 'Horizontal max-width (px)', 'cost-calculator-builder' ), 'container_horizontal_max_width', 0, 2000, 1, $data['container_horizontal_max_width'], 'px', 'col-6' );
			$result['data']['container_two_column_max_width'] = $this->type->get_number_type_field( __( 'Two columns max-width (px)', 'cost-calculator-builder' ), 'container_two_column_max_width', 0, 2000, 1, $data['container_two_column_max_width'], 'px', 'col-6' );
		}

		return $result;
	}

	public function get_layout( $data ) : array {
		return array(
			'label' => __( 'Layout', 'cost-calculator-builder' ),
			'name'  => 'layout',
			'data'  => array(
				'box_style' => $this->type->get_layout_field( '', 'box_style', $data['box_style'], $this->store->get_box_style_option(), 'col-12' ),
			),
		);
	}

	/**
	 * @param $data
	 * @return array|null
	 */
	public function get_typography( $data ) : array {
		return array(
			'label' => __( 'Typography', 'cost-calculator-builder' ),
			'name'  => 'typography',
			'data'  => array(
				'header_font_size'           => $this->type->get_number_type_field( __( 'Header text', 'cost-calculator-builder' ), 'header_font_size', 0, 100, 1, $data['header_font_size'], 'px', 'col-6' ),
				'header_font_weight'         => $this->type->get_select_field( '', 'header_font_weight', $data['header_font_weight'], $this->store->get_font_weight_options(), 'col-6' ),
				'label_font_size'            => $this->type->get_number_type_field( __( 'Label text (form labels)', 'cost-calculator-builder' ), 'label_font_size', 0, 100, 1, $data['label_font_size'], 'px', 'col-6' ),
				'label_font_weight'          => $this->type->get_select_field( '', 'label_font_weight', $data['label_font_weight'], $this->store->get_font_weight_options(), 'col-6' ),
				'description_font_size'      => $this->type->get_number_type_field( __( 'Description', 'cost-calculator-builder' ), 'description_font_size', 0, 100, 1, $data['description_font_size'], 'px', 'col-6' ),
				'description_font_weight'    => $this->type->get_select_field( '', 'description_font_weight', $data['description_font_weight'], $this->store->get_font_weight_options(), 'col-6' ),
				'summary_header_size'        => $this->type->get_number_type_field( __( 'Summary header', 'cost-calculator-builder' ), 'summary_header_size', 0, 100, 1, $data['summary_header_size'], 'px', 'col-6' ),
				'summary_header_font_weight' => $this->type->get_select_field( '', 'summary_header_font_weight', $data['summary_header_font_weight'], $this->store->get_font_weight_options(), 'col-6' ),
				'total_field_font_size'      => $this->type->get_number_type_field( __( 'Summary text', 'cost-calculator-builder' ), 'total_field_font_size', 0, 100, 1, $data['total_field_font_size'], 'px', 'col-4' ),
				'total_field_font_weight'    => $this->type->get_select_field( '', 'total_field_font_weight', $data['total_field_font_weight'], $this->store->get_font_weight_options(), 'col-4' ),
				'total_text_transform'       => $this->type->get_select_field( '', 'total_text_transform', $data['total_text_transform'], $this->store->get_text_transform_options(), 'col-4' ),
				'total_font_size'            => $this->type->get_number_type_field( __( 'Grand totals', 'cost-calculator-builder' ), 'total_font_size', 0, 100, 1, $data['total_font_size'], 'px', 'col-6' ),
				'total_font_weight'          => $this->type->get_select_field( '', 'total_font_weight', $data['total_font_weight'], $this->store->get_font_weight_options(), 'col-6' ),
				'fields_btn_font_size'       => $this->type->get_number_type_field( __( 'Fields & buttons text', 'cost-calculator-builder' ), 'fields_btn_font_size', 0, 100, 1, $data['fields_btn_font_size'], 'px', 'col-6' ),
				'fields_btn_font_weight'     => $this->type->get_select_field( '', 'fields_btn_font_weight', $data['fields_btn_font_weight'], $this->store->get_font_weight_options(), 'col-6' ),
			),
		);
	}


	/**
	 * @param $data
	 * @return array
	 */
	public function get_others( $data ): array {
		return array(
			'label' => __( 'Others', 'cost-calculator-builder' ),
			'name'  => 'others',
			'data'  => array(
				'calc_preloader' => $this->type->get_preloader_field( __( 'Preloader icon', 'cost-calculator-builder' ), 'calc-preloader', ! isset( $data['calc_preloader'] ) ? 0 : $data['calc_preloader'], 'col-12' ),
			),
		);
	}

	/**
	 * @return false|mixed|void
	 */
	public function get_preset_from_db() {
		return get_option( 'ccb_appearance_presets' );
	}

	/**
	 * @return false|mixed|void
	 */
	public static function get_static_preset_from_db( $filter = false ) {
		$presets = get_option( 'ccb_appearance_presets', array() );
		if ( $filter ) {
			foreach ( $presets as $key => $value ) {
				if ( is_numeric( $key ) ) {
					unset( $presets[ $key ] );
				}
			}
		}

		return $presets;
	}

	/**
	 * @param $key
	 * @param $new_data
	 */
	public static function save_custom( $key, $new_data ) {
		$presets = self::get_static_preset_from_db();

		if ( isset( $presets[ $key ] ) && isset( $new_data['desktop'] ) && isset( $new_data['mobile'] ) ) {
			$desktop            = $new_data['desktop'];
			$desktop_colors     = $desktop['colors']['data'];
			$desktop_layout     = $desktop['layout']['data'];
			$desktop_typography = $desktop['typography']['data'];
			$desktop_borders    = $desktop['borders']['data'];
			$desktop_shadows    = $desktop['shadows']['data'];
			$desktop_sizes      = $desktop['elements_sizes']['data'];
			$desktop_spacing    = $desktop['spacing_and_positions']['data'];
			$desktop_others     = $desktop['others']['data'];

			$desktop_data = array(
				'colors'                => array(
					'container'       => $desktop_colors['container']['value'],
					'primary_color'   => $desktop_colors['primary_color']['value'],
					'accent_color'    => $desktop_colors['accent_color']['value'],
					'secondary_color' => $desktop_colors['secondary_color']['value'],
					'error_color'     => $desktop_colors['error_color']['value'],
					'svg_color'       => $desktop_colors['svg_color']['value'],
				),
				'layout'                => array(
					'box_style' => $desktop_layout['box_style']['value'] ?? 'vertical',
				),
				'typography'            => array(
					'header_font_size'           => $desktop_typography['header_font_size']['value'],
					'header_font_weight'         => $desktop_typography['header_font_weight']['value'],
					'summary_header_size'        => $desktop_typography['summary_header_size']['value'],
					'summary_header_font_weight' => $desktop_typography['summary_header_font_weight']['value'],
					'label_font_size'            => $desktop_typography['label_font_size']['value'],
					'label_font_weight'          => $desktop_typography['label_font_weight']['value'],
					'description_font_size'      => $desktop_typography['description_font_size']['value'],
					'description_font_weight'    => $desktop_typography['description_font_weight']['value'],
					'total_field_font_size'      => $desktop_typography['total_field_font_size']['value'],
					'total_text_transform'       => $desktop_typography['total_text_transform']['value'],
					'total_field_font_weight'    => $desktop_typography['total_field_font_weight']['value'],
					'total_font_size'            => $desktop_typography['total_font_size']['value'],
					'total_font_weight'          => $desktop_typography['total_font_weight']['value'],
					'fields_btn_font_size'       => $desktop_typography['fields_btn_font_size']['value'],
					'fields_btn_font_weight'     => $desktop_typography['fields_btn_font_weight']['value'],
				),
				'borders'               => array(
					'container_border' => $desktop_borders['container_border']['value'],
					'fields_border'    => $desktop_borders['fields_border']['value'],
					'button_border'    => $desktop_borders['button_border']['value'],
				),
				'shadows'               => array(
					'container_shadow' => $desktop_shadows['container_shadow']['value'],
				),
				'elements_sizes'        => array(
					'field_and_buttons_height'       => $desktop_sizes['field_and_buttons_height']['value'],
					'container_vertical_max_width'   => $desktop_sizes['container_vertical_max_width']['value'],
					'container_horizontal_max_width' => $desktop_sizes['container_horizontal_max_width']['value'],
					'container_two_column_max_width' => $desktop_sizes['container_two_column_max_width']['value'],
				),
				'spacing_and_positions' => array(
					'field_side_indents'   => $desktop_spacing['field_side_indents']['value'],
					'field_spacing'        => $desktop_spacing['field_spacing']['value'],
					'container_margin'     => $desktop_spacing['container_margin']['value'],
					'container_padding'    => $desktop_spacing['container_padding']['value'],
					'description_position' => $desktop_spacing['description_position']['value'],
				),
				'others'                => array(
					'calc_preloader' => ! isset( $desktop_others['calc_preloader']['value'] ) ? 0 : $desktop_others['calc_preloader']['value'],
				),
			);

			$mobile            = $new_data['mobile'];
			$mobile_typography = $mobile['typography']['data'];
			$mobile_sizes      = $mobile['elements_sizes']['data'];
			$mobile_spacing    = $mobile['spacing_and_positions']['data'];

			$mobile_data = array(
				'typography'            => array(
					'header_font_size'           => $mobile_typography['header_font_size']['value'],
					'header_font_weight'         => $mobile_typography['header_font_weight']['value'],
					'summary_header_size'        => $desktop_typography['summary_header_size']['value'],
					'summary_header_font_weight' => $desktop_typography['summary_header_font_weight']['value'],
					'label_font_size'            => $mobile_typography['label_font_size']['value'],
					'label_font_weight'          => $mobile_typography['label_font_weight']['value'],
					'description_font_size'      => $mobile_typography['description_font_size']['value'],
					'description_font_weight'    => $mobile_typography['description_font_weight']['value'],
					'total_field_font_size'      => $mobile_typography['total_field_font_size']['value'],
					'total_text_transform'       => $mobile_typography['total_text_transform']['value'],
					'total_field_font_weight'    => $mobile_typography['total_field_font_weight']['value'],
					'total_font_size'            => $mobile_typography['total_font_size']['value'],
					'total_font_weight'          => $mobile_typography['total_font_weight']['value'],
					'fields_btn_font_size'       => $mobile_typography['fields_btn_font_size']['value'],
					'fields_btn_font_weight'     => $mobile_typography['fields_btn_font_weight']['value'],
				),
				'elements_sizes'        => array(
					'field_and_buttons_height' => $mobile_sizes['field_and_buttons_height']['value'],
				),
				'spacing_and_positions' => array(
					'field_side_indents' => $mobile_spacing['field_side_indents']['value'],
					'field_spacing'      => $mobile_spacing['field_spacing']['value'],
					'container_margin'   => $mobile_spacing['container_margin']['value'],
					'container_padding'  => $mobile_spacing['container_padding']['value'],
				),
			);

			$presets[ $key ]['data'] = array(
				'desktop' => $desktop_data,
				'mobile'  => $mobile_data,
			);

			self::update_presets( $presets );
		}
	}

	/**
	 * @param mixed|null $key
	 * @return mixed|null
	 */
	public function get_preset_by_key( $key = 'default' ) {
		$presets = $this->get_preset_from_db();
		if ( isset( $presets[ $key ]['data'] ) ) {
			return $presets[ $key ]['data'];
		}

		$default_presets = self::default_presets();
		if ( isset( $default_presets[ $key ]['data'] ) ) {
			return $default_presets[ $key ]['data'];
		}

		return $default_presets['default']['data'];
	}

	/**
	 * @param $type
	 * @param $width
	 * @param $radius
	 * @return array
	 */
	public static function generate_border_inner( $type, $width, $radius ) {
		return array(
			'type'   => $type,
			'width'  => $width,
			'radius' => $radius,
		);
	}

	/**
	 * @return array[]
	 */
	public static function default_presets() {
		return array(
			'default'   => array(
				'title' => 'Default',
				'key'   => 'default',
				'image' => array(
					'vertical'   => CALC_URL . '/frontend/dist/img/appearance/theme-default.png',
					'horizontal' => CALC_URL . '/frontend/dist/img/appearance/theme-default.png',
					'two_column' => CALC_URL . '/frontend/dist/img/appearance/theme-default.png',
				),
				'data'  => array(
					'desktop' => array(
						'colors'                => array(
							'container'       => self::get_container_default(),
							'primary_color'   => '#001931',
							'accent_color'    => '#00B163',
							'secondary_color' => '#F7F7F7',
							'error_color'     => '#D94141',
							'svg_color'       => 0,
						),
						'layout'                => array(
							'box_style' => 'vertical',
						),
						'typography'            => array(
							'header_font_size'           => 18,
							'header_font_weight'         => '600',
							'summary_header_size'        => 14,
							'summary_header_font_weight' => '600',
							'label_font_size'            => 14,
							'label_font_weight'          => '600',
							'description_font_size'      => 14,
							'description_font_weight'    => '500',
							'total_field_font_size'      => 14,
							'total_text_transform'       => 'capitalize',
							'total_field_font_weight'    => '400',
							'total_font_size'            => 18,
							'total_font_weight'          => '600',
							'fields_btn_font_size'       => 14,
							'fields_btn_font_weight'     => '500',
						),
						'borders'               => array(
							'container_border' => self::generate_border_inner( 'solid', 1, 8 ),
							'fields_border'    => self::generate_border_inner( 'solid', 1, 4 ),
							'button_border'    => self::generate_border_inner( 'solid', 1, 4 ),
						),
						'shadows'               => array(
							'container_shadow' => self::get_shadows_default(),
						),
						'elements_sizes'        => array(
							'field_and_buttons_height'     => 40,
							'container_vertical_max_width' => 970,
							'container_horizontal_max_width' => 970,
							'container_two_column_max_width' => 1200,
						),
						'spacing_and_positions' => array(
							'field_side_indents'   => 12,
							'field_spacing'        => 20,
							'container_margin'     => array( 0, 0, 0, 0 ),
							'container_padding'    => array( 20, 20, 20, 20 ),
							'description_position' => 'after',
						),
						'others'                => array(
							'calc_preloader' => 0,
						),
					),
					'mobile'  => array(
						'typography'            => array(
							'header_font_size'           => 16,
							'header_font_weight'         => '600',
							'summary_header_size'        => 12,
							'summary_header_font_weight' => '600',
							'label_font_size'            => 12,
							'label_font_weight'          => '600',
							'description_font_size'      => 12,
							'description_font_weight'    => '500',
							'total_field_font_size'      => 12,
							'total_text_transform'       => 'capitalize',
							'total_field_font_weight'    => '400',
							'total_font_size'            => 16,
							'total_font_weight'          => '600',
							'fields_btn_font_size'       => 12,
							'fields_btn_font_weight'     => '500',
						),
						'elements_sizes'        => array(
							'field_and_buttons_height' => 40,
						),
						'spacing_and_positions' => array(
							'field_side_indents' => 12,
							'field_spacing'      => 20,
							'container_margin'   => array( 0, 0, 0, 0 ),
							'container_padding'  => array( 10, 10, 10, 10 ),
						),
					),
				),
			),
			'orange'    => array(
				'title' => 'Orange',
				'key'   => 'orange',
				'image' => array(
					'vertical'   => CALC_URL . '/frontend/dist/img/appearance/theme-orange.png',
					'horizontal' => CALC_URL . '/frontend/dist/img/appearance/theme-orange.png',
					'two_column' => CALC_URL . '/frontend/dist/img/appearance/theme-orange.png',
				),
				'data'  => array(
					'desktop' => array(
						'colors'                => array(
							'container'       => self::get_container_default(),
							'primary_color'   => '#001931',
							'accent_color'    => '#FF9029',
							'secondary_color' => '#F7F7F7',
							'error_color'     => '#D94141',
							'svg_color'       => 0,
						),
						'layout'                => array(
							'box_style' => 'vertical',
						),
						'typography'            => array(
							'header_font_size'           => 18,
							'header_font_weight'         => '600',
							'summary_header_size'        => 14,
							'summary_header_font_weight' => '600',
							'label_font_size'            => 14,
							'label_font_weight'          => '600',
							'description_font_size'      => 14,
							'description_font_weight'    => '500',
							'total_field_font_size'      => 14,
							'total_text_transform'       => 'capitalize',
							'total_field_font_weight'    => '400',
							'total_font_size'            => 18,
							'total_font_weight'          => '600',
							'fields_btn_font_size'       => 14,
							'fields_btn_font_weight'     => '500',
						),
						'borders'               => array(
							'container_border' => self::generate_border_inner( 'solid', 1, 8 ),
							'fields_border'    => self::generate_border_inner( 'solid', 1, 4 ),
							'button_border'    => self::generate_border_inner( 'solid', 1, 4 ),
						),
						'shadows'               => array(
							'container_shadow' => self::get_shadows_default(),
						),
						'elements_sizes'        => array(
							'field_and_buttons_height'     => 40,
							'container_vertical_max_width' => 970,
							'container_horizontal_max_width' => 970,
							'container_two_column_max_width' => 1200,
						),
						'spacing_and_positions' => array(
							'field_side_indents'   => 12,
							'field_spacing'        => 20,
							'container_margin'     => array( 0, 0, 0, 0 ),
							'container_padding'    => array( 20, 20, 20, 20 ),
							'description_position' => 'after',
						),
						'others'                => array(
							'calc_preloader' => 0,
						),
					),
					'mobile'  => array(
						'typography'            => array(
							'header_font_size'           => 16,
							'header_font_weight'         => '600',
							'summary_header_size'        => 12,
							'summary_header_font_weight' => '600',
							'label_font_size'            => 12,
							'label_font_weight'          => '600',
							'description_font_size'      => 12,
							'description_font_weight'    => '500',
							'total_field_font_size'      => 12,
							'total_text_transform'       => 'capitalize',
							'total_field_font_weight'    => '400',
							'total_font_size'            => 16,
							'total_font_weight'          => '600',
							'fields_btn_font_size'       => 12,
							'fields_btn_font_weight'     => '500',
						),
						'elements_sizes'        => array(
							'field_and_buttons_height' => 30,
						),
						'spacing_and_positions' => array(
							'field_side_indents' => 12,
							'field_spacing'      => 20,
							'container_margin'   => array( 0, 0, 0, 0 ),
							'container_padding'  => array( 10, 10, 10, 10 ),
						),
					),
				),
			),
			'sky'       => array(
				'title' => 'Sky',
				'key'   => 'sky',
				'image' => array(
					'vertical'   => CALC_URL . '/frontend/dist/img/appearance/theme-sky.png',
					'horizontal' => CALC_URL . '/frontend/dist/img/appearance/theme-sky.png',
					'two_column' => CALC_URL . '/frontend/dist/img/appearance/theme-sky.png',
				),
				'data'  => array(
					'desktop' => array(
						'colors'                => array(
							'container'       => self::get_container_default(),
							'primary_color'   => '#001931',
							'accent_color'    => '#00A3FF',
							'secondary_color' => '#F7F7F7',
							'error_color'     => '#D94141',
							'svg_color'       => 0,
						),
						'layout'                => array(
							'box_style' => 'vertical',
						),
						'typography'            => array(
							'header_font_size'           => 18,
							'header_font_weight'         => '600',
							'summary_header_size'        => 14,
							'summary_header_font_weight' => '600',
							'label_font_size'            => 14,
							'label_font_weight'          => '600',
							'description_font_size'      => 14,
							'description_font_weight'    => '500',
							'total_field_font_size'      => 14,
							'total_text_transform'       => 'capitalize',
							'total_field_font_weight'    => '400',
							'total_font_size'            => 18,
							'total_font_weight'          => '600',
							'fields_btn_font_size'       => 14,
							'fields_btn_font_weight'     => '500',
						),
						'borders'               => array(
							'container_border' => self::generate_border_inner( 'solid', 1, 8 ),
							'fields_border'    => self::generate_border_inner( 'solid', 1, 4 ),
							'button_border'    => self::generate_border_inner( 'solid', 1, 4 ),
						),
						'shadows'               => array(
							'container_shadow' => self::get_shadows_default(),
						),
						'elements_sizes'        => array(
							'field_and_buttons_height'     => 40,
							'container_vertical_max_width' => 970,
							'container_horizontal_max_width' => 970,
							'container_two_column_max_width' => 1200,
						),
						'spacing_and_positions' => array(
							'field_side_indents'   => 12,
							'field_spacing'        => 20,
							'container_margin'     => array( 0, 0, 0, 0 ),
							'container_padding'    => array( 20, 20, 20, 20 ),
							'description_position' => 'after',
						),
						'others'                => array(
							'calc_preloader' => 0,
						),
					),
					'mobile'  => array(
						'typography'            => array(
							'header_font_size'           => 16,
							'header_font_weight'         => '600',
							'summary_header_size'        => 12,
							'summary_header_font_weight' => '600',
							'label_font_size'            => 12,
							'label_font_weight'          => '600',
							'description_font_size'      => 12,
							'description_font_weight'    => '500',
							'total_field_font_size'      => 12,
							'total_text_transform'       => 'capitalize',
							'total_field_font_weight'    => '400',
							'total_font_size'            => 16,
							'total_font_weight'          => '600',
							'fields_btn_font_size'       => 12,
							'fields_btn_font_weight'     => '500',
						),
						'elements_sizes'        => array(
							'field_and_buttons_height' => 40,
						),
						'spacing_and_positions' => array(
							'field_side_indents' => 12,
							'field_spacing'      => 20,
							'container_margin'   => array( 0, 0, 0, 0 ),
							'container_padding'  => array( 10, 10, 10, 10 ),
						),
					),
				),
			),
			'black'     => array(
				'title' => 'Black',
				'key'   => 'black',
				'image' => array(
					'vertical'   => CALC_URL . '/frontend/dist/img/appearance/theme-black.png',
					'horizontal' => CALC_URL . '/frontend/dist/img/appearance/theme-black.png',
					'two_column' => CALC_URL . '/frontend/dist/img/appearance/theme-black.png',
				),
				'data'  => array(
					'desktop' => array(
						'colors'                => array(
							'container'       => self::get_container_default( '#000000' ),
							'primary_color'   => '#FFFFFF',
							'accent_color'    => '#00B163',
							'secondary_color' => '#404040',
							'error_color'     => '#D94141',
							'svg_color'       => 0,
						),
						'layout'                => array(
							'box_style' => 'vertical',
						),
						'typography'            => array(
							'header_font_size'           => 18,
							'header_font_weight'         => '600',
							'summary_header_size'        => 14,
							'summary_header_font_weight' => '600',
							'label_font_size'            => 14,
							'label_font_weight'          => '600',
							'description_font_size'      => 14,
							'description_font_weight'    => '500',
							'total_field_font_size'      => 14,
							'total_text_transform'       => 'capitalize',
							'total_field_font_weight'    => '400',
							'total_font_size'            => 18,
							'total_font_weight'          => '600',
							'fields_btn_font_size'       => 14,
							'fields_btn_font_weight'     => '500',
						),
						'borders'               => array(
							'container_border' => self::generate_border_inner( 'solid', 1, 8 ),
							'fields_border'    => self::generate_border_inner( 'solid', 1, 4 ),
							'button_border'    => self::generate_border_inner( 'solid', 1, 4 ),
						),
						'shadows'               => array(
							'container_shadow' => self::get_shadows_default(),
						),
						'elements_sizes'        => array(
							'field_and_buttons_height'     => 40,
							'container_vertical_max_width' => 970,
							'container_horizontal_max_width' => 970,
							'container_two_column_max_width' => 1200,
						),
						'spacing_and_positions' => array(
							'field_side_indents'   => 12,
							'field_spacing'        => 20,
							'container_margin'     => array( 0, 0, 0, 0 ),
							'container_padding'    => array( 20, 20, 20, 20 ),
							'description_position' => 'after',
						),
						'others'                => array(
							'calc_preloader' => 0,
						),
					),
					'mobile'  => array(
						'typography'            => array(
							'header_font_size'           => 16,
							'header_font_weight'         => '600',
							'summary_header_size'        => 12,
							'summary_header_font_weight' => '600',
							'label_font_size'            => 12,
							'label_font_weight'          => '600',
							'description_font_size'      => 12,
							'description_font_weight'    => '500',
							'total_field_font_size'      => 12,
							'total_text_transform'       => 'capitalize',
							'total_field_font_weight'    => '400',
							'total_font_size'            => 16,
							'total_font_weight'          => '600',
							'fields_btn_font_size'       => 12,
							'fields_btn_font_weight'     => '500',
						),
						'elements_sizes'        => array(
							'field_and_buttons_height' => 40,
						),
						'spacing_and_positions' => array(
							'field_side_indents' => 12,
							'field_spacing'      => 20,
							'container_margin'   => array( 0, 0, 0, 0 ),
							'container_padding'  => array( 10, 10, 10, 10 ),
						),
					),
				),
			),
			'dark_blue' => array(
				'title' => 'Dark blue',
				'key'   => 'dark_blue',
				'image' => array(
					'vertical'   => CALC_URL . '/frontend/dist/img/appearance/theme-blue.png',
					'horizontal' => CALC_URL . '/frontend/dist/img/appearance/theme-blue.png',
					'two_column' => CALC_URL . '/frontend/dist/img/appearance/theme-blue.png',
				),
				'data'  => array(
					'desktop' => array(
						'colors'                => array(
							'container'       => self::get_container_default( '#003D82' ),
							'primary_color'   => '#FFFFFF',
							'accent_color'    => '#E76F00',
							'secondary_color' => '#0A4C96',
							'error_color'     => '#D94141',
							'svg_color'       => 0,
						),
						'layout'                => array(
							'box_style' => 'vertical',
						),
						'typography'            => array(
							'header_font_size'           => 18,
							'header_font_weight'         => '600',
							'summary_header_size'        => 14,
							'summary_header_font_weight' => '600',
							'label_font_size'            => 14,
							'label_font_weight'          => '600',
							'description_font_size'      => 14,
							'description_font_weight'    => '500',
							'total_field_font_size'      => 14,
							'total_text_transform'       => 'capitalize',
							'total_field_font_weight'    => '400',
							'total_font_size'            => 18,
							'total_font_weight'          => '600',
							'fields_btn_font_size'       => 14,
							'fields_btn_font_weight'     => '500',
						),
						'borders'               => array(
							'container_border' => self::generate_border_inner( 'solid', 1, 8 ),
							'fields_border'    => self::generate_border_inner( 'solid', 1, 4 ),
							'button_border'    => self::generate_border_inner( 'solid', 1, 4 ),
						),
						'shadows'               => array(
							'container_shadow' => self::get_shadows_default(),
						),
						'elements_sizes'        => array(
							'field_and_buttons_height'     => 40,
							'container_vertical_max_width' => 970,
							'container_horizontal_max_width' => 970,
							'container_two_column_max_width' => 1200,
						),
						'spacing_and_positions' => array(
							'field_side_indents'   => 12,
							'field_spacing'        => 20,
							'container_margin'     => array( 0, 0, 0, 0 ),
							'container_padding'    => array( 20, 20, 20, 20 ),
							'description_position' => 'after',
						),
						'others'                => array(
							'calc_preloader' => 0,
						),
					),
					'mobile'  => array(
						'typography'            => array(
							'header_font_size'           => 16,
							'header_font_weight'         => '600',
							'summary_header_size'        => 12,
							'summary_header_font_weight' => '600',
							'label_font_size'            => 12,
							'label_font_weight'          => '600',
							'description_font_size'      => 12,
							'description_font_weight'    => '500',
							'total_field_font_size'      => 12,
							'total_text_transform'       => 'capitalize',
							'total_field_font_weight'    => '400',
							'total_font_size'            => 16,
							'total_font_weight'          => '600',
							'fields_btn_font_size'       => 12,
							'fields_btn_font_weight'     => '500',
						),
						'elements_sizes'        => array(
							'field_and_buttons_height' => 40,
						),
						'spacing_and_positions' => array(
							'field_side_indents' => 12,
							'field_spacing'      => 20,
							'container_margin'   => array( 0, 0, 0, 0 ),
							'container_padding'  => array( 10, 10, 10, 10 ),
						),
					),
				),
			),
		);
	}

	/**
	 * @param $device
	 * @param $type
	 * @return mixed|null
	 */
	private function get_preset_data( $device, $type, $default = array() ) {
		if ( isset( $this->preset_data[ $device ][ $type ] ) ) {
			return $this->preset_data[ $device ][ $type ];
		}
		return $default;
	}

	public static function get_shadows_default() {
		return array(
			'color' => '#cccccc',
			'blur'  => 0,
			'x'     => 0,
			'y'     => 0,
		);
	}

	public static function get_container_default( $container_bg = '#ffffff' ) {
		return array(
			'color'   => $container_bg,
			'blur'    => 0,
			'opacity' => 100,
		);
	}

	public static function reset_type( $key, $type, $device ) {
		$presets        = self::default_presets();
		$default_preset = $presets['default'];

		if ( isset( $default_preset['data'][ $device ][ $type ] ) ) {
			$reset_data      = $default_preset['data'][ $device ][ $type ];
			$presets_from_db = self::get_static_preset_from_db();

			if ( isset( $presets_from_db[ $key ] ) ) {
				$presets_from_db[ $key ]['data'][ $device ][ $type ] = $reset_data;
				return $reset_data;
			}
		}

		return false;
	}

	public static function generate_new_preset( $idx, $data = null ) {
		$key   = 'saved_' . $idx;
		$title = 'Saved ' . $idx;

		$default_presets = self::default_presets();
		$new_preset      = $default_presets['default'];

		$new_preset['title'] = $title;
		$new_preset['key']   = $key;
		$new_preset['image'] = array(
			'vertical'   => CALC_URL . '/frontend/dist/img/appearance/theme-saved.png',
			'horizontal' => CALC_URL . '/frontend/dist/img/appearance/theme-saved-horizontal.png',
			'two_column' => CALC_URL . '/frontend/dist/img/appearance/theme-saved-two-columns.png',
		);

		if ( ! empty( $data ) && isset( $data['desktop'] ) ) {
			foreach ( $data['desktop'] as $key => $value ) {
				$new_preset['data']['desktop'][ $key ] = $value;
			}

			foreach ( $data['mobile'] as $key => $value ) {
				$new_preset['data']['mobile'][ $key ] = $value;
			}
		}

		return $new_preset;
	}

	public static function extend_preset( $idx, $data ) {
		$key   = 'saved_' . $idx;
		$title = 'Saved ' . $idx;

		$new_preset['title'] = $title;
		$new_preset['key']   = $key;
		$new_preset['image'] = array(
			'vertical'   => CALC_URL . '/frontend/dist/img/appearance/theme-saved.png',
			'horizontal' => CALC_URL . '/frontend/dist/img/appearance/theme-saved-horizontal.png',
			'two_column' => CALC_URL . '/frontend/dist/img/appearance/theme-saved-two-columns.png',
		);
		$new_preset['data']  = $data;

		return $new_preset;
	}

	public static function preset_exist( $key ) {
		if ( is_numeric( $key ) ) {
			return false;
		}
		$default_presets = self::default_presets();
		$from_db         = self::get_static_preset_from_db();

		return isset( $default_presets[ $key ] ) || isset( $from_db[ $key ] );
	}

	public static function update_presets( $presets = array() ) {
		$update_data = array();
		foreach ( $presets as $key => $value ) {
			if ( ! is_numeric( $key ) ) {
				$update_data[ $key ] = $value;
			}
		}

		update_option( 'ccb_appearance_presets', $update_data );
	}

	public static function update_preset_key( $calc_id, $key = 'default' ) {
		update_post_meta( $calc_id, 'ccb_calc_preset_idx', empty( $key ) || is_numeric( $key ) ? 'default' : $key );
	}

	public static function update_preset_title( $preset_key, $title ) {
		$presets = self::get_static_preset_from_db( true );
		if ( isset( $presets[ $preset_key ] ) ) {
			$presets[ $preset_key ]['title'] = $title;
			self::update_presets( $presets );
		}
	}
}
