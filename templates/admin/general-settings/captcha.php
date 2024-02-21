<div class="ccb-tab-container">
	<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
		<settings-pro-banner
			title="<?php esc_html_e( 'Captcha', 'cost-calculator-builder' ); ?>"
			subtitle="<?php esc_html_e( 'Available in PRO version', 'cost-calculator-builder' ); ?>"
			text="<?php esc_html_e( 'Protect your website by adding security forms.', 'cost-calculator-builder' ); ?>"
			link="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=global_settings_captcha"
			img="<?php echo esc_url( CALC_URL . '/frontend/dist/img/pro-features/captcha.webp' ); ?>"
			img-height="337px"
		/>
	<?php else : ?>
		<?php do_action( 'render-general-captcha' ); //phpcs:ignore ?>
	<?php endif; ?>
</div>
