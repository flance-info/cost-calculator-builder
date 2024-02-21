<div class="ccb-tab-container">
	<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
		<settings-pro-banner
			title="<?php esc_html_e( 'Backup settings', 'cost-calculator-builder' ); ?>"
			subtitle="<?php esc_html_e( 'Available in PRO version', 'cost-calculator-builder' ); ?>"
			text="<?php esc_html_e( 'You can restore  up to last 3 saved  changes, Each save creates a backup', 'cost-calculator-builder' ); ?>"
			link="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=backup_settings"
			img="<?php echo esc_url( CALC_URL . '/frontend/dist/img/pro-features/backup-pro.webp' ); ?>"
			img-height="443px"
		/>
	<?php else : ?>
		<?php do_action( 'render-backup-settings' ); //phpcs:ignore ?>
	<?php endif; ?>
</div>
