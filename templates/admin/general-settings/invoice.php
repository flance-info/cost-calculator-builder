<div class="ccb-tab-container">
	<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
		<settings-pro-banner
			title="<?php esc_html_e( 'PDF Entries', 'cost-calculator-builder' ); ?>"
			subtitle="<?php esc_html_e( 'Available in PRO version', 'cost-calculator-builder' ); ?>"
			text="<?php esc_html_e( 'Let your users download the summary of their calculations in PDF.', 'cost-calculator-builder' ); ?>"
			link="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=pdf_entries"
			img="<?php echo esc_attr( CALC_URL . '/frontend/dist/img/pro-features/pdf-entries.webp' ); ?>"
			img-height="369px"
		/>
	<?php else : ?>
		<?php do_action( 'render-general-invoice' ); //phpcs:ignore ?>
	<?php endif; ?>
</div>
