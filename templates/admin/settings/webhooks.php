<div class="ccb-tab-container">
	<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
		<?php
		$check_list = array(
			'Connect 5000+ apps and activate webhooks for calculators',
			'Automate data exchange and actions triggered by events.',
		);
		?>
		<div class="ccb-grid-box">
			<div class="container">
				<span class="ccb-tab-title" style="font-size: 18px; margin-bottom: 18px;"><?php esc_html_e( 'Webhooks', 'cost-calculator-builder' ); ?></span>
				<single-pro-banner
					link="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=custom_webhooks"
					img="<?php echo esc_attr( esc_url( CALC_URL . '/frontend/dist/img/pro-features/img-webhook.webp' ) ); ?>"
					width="657px"
					list='<?php echo wp_json_encode( $check_list ); ?>'
					video="https://youtu.be/N7PaFFs0zMM"
				/>
			</div>
		</div>
	<?php else : ?>
		<?php do_action( 'render-webhooks' ); //phpcs:ignore ?>
	<?php endif; ?>
</div>
