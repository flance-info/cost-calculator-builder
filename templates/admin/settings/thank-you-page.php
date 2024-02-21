<div class="ccb-tab-container thank-you-page-main" :class="[`ccb-thank-you-${$store.getters.getId}`]" style="padding: <?php echo esc_attr( defined( 'CCB_PRO_VERSION' ) ? '0' : '30px 20px' ); ?>">
	<?php if ( ! defined( 'CCB_PRO' ) ) : ?>

		<?php
		$check_list = array(
			'Show custom confirmation pages when someone makes an order',
			'Put the Confirmation Page right on the calculator page or as a popup',
		);
		?>
		<div class="ccb-grid-box">
			<div class="container">
				<span class="ccb-tab-title" style="font-size: 18px; margin-bottom: 18px;"><?php esc_html_e( 'Confirmation Page', 'cost-calculator-builder' ); ?></span>
				<single-pro-banner
					link="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=confirmationpage"
					img="<?php echo esc_attr( esc_url( CALC_URL . '/frontend/dist/img/pro-features/img-confirmation.webp' ) ); ?>"
					width="657px"
					list='<?php echo wp_json_encode( $check_list ); ?>'
				/>
			</div>
		</div>
	<?php else : ?>
		<?php do_action( 'render-thank-you-page' ); //phpcs:ignore ?>
	<?php endif; ?>
</div>
