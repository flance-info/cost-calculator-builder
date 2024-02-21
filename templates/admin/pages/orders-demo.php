<?php
wp_enqueue_script( 'cbb-feedback', CALC_URL . '/frontend/dist/feedback.js', array(), CALC_VERSION, true );
wp_enqueue_style( 'ccb-bootstrap-css', CALC_URL . '/frontend/dist/css/bootstrap.min.css', array(), CALC_VERSION );
wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/dist/css/font/font.css', array(), CALC_VERSION );
wp_enqueue_style( 'ccb-admin-app-css', CALC_URL . '/frontend/dist/css/admin.css', array(), CALC_VERSION );
wp_enqueue_script( 'cbb-order-js', CALC_URL . '/frontend/dist/order.js', array(), CALC_VERSION, true );
wp_localize_script(
	'cbb-order-js',
	'ajax_window',
	array(
		'ajax_url'     => admin_url( 'admin-ajax.php' ),
		'dateFormat'   => get_option( 'date_format' ),
		'language'     => substr( get_bloginfo( 'language' ), 0, 2 ),
		'plugin_url'   => CALC_URL,
		'translations' => array_merge( \cBuilder\Classes\CCBTranslations::get_frontend_translations(), \cBuilder\Classes\CCBTranslations::get_backend_translations() ),
		'pro_active'   => ccb_pro_active(),
	)
);
?>
<div class="ccb-settings-wrapper calculator-orders" id="calculator_orders">
	<div class="ccb-main-container">
		<?php require_once CALC_PATH . '/templates/admin/components/header.php'; ?>
		<div class="ccb-tab-content">
			<div class="ccb-tab-sections">
				<div class="ccb-table-body ccb-orders-page">
					<div class="ccb-grid-box">
						<div class="container">
							<div class="row ccb-pro-feature-section-wrapper">
								<div class="col-12">
									<div class="ccb-pro-feature-section center" style="margin-top: 57px;">
										<div class="ccb-pro-feature-section__title"><?php esc_html_e( 'Get a detailed view of orders by your website editors', 'cost-calculator-builder' ); ?></div>
										<div class="ccb-pro-feature-section-description">
											<div class="ccb-pro-feature-section-description__title">
												🔒
												<span><?php esc_html_e( 'Available in PRO version', 'cost-calculator-builder' ); ?></span>
											</div>
											<a href="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=orders" target="_blank" class="ccb-button ccb-href success">Upgrade Now</a>
										</div>
									</div>
								</div>
								<div class="col-12">
									<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/pro-features/orders.webp' ); ?>" alt="Cost Calculator Orders" style="width: 100%; max-width: 953px; margin: 0 auto; display: block; margin-top: 46px;">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
