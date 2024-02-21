<div class="ccb-tab-container">
	<div class="ccb-grid-box">
		<div class="container">
			<div class="row ccb-p-t-15 ccb-p-b-15">
				<div class="col-12">
					<span class="ccb-tab-title"><?php esc_html_e( 'Summary block ', 'cost-calculator-builder' ); ?></span>
				</div>
				<div class="col-12">
					<span class="ccb-tab-description"><?php esc_html_e( 'In this section, you can set up the the summary section and choose which additional values to display.', 'cost-calculator-builder' ); ?></span>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="settingsField.general.descriptions" @change="toggleTotalOptions"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-6 ccb-bold"><?php esc_html_e( 'Show summary details', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
			</div>
			<div class="row ccb-settings-property ccb-sub-setting" :class="{ 'ccb-settings-disabled': !settingsField.general.descriptions }">
				<div class="col">
					<div class="row ccb-p-t-10">
						<div class="col">
							<div class="list-header">
								<div class="ccb-switch">
									<input type="checkbox" v-model="settingsField.general.hide_empty"/>
									<label></label>
								</div>
								<h6 class="ccb-heading-6 ccb-bold"><?php esc_html_e( 'Show zero values in summary list', 'cost-calculator-builder' ); ?></h6>
							</div>
						</div>
					</div>
					<div class="row ccb-p-t-10">
						<div class="col">
							<div class="list-header">
								<div class="ccb-switch">
									<input type="checkbox" v-model="settingsField.general.hide_empty_for_orders_pdf_emails"/>
									<label></label>
								</div>
								<h6 class="ccb-heading-6 ccb-bold"><?php esc_html_e( 'Zero Values in Orders, PDF Entries, Emails', 'cost-calculator-builder' ); ?></h6>
							</div>
						</div>
					</div>
					<div class="row ccb-p-t-10">
						<div class="col">
							<div class="list-header">
								<div class="ccb-switch">
									<input type="checkbox" v-model="settingsField.general.show_details_accordion"/>
									<label></label>
								</div>
								<h6 class="ccb-heading-6 ccb-bold"><?php esc_html_e( 'Keep details  open by default', 'cost-calculator-builder' ); ?></h6>
								<span class="ccb-help-tip-block" style="margin-top: 2px;">
							<span class="ccb-help-label" ><?php esc_html_e( 'Preview', 'cost-calculator-builder' ); ?></span>
							<span class="ccb-help ccb-help-settings">
								<span class="ccb-help-content">
									<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/total_summary.gif' ); ?>" alt="woo logo">
								</span>
							</span>
						</span>
							</div>
						</div>
					</div>
					<div class="row ccb-p-t-10 ccb-p-b-20">
						<div class="col">
							<div class="list-header">
								<div class="ccb-switch">
									<input type="checkbox" v-model="settingsField.general.show_option_unit"/>
									<label></label>
								</div>
								<h6 class="ccb-heading-6 ccb-bold"><?php esc_html_e( 'Show composition in summary', 'cost-calculator-builder' ); ?></h6>
								<span class="ccb-help-tip-block" style="margin-top: 2px;">
							<span class="ccb-help-label" ><?php esc_html_e( 'Preview', 'cost-calculator-builder' ); ?></span>
							<span class="ccb-help ccb-help-settings">
								<span class="ccb-help-content">
									<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/composition.jpg' ); ?>" alt="woo logo">
								</span>
							</span>
						</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<?php if ( ccb_pro_active() ) : ?>
				<div class="row ccb-p-t-10 section-border-top">
					<div class="col">
						<div class="list-header">
							<div class="ccb-switch">
								<input type="checkbox" v-model="settingsField.general.sticky"/>
								<label></label>
							</div>
							<h6 class="ccb-heading-6 ccb-bold"><?php esc_html_e( 'Make summary block fixed on scroll', 'cost-calculator-builder' ); ?></h6>
							<span class="ccb-help-tip-block" style="margin-top: 2px;">
								<span class="ccb-help-label" ><?php esc_html_e( 'Preview', 'cost-calculator-builder' ); ?></span>
								<span class="ccb-help ccb-help-settings">
									<span class="ccb-help-content">
										<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/sticky.gif' ); ?>" alt="woo logo">
									</span>
								</span>
							</span>
						</div>
					</div>
				</div>
			<?php else : ?>
				<div class="row ccb-p-t-10 section-border-top">
					<div class="col">
						<div class="list-header">
							<div class="ccb-switch" style="pointer-events: none">
								<input type="checkbox"/>
								<label></label>
							</div>
							<h6 class="ccb-heading-6 ccb-bold" style="color: #9196A1; display: flex">
								<span><?php esc_html_e( 'Make summary block fixed on scroll', 'cost-calculator-builder' ); ?></span>
								<span class="ccb-item-lock-inner" style="left: 0px;"><i class="ccb-icon-Path-3482"></i> <span>PRO</span></span>
							</h6>
							<span class="ccb-help-tip-block" style="margin-top: 2px;">
								<span class="ccb-help-label" ><?php esc_html_e( 'Preview', 'cost-calculator-builder' ); ?></span>
								<span class="ccb-help ccb-help-settings">
									<span class="ccb-help-content">
										<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/sticky.gif' ); ?>" alt="woo logo">
									</span>
								</span>
							</span>
						</div>
					</div>
				</div>
			<?php endif; ?>
			<div class="row ccb-p-t-15">
				<div class="col col-3">
					<div class="ccb-input-wrapper" style="max-width: 330px;">
						<span class="ccb-input-label"><?php esc_html_e( 'Grand Total Title', 'cost-calculator-builder' ); ?></span>
						<input type="text" v-model.trim="settingsField.general.header_title" placeholder="<?php esc_attr_e( 'Summary', 'cost-calculator-builder' ); ?>">
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
