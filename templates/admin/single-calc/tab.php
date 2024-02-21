<?php
$calc_tabs = \cBuilder\Classes\CCBSettingsData::get_tab_data();
?>

<div class="ccb-tab-sections" :class="{'ccb-loader-inner-section': preloader}">
	<div class="ccb-calculator-tab" v-if="preloader">
		<loader></loader>
	</div>
	<div class="ccb-calculator-tab ccb-tab-section-content" :class="{'ccb-show-content': !preloader}">
		<div class="ccb-tab-sections-header">
			<div style="width: 100%; display: flex; justify-content: space-between">
				<div class="ccb-header-left">
					<span class="ccb-back-container">
						<span class="ccb-back-wrap" @click="back">
							<i class="ccb-icon-Path-3398"></i>
						</span>
						<span class="ccb-back-to-text" >
							<span @click="back"><?php esc_html_e( 'Back / ', 'cost-calculator-builder' ); ?></span>
							<span>{{ calculatorTitle }}</span>
						</span>
					</span>
				</div>
				<div class="ccb-header-center">
					<div class="ccb-calculator-tab-header">
						<?php foreach ( $calc_tabs as $c_file => $c_tab ) : ?>
							<span class="ccb-calculator-tab-header-label" :class="{active: '<?php echo esc_attr( $c_file ); ?>' === currentTab}" @click="setTab('<?php echo esc_attr( $c_file ); ?>')">
								<i class="<?php echo esc_attr( $c_tab['icon'] ); ?>"></i>
								<span class="ccb-heading-5" style="display: flex; align-items: center;">
									<?php echo esc_html( $c_tab['label'] ); ?>
									<span class="ccb-fields-required" v-if="'<?php echo esc_attr( $c_tab['component'] ); ?>' === 'ccb-calculator-tab' && $store.getters.getGlobalErrors.length > 0">{{ $store.getters.getGlobalErrors.length }}</span>
									<span class="ccb-fields-required" v-if="'<?php echo esc_attr( $c_tab['component'] ); ?>' === 'ccb-settings-tab' && $store.getters.getSettingsError.length > 0">{{ $store.getters.getSettingsError.length }}</span>
								</span>
							</span>
						<?php endforeach; ?>
					</div>
				</div>
				<div class="ccb-header-right" style="position: relative">
					<?php if ( defined( 'CCB_PRO' ) ) : ?>
					<span class="ccb-options-tooltip bottom">
						<button class="ccb-button default icon" v-if="$store.getters.getGeneralSettings.backup_settings.auto_backup" @click="history" :class="{disabled: !$store.getters.getSpList.length}">
							<i class="ccb-icon-History" style="color: rgba(0, 25, 49, 0.7)"></i>
						</button>
						<span class="ccb-options-tooltip__text" v-if="$store.getters.getSpList?.length"><?php esc_html_e( 'Previous saved backup', 'cost-calculator-builder' ); ?></span>
						<span class="ccb-options-tooltip__text" style="right: -115%" v-else><?php esc_html_e( 'No saved backups', 'cost-calculator-builder' ); ?></span>
					</span>
					<?php endif; ?>
					<button class="ccb-button default" v-if="currentTab !== 'appearances'" @click="previewMode"><?php esc_html_e( 'Preview', 'cost-calculator-builder' ); ?></button>
					<button class="ccb-button embed" @click="showEmbed" style="height: 100%" v-if="$store.getters.getSaved">
						<span class="ccb-icon-html"></span>
						<span>
							<?php esc_html_e( 'Embed', 'cost-calculator-builder' ); ?>
						</span>
					</button>
					<span class="ccb-options-tooltip bottom" v-else>
						<button class="ccb-button embed disabled" style="height: 100%">
							<span class="ccb-icon-html"></span>
							<span>
								<?php esc_html_e( 'Embed', 'cost-calculator-builder' ); ?>
							</span>
						</button>
						<span class="ccb-options-tooltip__text" style="right: -15px; top: 115%"><?php esc_html_e( 'Save before embed', 'cost-calculator-builder' ); ?></span>
					</span>
					<button class="ccb-button ccb-save-settings success calc-quick-tour-ccb-button" @click="saveSettings">
						<span class="calc-save-btn-txt" style="font-size: 14px !important;">
							<?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?>
						</span>
						<span class="ccb-btn-dropdown ccb-btn-save-as-template" @click.stop="() => showSaveTemplate = !showSaveTemplate">
							<span class="ccb-btn-dropdown-content">
								<i class="ccb-icon-Path-3398"></i>
							</span>
							<ul class="ccb-btn-dropdown-list" v-if="showSaveTemplate">
								<li class="ccb-default-title ccb-bold" @click.stop="() => saveSettings('template')"><?php esc_html_e( 'Save as Template', 'cost-calculator-builder' ); ?></li>
							</ul>
						</span>
					</button>
				</div>
			</div>
		</div>
		<div class="ccb-calculator-tab-content">
			<?php foreach ( $calc_tabs as $c_file => $c_tab ) : ?>
				<div class="ccb-calculator-tab-page" v-if="'<?php echo esc_attr( $c_file ); ?>' === currentTab">
					<component
							@edit-title="edit_title"
							:key="$store.getters.getFieldsKey"
							inline-template
							:type="currentTab"
							@set-step="setTab"
							@create-page="goToCreatePage"
							ref="<?php echo esc_attr( $c_file ); ?>"
							:is="getActiveTab"
					>
						<?php require_once CALC_PATH . '/templates/admin/single-calc/' . $c_file . '.php'; ?>
					</component>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</div>
