<?php
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

$tabs = array(
	array(
		'type'  => 'desktop',
		'label' => __( 'Desktop', 'cost-calculator-builder' ),
		'icon'  => 'ccb-icon-Path-3501',
	),
	array(
		'type'  => 'mobile',
		'label' => __( 'Mobile', 'cost-calculator-builder' ),
		'icon'  => 'ccb-icon-Path-3502',
	),
);

$styles = array(
	array(
		'label' => __( 'Vertical', 'cost-calculator-builder' ),
		'icon'  => 'ccb-icon-Union-26',
		'key'   => 'vertical',
	),
	array(
		'label' => __( 'Horizontal', 'cost-calculator-builder' ),
		'icon'  => 'ccb-icon-Union-25',
		'key'   => 'horizontal',
	),
	array(
		'label' => __( 'Two columns', 'cost-calculator-builder' ),
		'icon'  => 'ccb-icon-Union-27',
		'key'   => 'two_column',
	),
);

$hide_notice = get_option( 'ccb_appearance_hide_notice', false );
?>
<div class="ccb-settings-tab ccb-inner-settings" :class="{'calc-quick-tour-appearance': $store.getters.getQuickTourStep === '.ccb-box-styles-container-inner', 'hide-menu': toggleMenu}">
	<loader v-if="preloader"></loader>
	<div class="ccb-appearance-container" v-else>
		<div class="ccb-appearance-content ccb-custom-scrollbar">
			<div class="ccb-appearance-property-toggle" @click="toggleSettings">
				<i class="ccb-icon-Path-3398"></i>
			</div>
			<div class="ccb-appearance-switcher">
				<div class="ccb-appearance-property-switch-header-inner">
					<?php foreach ( $tabs as $tab ) : ?>
						<span class="ccb-appearance-title-box" :class="{'ccb-container-active': tab === '<?php echo esc_attr( $tab['type'] ); ?>'}" @click="tab = '<?php echo esc_attr( $tab['type'] ); ?>'">
								<i class="<?php echo esc_attr( $tab['icon'] ); ?>"></i>
								<span class="ccb-default-title ccb-light"><?php echo esc_html( $tab['label'] ); ?></span>
							</span>
					<?php endforeach; ?>
				</div>
			</div>
			<preview inline-template :preview="tab" :key="presetIdx + $store.getters.getFieldsKey">
				<div :id="getContainerId">
					<div class="calc-appearance-preview-wrapper">
						<div class="calc-preview-mobile ccb-custom-scrollbar" id="calc-preview-mobile" v-if="preview === 'mobile'">
							<div class="calc-preview-mobile__header">
								<div class="calc-preview-mobile__header-attrs">
									<div class="calc-attr-left">
										<span class="calc-attr-time">9:41</span>
									</div>
									<div class="calc-attr-center">
										<span class="calc-attr-camera">
											<img src="<?php echo esc_attr( CALC_URL . '/frontend/dist/img/preview/camera.png' ); ?>" alt="camera">
										</span>
									</div>
									<div class="calc-attr-right">
										<img src="<?php echo esc_attr( CALC_URL . '/frontend/dist/img/preview/battery.png' ); ?>" alt="battery">
										<img src="<?php echo esc_attr( CALC_URL . '/frontend/dist/img/preview/wifi.png' ); ?>" alt="wifi">
										<img src="<?php echo esc_attr( CALC_URL . '/frontend/dist/img/preview/connection.png' ); ?>" alt="connection">
									</div>
								</div>
								<div class="calc-preview-mobile__header-search">
									<span class="calc-attr-search-bar">
										<span>
											yourwebsite.com
										</span>
									</span>
								</div>
							</div>
							<?php require CALC_PATH . '/templates/admin/components/preview/preview-content.php'; ?>
						</div>
						<template v-else>
							<?php require CALC_PATH . '/templates/admin/components/preview/preview-content.php'; ?>
						</template>
					</div>
				</div>
			</preview>
		</div>
		<div class="ccb-appearance-property-container calc-quick-tour-appearance-tab">
			<div class="ccb-appearance-property-wrapper">
				<div class="ccb-appearance-property-switch ccb-custom-scrollbar ccb-overflow-y-scroll">
					<div class="ccb-appearance-property-switch-header">
						<div class="ccb-appearance-presets">
							<div class="ccb-appearance-presets-label">
								<span class="ccb-heading-5 ccb-bold">
									<?php esc_html_e( 'Themes', 'cost-calculator-builder' ); ?>
								</span>
							</div>
							<div class="ccb-appearance-presets-list">
								<preset-item v-for="preset in presets" :key="preset.key" @title-change="updateTitle" :preset="preset" @selected="selectPreset" :is_selected="preset.key === presetIdx"/>
							</div>
						</div>

						<?php if ( ! $hide_notice ) : ?>
							<div class="ccb-appearance-switcher ccb-notice" v-if="tab === 'mobile' && showNotice">
								<div class="ccb-appearance-notice">
									<span class="ccb-appearance-notice-text">
										<span style="font-weight: 700">NOTE: </span>
										<?php esc_html_e( 'For Mobile  some of settings are inherited from desktop view:  Colors, Borders & shadows, Spacing & positions,  and Others', 'cost-calculator-builder' ); ?>
									</span>
									<span class="ccb-appearance-notice-action" @click="gotIt">
										<?php esc_html_e( 'Got it', 'cost-calculator-builder' ); ?>
									</span>
								</div>
							</div>
						<?php endif; ?>
					</div>

					<div class="ccb-appearance-container-wrapper" v-show="isCustom">
						<div class="ccb-appearance-container-properties">
							<div class="ccb-grid-box ccb-appearance">
								<appearance-row :type="tab" @reset="resetType" :key="updateCounter" :custom="isCustom && !isSaved"/>
							</div>
						</div>
					</div>
				</div>
				<div class="ccb-appearance-presets-actions" style="margin-top: 0">
					<button class="ccb-button default save-btn" v-if="!isCustom" @click="customizeTheme">
						<i class="ccb-icon-Color-Palette-filled"></i>
						<?php esc_html_e( 'Customize this theme', 'cost-calculator-builder' ); ?>
					</button>
					<button class="ccb-button default remove-btn" v-else-if="isSaved" @click="removeTheme">
						<i class="ccb-icon-Trash-filled"></i>
						<?php esc_html_e( 'Remove theme', 'cost-calculator-builder' ); ?>
					</button>
					<button class="ccb-button default save-btn" v-else-if="isCustom" @click="saveAsTheme">
						<i class="ccb-icon-Path-3599"></i>
						<?php esc_html_e( 'Save theme', 'cost-calculator-builder' ); ?>
					</button>
				</div>
			</div>
		</div>
		<ccb-modal-window>
			<template v-slot:content>
				<?php foreach ( $modal_types as $m_type ) : ?>
					<template v-if="$store.getters.getModalType === '<?php echo esc_attr( $m_type['type'] ); ?>'">
						<?php require $m_type['path']; ?>
					</template>
				<?php endforeach; ?>
			</template>
		</ccb-modal-window>
	</div>
</div>
