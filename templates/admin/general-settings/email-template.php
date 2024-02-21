<div class="ccb-tab-container">
	<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
		<settings-pro-banner
			title="<?php esc_html_e( 'Email template', 'cost-calculator-builder' ); ?>"
			subtitle="<?php esc_html_e( 'Available in PRO version', 'cost-calculator-builder' ); ?>"
			text="<?php esc_html_e( 'Customize your emails from the Contact form to match your brand style.', 'cost-calculator-builder' ); ?>"
			link="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=email_template"
			img="<?php echo esc_attr( CALC_URL . '/frontend/dist/img/pro-features/email-template.webp' ); ?>"
			img-height="443px"
		/>
	<?php else : ?>
		<?php do_action( 'render-general-email-template' ); //phpcs:ignore ?>
	<?php endif; ?>
</div>
