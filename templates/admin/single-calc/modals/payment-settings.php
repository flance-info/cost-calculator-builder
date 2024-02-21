<div class="modal-body payment-settings" v-if="currentPayment">
	<div class="ccb-payment-settings">
		<div class="ccb-grid-box ccb-payment-settings__content">
			<div class="container">
				<div class="row">
					<div class="col col-12">
						<span class="payment-title">{{ currentPayment.label }} <?php esc_html_e( 'Integration', 'cost-calculator-builder' ); ?></span>
					</div>
					<div class="col col-12" style="display: flex; flex-direction: column; width: 100%; margin: 10px 0 20px">
						<span class="payment-description"><?php esc_html_e( 'Read our documentation about getting paid from your website.', 'cost-calculator-builder' ); ?></span>
						<a v-if="currentPayment.slug === 'stripe'" href="https://docs.stylemixthemes.com/cost-calculator-builder/pro-plugin-features/stripe" target="_blank" class="payment-description ccb-link"><?php esc_html_e( 'How to integrate payments', 'cost-calculator-builder' ); ?></a>
						<a v-if="currentPayment.slug === 'razorpay'" href="https://docs.stylemixthemes.com/cost-calculator-builder/payments/razorpay" target="_blank" class="payment-description ccb-link"><?php esc_html_e( 'How to integrate payments', 'cost-calculator-builder' ); ?></a>
					</div>
				</div>
			</div>

			<template v-if="currentPayment.slug === 'stripe'">
				<div class="container">
					<div class="ccb-settings-property">
						<div class="row">
							<div class="col col-6 ccb-p-t-10" style="padding-right: 5px">
								<div class="ccb-input-wrapper">
									<span class="ccb-input-label"><?php esc_html_e( 'Stripe public key', 'cost-calculator-builder' ); ?></span>
									<input type="text" v-model="currentPayment.publishKey" placeholder="<?php esc_attr_e( 'Enter public key', 'cost-calculator-builder' ); ?>">
								</div>
							</div>
							<div class="col col-6 ccb-p-t-10" style="padding-left: 5px">
								<div class="ccb-input-wrapper">
									<span class="ccb-input-label"><?php esc_html_e( 'Stripe secret key', 'cost-calculator-builder' ); ?></span>
									<input type="text" v-model="currentPayment.secretKey" placeholder="<?php esc_attr_e( 'Enter secret key', 'cost-calculator-builder' ); ?>">
								</div>
							</div>
							<div class="col col-6 ccb-p-t-10" style="padding-right: 5px">
								<div class="ccb-input-wrapper">
									<span class="ccb-input-label"><?php esc_html_e( 'Currency', 'cost-calculator-builder' ); ?></span>
									<input type="text" v-model="currentPayment.currency" placeholder="<?php esc_attr_e( 'Enter currency', 'cost-calculator-builder' ); ?>">
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>

			<template v-if="currentPayment.slug === 'twoCheckout'">
				<div class="container">
					<div class="ccb-settings-property">
						<div class="row">
							<div class="col col-12 ccb-p-t-10">
								<div class="ccb-input-wrapper">
									<span class="ccb-input-label"><?php esc_html_e( '2Checkout Merchant Code', 'cost-calculator-builder' ); ?></span>
									<input type="text" v-model="currentPayment.merchantCode" placeholder="<?php esc_attr_e( 'Enter Merchant code', 'cost-calculator-builder' ); ?>">
								</div>
							</div>
							<div class="col col-6 ccb-p-t-10" style="padding-right: 5px">
								<div class="ccb-input-wrapper">
									<span class="ccb-input-label"><?php esc_html_e( '2Checkout Public Key', 'cost-calculator-builder' ); ?></span>
									<input type="text" v-model="currentPayment.publishKey" placeholder="<?php esc_attr_e( 'Enter Public Key', 'cost-calculator-builder' ); ?>">
								</div>
							</div>
							<div class="col col-6 ccb-p-t-10" style="padding-left: 5px">
								<div class="ccb-input-wrapper">
									<span class="ccb-input-label"><?php esc_html_e( '2Checkout Private Key', 'cost-calculator-builder' ); ?></span>
									<input type="text" v-model="currentPayment.privateKey" placeholder="<?php esc_attr_e( 'Enter Private Key', 'cost-calculator-builder' ); ?>">
								</div>
							</div>
							<div class="col col-6 ccb-p-t-10" style="padding-right: 5px">
								<div class="ccb-input-wrapper">
									<span class="ccb-input-label"><?php esc_html_e( 'Currency', 'cost-calculator-builder' ); ?></span>
									<input type="text" v-model="currentPayment.currency" placeholder="<?php esc_attr_e( 'Enter Currency', 'cost-calculator-builder' ); ?>">
								</div>
							</div>
							<div class="col col-6 ccb-p-t-10" style="padding-left: 5px">
								<div class="ccb-select-box">
									<span class="ccb-select-label"><?php esc_html_e( 'Mode', 'cost-calculator-builder' ); ?></span>
									<div class="ccb-select-wrapper">
										<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
										<select class="ccb-select" v-model="currentPayment.mode">
											<option value="test_mode"><?php esc_html_e( 'Test', 'cost-calculator-builder' ); ?></option>
											<option value="live_mode"><?php esc_html_e( 'Live', 'cost-calculator-builder' ); ?></option>
										</select>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>

			<template v-if="currentPayment.slug === 'razorpay'">
				<div class="container">
					<div class="ccb-settings-property">
						<div class="row">
							<div class="col col-6 ccb-p-t-10" style="padding-right: 5px">
								<div class="ccb-input-wrapper">
									<span class="ccb-input-label"><?php esc_html_e( 'Razorpay key ID', 'cost-calculator-builder' ); ?></span>
									<input type="text" v-model="currentPayment.keyId" placeholder="<?php esc_attr_e( 'Enter key ID', 'cost-calculator-builder' ); ?>">
								</div>
							</div>
							<div class="col col-6 ccb-p-t-10" style="padding-left: 5px;">
								<div class="ccb-input-wrapper">
									<span class="ccb-input-label"><?php esc_html_e( 'Razorpay secret key', 'cost-calculator-builder' ); ?></span>
									<input type="text" v-model="currentPayment.secretKey" placeholder="<?php esc_attr_e( 'Enter secret key', 'cost-calculator-builder' ); ?>">
								</div>
							</div>
							<div class="col col-6 ccb-p-t-10" style="padding-right: 5px;">
								<div class="ccb-input-wrapper">
									<span class="ccb-input-label"><?php esc_html_e( 'Currency', 'cost-calculator-builder' ); ?></span>
									<input type="text" v-model="currentPayment.currency" placeholder="<?php esc_attr_e( 'Enter currency', 'cost-calculator-builder' ); ?>">
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>

		<div class="ccb-payment-settings__footer">
			<div>
				<button type="button" class="ccb-button delete ccb-settings" @click.prevent="deletePayment">
					<span><?php esc_html_e( 'Delete', 'cost-calculator-builder' ); ?></span>
				</button>
			</div>
			<div style="display: flex; column-gap: 8px">
				<button type="button" class="ccb-button ccb-settings cancel" @click.prevent="closeModel">
					<span><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></span>
				</button>
				<button type="button" class="ccb-button success ccb-settings" @click.prevent="savePayment">
					<span><?php esc_html_e( 'Done', 'cost-calculator-builder' ); ?></span>
				</button>
			</div>
		</div>
	</div>
</div>
