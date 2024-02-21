<div class="ccb-tab-container" style="height: 100%">
	<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
		<?php
		$check_list = array(
			'Add a calculator to Woocommerce checkout',
			'Redirect users to the Cart or Checkout page',
			'Improve user convenience and encourage multiple purchases.',
			'Get smooth transactions through WooCommerce Checkout',
		);
		?>

		<div class="ccb-grid-box">
			<div class="container">
				<span class="ccb-tab-title" style="font-size: 18px; margin-bottom: 18px;"><?php esc_html_e( 'Woo Checkout', 'cost-calculator-builder' ); ?></span>
				<single-pro-banner
					link="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=woo_checkout"
					img="<?php echo esc_attr( esc_url( CALC_URL . '/frontend/dist/img/pro-features/img-woocheckout.webp' ) ); ?>"
					width="657px"
					list='<?php echo wp_json_encode( $check_list ); ?>'
					video="https://youtu.be/vO-JlXKvwes"
				/>
			</div>
		</div>
	<?php else : ?>
		<?php do_action( 'render-woo-checkout' ); //phpcs:ignore ?>
	<?php endif; ?>
</div>
