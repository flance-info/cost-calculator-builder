<div class="ccb-tab-container" style="padding-bottom: 10px">
	<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
		<?php
		$check_list = array(
			'Get paid using different payment methods',
			'Easy integration with Stripe, Paypal and Razorpay APIs',
		);
		?>
		<div class="ccb-grid-box">
			<div class="container">
				<span class="ccb-tab-title" style="font-size: 18px; margin-bottom: 18px;"><?php esc_html_e( 'Payment gateway', 'cost-calculator-builder' ); ?></span>
				<single-pro-banner
					link="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=calc_settings_paypal"
					img="<?php echo esc_attr( esc_url( CALC_URL . '/frontend/dist/img/pro-features/pay.webp' ) ); ?>"
					width="657px"
					list='<?php echo wp_json_encode( $check_list ); ?>'
					video="https://youtu.be/mjU8B8lCXeI"
				/>
			</div>
		</div>
	<?php else : ?>
		<?php do_action( 'render-payment-gateway' ); //phpcs:ignore ?>
	<?php endif; ?>
</div>
