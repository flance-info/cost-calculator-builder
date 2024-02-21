<?php
$ccb_pages   = \cBuilder\Classes\CCBSettingsData::get_settings_pages();
$modal_types = array(
	'preview' => array(
		'type' => 'preview',
		'path' => CALC_PATH . '/templates/admin/single-calc/modals/modal-preview.php',
	),
	'history' => array(
		'type' => 'history',
		'path' => CALC_PATH . '/templates/admin/single-calc/modals/history.php',
	),
);

?>

<div class="ccb-settings-tab ccb-inner-settings calc-quick-tour-settings" :style="remove_quick_tour_css">
	<div class="ccb-settings-tab-sidebar">
		<div class="ccb-settings-tab-wrapper border-bottom">
			<span class="ccb-settings-tab-header"><?php esc_html_e( 'Basic', 'cost-calculator-builder' ); ?></span>
			<span class="ccb-settings-tab-list">
				<?php foreach ( $ccb_pages as $ccb_page ) : ?>
					<?php if ( isset( $ccb_page['type'] ) && sanitize_text_field( $ccb_page['type'] ) === 'basic' ) : ?>
						<span class="ccb-settings-tab-list-item" :class="{active: tab === '<?php echo esc_attr( $ccb_page['slug'] ); ?>'}" @click="tab = '<?php echo esc_attr( $ccb_page['slug'] ); ?>'">
							<i class="<?php echo esc_attr( $ccb_page['icon'] ); ?>"></i>
							<span>
								<?php echo esc_html( $ccb_page['title'] ); ?>
								<?php if ( isset( $ccb_page['component'] ) ) : ?>
								<span class="ccb-fields-required" v-if="'<?php echo esc_attr( $ccb_page['component'] ); ?>' === 'confirmation-page' && isError('thankYouPage').length > 0">{{ isError('thankYouPage').length }}</span>
									<?php if ( ! defined( 'CCB_PRO_VERSION' ) ) { ?>
										<a href="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=confirmationpage-pro-label" class="ccb-link-reset" target="_blank">
											<span class="ccb-item-lock-inner" style="left: 0;"><i class="ccb-icon-Path-3482"></i> <span>PRO</span></span>
										</a>
									<?php } ?>
								<?php endif; ?>
							</span>
						</span>
					<?php endif; ?>
				<?php endforeach; ?>
			</span>
		</div>
		<div class="ccb-settings-tab-wrapper">
			<span class="ccb-settings-tab-header">
				<span><?php esc_html_e( 'Integrations', 'cost-calculator-builder' ); ?></span>
				<?php if ( ! defined( 'CCB_PRO_VERSION' ) ) { ?>
					<a href="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=integrations-pro-label" class="ccb-link-reset" target="_blank">
						<span class="ccb-item-lock-inner">
							<i class="ccb-icon-Path-3482"></i>
						<span>PRO</span>
					</span>
					</a>
				<?php } ?>
			</span>
			<span class="ccb-settings-tab-list">
				<?php foreach ( $ccb_pages as $ccb_page ) : ?>
					<?php if ( isset( $ccb_page['type'] ) && sanitize_text_field( $ccb_page['type'] ) === 'pro' ) : ?>
						<span class="ccb-settings-tab-list-item" :class="{active: tab === '<?php echo esc_attr( $ccb_page['slug'] ); ?>'}" @click="tab = '<?php echo esc_attr( $ccb_page['slug'] ); ?>'">
							<i class="<?php echo esc_attr( $ccb_page['icon'] ); ?>"></i>
							<span><?php echo esc_html( $ccb_page['title'] ); ?></span>
						</span>
					<?php endif; ?>
				<?php endforeach; ?>
			</span>
		</div>
	</div>
	<div class="ccb-settings-tab-content" :style="{padding: tab === 'thank-you-page' ? 0 : ''}">
		<div class="ccb-settings-container ccb-custom-scrollbar">
			<?php foreach ( $ccb_pages as $ccb_page ) : ?>
				<component
						inline-template
						:is="getComponent"
						:key="$store.getters.getFieldsKey"
						v-if="tab === '<?php echo esc_attr( $ccb_page['slug'] ); ?>'"
				>
					<?php require_once CALC_PATH . '/templates/admin/settings/' . $ccb_page['slug'] . '.php'; //phpcs:ignore ?>
				</component>
			<?php endforeach; ?>
		</div>
	</div>
	<ccb-modal-window v-if="$store.getters.getModalType !== 'payment-settings'">
		<template v-slot:content>
			<?php foreach ( $modal_types as $m_type ) : ?>
				<template v-if="$store.getters.getModalType === '<?php echo esc_attr( $m_type['type'] ); ?>'">
					<?php require $m_type['path']; ?>
				</template>
			<?php endforeach; ?>
		</template>
	</ccb-modal-window>
</div>
