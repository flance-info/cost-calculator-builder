<div class="welcome-page-wrapper">
	<div class="wizard-finish">
		<div class="wizard-finish__welcome">
			<div class="wizard-finish__welcome_column">
				<div class="intro-logo">
					<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/welcome/intro.svg' ); ?>"/>
				</div>
				<h2>
					<span><?php esc_html_e( 'Welcome to Cost Calculator Plugin for WordPress', 'cost-calculator-builder' ); ?></span>
				</h2>
				<p>
					<?php esc_html_e( 'Create freely powerful and nice-looking cost estimation forms on your website.', 'cost-calculator-builder' ); ?>
				</p>
				<div class="wizard-finish__welcome_button_wrapper">
					<a class="wizard-finish__welcome_button success" id="welcome_new_form">
						<?php esc_html_e( 'New Form', 'cost-calculator-builder' ); ?>
					</a>
					<a href="<?php echo esc_url( admin_url( 'admin.php?page=cost_calculator_templates' ) ); ?>" class="wizard-finish__welcome_button">
						<?php esc_html_e( 'Use a Template', 'cost-calculator-builder' ); ?>
					</a>
				</div>
			</div>
			<div class="wizard-finish__welcome_column video-modal video-play-btn">
				<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/welcome/intro-welcome.png' ); ?>" class="intro-img"/>
				<section class="video-area">
					<div class="video-play-btn ripple">
						<a class="play-btn" id="WelcomeModalBtn">
						</a>
					</div>
				</section>
			</div>
		</div>
		<div class="wizard-finish__column_wrapper">
			<div class="wizard-finish__column">
				<div class="wizard-finish__column_block users_manage">
					<h3><?php esc_html_e( 'Main Features', 'cost-calculator-builder' ); ?></h3>
					<p><?php esc_html_e( 'Create a calculator by dragging & dropping elements. Apply conditions with multiple totals to get dynamic and accurate results.', 'cost-calculator-builder' ); ?></p>
					<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/welcome/features.png' ); ?>"/>
				</div>
				<div class="wizard-finish__column_block video">
					<h3><?php esc_html_e( 'Video Tutorials and Documentation', 'cost-calculator-builder' ); ?></h3>
					<p><?php esc_html_e( 'An extensive knowledge base and a playlist on our YouTube channel help explore plugin features.', 'cost-calculator-builder' ); ?></p>
					<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/welcome/video_tutorials.svg' ); ?>"/>
					<div class="wizard-finish__column_block_button_wrapper">
						<a href="https://www.youtube.com/watch?v=XZKJE1CcYxo"
						   class="wizard-finish__column_block_button success" target="_blank">
							<?php esc_html_e( 'Watch Tutorials', 'cost-calculator-builder' ); ?>
						</a>
						<a href="https://docs.stylemixthemes.com/cost-calculator-builder/"
						   class="wizard-finish__column_block_button" target="_blank">
							<?php esc_html_e( 'Plugin Documentation', 'cost-calculator-builder' ); ?>
						</a>
					</div>
				</div>
				<div class="wizard-finish__column_block sell_online">
					<h3><?php esc_html_e( 'Order Management', 'cost-calculator-builder' ); ?></h3>
					<p><?php esc_html_e( 'Enable payment methods and efficiently manage orders with our streamlined system.', 'cost-calculator-builder' ); ?></p>
					<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/welcome/order.png' ); ?>"/>
				</div>
			</div>

			<div class="wizard-finish__column">
				<div class="wizard-finish__column_block unlimited">
					<h3><?php esc_html_e( 'Elements', 'cost-calculator-builder' ); ?></h3>
					<p><?php esc_html_e( 'A selection of many versatile and customizable calculator elements with unique styles.', 'cost-calculator-builder' ); ?></p>
					<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/welcome/element.png' ); ?>"/>
				</div>
				<div class="wizard-finish__column_block small_companies">
					<h3><?php esc_html_e( 'Quotations', 'cost-calculator-builder' ); ?></h3>
					<p><?php esc_html_e( 'Generate accurate quotations and offer PDF download or email delivery.', 'cost-calculator-builder' ); ?></p>
					<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/welcome/quotations.png' ); ?>"/>
				</div>
			</div>
		</div>
		<div class="wizard-finish__before_bottom">
			<div class="wizard-finish__welcome_column appearance-column-left">
				<h2>
					<span><?php esc_html_e( 'Appearance', 'cost-calculator-builder' ); ?></span>
				</h2>
				<p>
					<?php esc_html_e( 'Customize the calculator\'s appearance effortlessly with intuitive design options', 'cost-calculator-builder' ); ?>
				</p>
				<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/welcome/appearancee.png' ); ?>" class="appearance"/>
			</div>
			<div class="wizard-finish__welcome_column appearance-column">
				<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/welcome/appearanceee2.png' ); ?>" class="intro-img"/>
			</div>
		</div>
		<div class="wizard-finish__links">
			<a href="https://support.stylemixthemes.com/" class="wizard-finish__links_block" target="_blank">
				<div class="wizard-finish__links_block_wrapper">
					<div class="icon_wrapper">
						<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/welcome/help_desk.svg' ); ?>"/>
					</div>
					<span><?php esc_html_e( 'Help Desk', 'cost-calculator-builder' ); ?></span>
				</div>
			</a>
			<a href="https://stylemix.net/" class="wizard-finish__links_block" target="_blank">
				<div class="wizard-finish__links_block_wrapper">
					<div class="icon_wrapper">
						<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/welcome/customize.svg' ); ?>"/>
					</div>
					<span><?php esc_html_e( 'Customization', 'cost-calculator-builder' ); ?></span>
				</div>
			</a>
			<a href="https://www.facebook.com/groups/costcalculator" class="wizard-finish__links_block" target="_blank">
				<div class="wizard-finish__links_block_wrapper">
					<div class="icon_wrapper">
						<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/welcome/fc.svg' ); ?>"/>
					</div>
					<span><?php esc_html_e( 'Facebook Community', 'cost-calculator-builder' ); ?></span>
				</div>
			</a>
		</div>
		<div class="wizard-finish__bottom_banner">
			<div class="banner-content">
				<h3><?php esc_html_e( 'Unlock more extra features, unlimited form and more', 'cost-calculator-builder' ); ?></h3>
				<p><?php esc_html_e( 'Upgrade to Cost Calculator Pro for essential features: pro elements, conditions, contact form, payment methods, PDF entries, and field customization to make them required.', 'cost-calculator-builder' ); ?></p>
				<a href="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=ccb-backend-demo&utm_medium=10-discount&utm_campaign=get-ccb-pro-10-discount&plugin_coupon=BDEM10" target="_blank">
					<?php esc_html_e( 'Get Pro 10% Off', 'cost-calculator-builder' ); ?>
				</a>
			</div>
		</div>
		<div id="WelcomeModal" class="welcome-modal-overlay">
			<div class="welcome-modal-content">
				<iframe width="854" height="480" src="https://www.youtube.com/embed/XZKJE1CcYxo?si=MAIbmo6WSvScWDHz"></iframe>
			</div>
		</div>
	</div>
</div>
