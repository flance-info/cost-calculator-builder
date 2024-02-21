<?php
$pro_active = defined( 'CCB_PRO' ) ? 'active' : '';
$types      = array(
	'type'      => __( 'Type', 'cost-calculator-builder' ),
	'selection' => __( 'Selection', 'cost-calculator-builder' ),
	'checkbox'  => __( 'Checkbox', 'cost-calculator-builder' ),
	'date'      => __( 'Date and Time', 'cost-calculator-builder' ),
	'slider'    => __( 'Slider', 'cost-calculator-builder' ),
	'other'     => __( 'Other', 'cost-calculator-builder' ),
	'grouping'  => __( 'Grouping', 'cost-calculator-builder' ),
);

?>

<?php foreach ( $types as $type_idx => $type_value ) : ?>
	<div class="ccb-sidebar-item-container">
		<span class="ccb-sidebar-item-type"><?php echo esc_html( $type_value ); ?></span>
		<draggable @start="start" @end="end" :sort="false" @change="log" :move="onMove" handle=".ccb-sidebar-item" class="ccb-sidebar-item-list" :list="$store.getters.getFields" :group="{ name: 'fields', pull: 'clone', put: false }">
			<div class="ccb-sidebar-item" :style="getCalcSidebarItemStyleForElementStyleTourStep(field.type)" :class="[field.type, {'lock': getProFields.includes(field.tag) && '<?php echo esc_attr( $pro_active ); ?>' === ''}]" @click="addField(field)" :key="field.type" v-for="( field, index ) in $store.getters.getFields" v-if="'<?php echo esc_attr( $type_idx ); ?>' === field.sort_type">
				<span class="ccb-sidebar-item-lock" v-if="getProFields.includes(field.tag) && '<?php echo esc_attr( $pro_active ); ?>' === ''">
					<a :href="utmElementsGeneratedLink(field.type)" target="_blank" @click.stop>
						<span class="ccb-item-lock-inner">
							<i class="ccb-icon-Path-3482"></i>
							<span><?php esc_html_e( 'Pro', 'cost-calculator-builder' ); ?></span>
						</span>
					</a>

					<span v-if="( '.calc-quick-tour-element-styles' !== getTourStep  )" class="ccb-item-lock"></span>
				</span>
				<span v-if="( '.calc-quick-tour-element-styles' === getTourStep && elements_style_data_for_quick_tour.hasOwnProperty(field.type) ) " class="ccb-sidebar-item-quick-tour-element-styles">
					{{ elements_style_data_for_quick_tour[field.type] }} <?php esc_html_e( 'styles', 'cost-calculator-builder' ); ?>
				</span>
				<span class="ccb-sidebar-item-icon" :style="( '.calc-quick-tour-element-styles' == getTourStep  ) ? {'background': 'unset'} : ''">
					<i :class="field.icon"></i>
				</span>
				<span class="ccb-sidebar-item-draggable">
					<i class="ccb-icon-drag-dots"></i>
				</span>
				<span class="ccb-sidebar-item-box">

					<span class="ccb-default-title ccb-bold">{{ field.name }}</span>
				</span>
			</div>
		</draggable>
	</div>
<?php endforeach; ?>
