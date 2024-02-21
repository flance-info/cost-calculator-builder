<div class="ccb-tab-container">
	<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
		<?php
			$check_list = array(
				'Write the email address for outgoing messages',
				'Define the subject line for the email',
				'Customize the text displayed on the Submit button',
				'Choose payment gateways after form submission',
			);
			?>
		<div class="ccb-grid-box">
			<div class="container">
				<span class="ccb-tab-title" style="font-size: 18px; margin-bottom: 18px;">Order form</span>
				<single-pro-banner
					link="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=send_form"
					img="<?php echo esc_attr( esc_url( CALC_URL . '/frontend/dist/img/pro-features/img-orderform.webp' ) ); ?>"
					width="657px"
					list='<?php echo wp_json_encode( $check_list ); ?>'
					video="https://youtu.be/0nP4aIX6-HI"
				/>
			</div>
		</div>
	<?php else : ?>
		<?php do_action( 'render-send-form' ); //phpcs:ignore ?>
	<?php endif; ?>
</div>
