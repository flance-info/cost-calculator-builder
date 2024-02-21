<div class="ccb-tab-container">
	<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
		<settings-pro-banner
			title="<?php esc_html_e( 'Contact form', 'cost-calculator-builder' ); ?>"
			subtitle="<?php esc_html_e( 'Available in PRO version', 'cost-calculator-builder' ); ?>"
			text="<?php esc_html_e( 'Customize the email from the Contact form with settings such as Email, Subject, and Button Text.', 'cost-calculator-builder' ); ?>"
			link="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=email_settings"
			img="<?php echo esc_attr( CALC_URL . '/frontend/dist/img/pro-features/contact-form.webp' ); ?>"
			img-height="290px"
		/>
	<?php else : ?>
		<?php do_action( 'render-general-email' ); //phpcs:ignore ?>
	<?php endif; ?>
</div>
