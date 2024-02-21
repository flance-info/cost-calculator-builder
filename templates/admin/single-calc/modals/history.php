<div class="modal-body history">
	<div class="ccb-history">
		<div class="ccb-history__header">
			<span><?php esc_html_e( 'Previous version', 'cost-calculator-builder' ); ?></span>
		</div>
		<div class="ccb-history__content">
			<div class="ccb-history__content-item" v-for="sp in getSpList" :key="sp.key">
				<div class="ccb-history__content-item--icon-box">
					<i class="ccb-icon-Browser"></i>
				</div>
				<div class="ccb-history__content-item--title-box">
					<span><?php esc_html_e( 'Backup version', 'cost-calculator-builder' ); ?> </span>
					<span>{{ sp.timestamp }} ({{ sp.created }})</span>
				</div>
				<div class="ccb-history__content-item--action-box">
					<button class="ccb-button embed" @click.prevent="() => restoreSettings(sp.key)">
						<span class="calc-save-btn-txt">
							<?php esc_html_e( 'Restore', 'cost-calculator-builder' ); ?>
						</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
