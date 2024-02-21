<?php
$ccb_pages = \cBuilder\Classes\CCBSettingsData::get_general_settings_pages();
?>
<div class="ccb-tab-sections" style="overflow: hidden">
	<loader v-if="preloader"></loader>
	<template v-else>
		<div class="ccb-settings-tab" style="overflow: hidden; height: calc(100vh - 140px)">
			<div class="ccb-settings-tab-sidebar" style="height: 100vh">
				<div class="ccb-settings-tab-wrapper border-bottom">
					<span class="ccb-settings-tab-header"><?php esc_html_e( 'Basic', 'cost-calculator-builder' ); ?></span>
					<span class="ccb-settings-tab-list">
					<?php foreach ( $ccb_pages as $ccb_page ) : ?>
						<?php if ( isset( $ccb_page['type'] ) && sanitize_text_field( $ccb_page['type'] ) === 'basic' ) : ?>
							<span class="ccb-settings-tab-list-item" :class="{active: tab === '<?php echo esc_attr( $ccb_page['slug'] ); ?>'}" @click="tab = '<?php echo esc_attr( $ccb_page['slug'] ); ?>'">
							<i class="<?php echo esc_attr( $ccb_page['icon'] ); ?>"></i>
							<span><?php echo esc_html( $ccb_page['title'] ); ?></span>
						</span>
						<?php endif; ?>
					<?php endforeach; ?>
				</span>
				</div>
				<div class="ccb-settings-tab-wrapper">
					<span class="ccb-settings-tab-header"><?php esc_html_e( 'Integrations', 'cost-calculator-builder' ); ?></span>
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
			<div class="ccb-settings-tab-sidebar ccb-settings-tab-sidebar-mobile" style="height: 100vh">
				<span class="ccb-settings-header-mobile" @click="mobileSwitcher"><?php esc_html_e( 'Setting menu', 'cost-calculator-builder' ); ?><i class="ccb-icon-Down" :class="{'toggle': mobileState}"></i></span>
				<template v-if="mobileState">
					<div class="ccb-settings-tab-wrapper" :class="{'border-bottom': mobileState}">
					<span class="ccb-settings-tab-header"><?php esc_html_e( 'Global setting', 'cost-calculator-builder' ); ?></span>
							<span class="ccb-settings-tab-list">
							<?php foreach ( $ccb_pages as $ccb_page ) : ?>
								<?php if ( isset( $ccb_page['type'] ) && sanitize_text_field( $ccb_page['type'] ) === 'basic' ) : ?>
									<span class="ccb-settings-tab-list-item" :class="{active: tab === '<?php echo esc_attr( $ccb_page['slug'] ); ?>'}" @click="tab = '<?php echo esc_attr( $ccb_page['slug'] ); ?>'">
									<i class="<?php echo esc_attr( $ccb_page['icon'] ); ?>"></i>
									<span><?php echo esc_html( $ccb_page['title'] ); ?></span>
								</span>
								<?php endif; ?>
							<?php endforeach; ?>
						</span>
					</div>
					<div class="ccb-settings-tab-wrapper" :class="{'border-bottom': mobileState}">
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
				</template>
			</div>
			<div class="ccb-settings-tab-content ccb-settings-tab-content-mobile">
				<div class="ccb-settings-container ccb-custom-scrollbar">
					<?php foreach ( $ccb_pages as $ccb_page ) : ?>
						<component
								inline-template
								:is="getComponent"
								v-if="tab === '<?php echo esc_attr( $ccb_page['slug'] ); ?>'"
						>
							<?php require_once CALC_PATH . '/templates/admin/general-settings/' . $ccb_page['slug'] . '.php'; //phpcs:ignore ?>
						</component>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</template>
</div>
