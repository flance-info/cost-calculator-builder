<?php

namespace cBuilder\Classes;

class CCBSettingsData {
	public static function get_tab_pages() {
		return array( 'calculator', 'conditions', 'settings', 'customize' );
	}

	public static function settings_data() {
		return array(
			'general'         => array(
				'header_title'           => 'Total Summary',
				'descriptions'           => true,
				'hide_empty'             => true,
				'sticky'                 => false,
				'show_details_accordion' => true,
				'show_option_unit'       => true,
				'styles'                 => array(
					'radio'             => '',
					'checkbox'          => '',
					'toggle'            => '',
					'radio_with_img'    => '',
					'checkbox_with_img' => '',
				),
			),
			'currency'        => array(
				'currency'            => '$',
				'num_after_integer'   => 2,
				'decimal_separator'   => '.',
				'thousands_separator' => ',',
				'currencyPosition'    => 'left_with_space',
			),
			'texts'           => array(
				'invoice_btn'  => 'Get invoice',
				'required_msg' => 'This field is required',
				'form_fields'  => array(
					'email_format'               => 'Invalid email',
					'email_field'                => 'Email is required',
					'name_field'                 => 'Name is required',
					'phone_field'                => 'Phone number is required',
					'terms_and_conditions_field' => 'Please, check out our terms and click on the checkbox',
				),
			),
			'thankYouPage'    => array(
				'type'                 => 'same_page',
				'page_id'              => '',
				'custom_page_link'     => '',
				'title'                => 'Thank you for your order!',
				'description'          => 'We have sent order details to your email.',
				'order_title'          => 'Order ID',
				'back_button_text'     => 'Back to calculator',
				'download_button'      => false,
				'download_button_text' => 'Download PDF',
				'share_button'         => false,
				'share_button_text'    => 'Send PDF to',
				'custom_button'        => false,
				'custom_button_text'   => 'Go to website',
				'custom_button_link'   => get_home_url(),
			),
			'formFields'      => array(
				'fields'               => array(),
				'emailSubject'         => '',
				'contactFormId'        => '',
				'accessEmail'          => false,
				'adminEmailAddress'    => '',
				'formulas'             => array(),
				'openModalBtnText'     => __( 'Make order', 'cost-calculator-builder' ),
				'submitBtnText'        => __( 'Submit order', 'cost-calculator-builder' ),
				'allowContactForm'     => false,
				'body'                 => 'Dear sir/madam\n' .
					'We would be very grateful to you if you could provide us the quotation of the following=>\n' .
					'\nTotal Summary\n' .
					'[ccb-subtotal]\n' .
					'Total: [ccb-total-0]\n' .
					'Looking forward to hearing back from you.\n' .
					'Thanks in advance',
				'payment'              => false,
				'paymentMethod'        => '',
				'accessTermsEmail'     => false,
				'terms_and_conditions' => array(
					'checkbox'  => false,
					'text'      => 'By clicking this box, I agree to your',
					'page_id'   => '',
					'link'      => '',
					'link_text' => '',
				),
			),
			'woo_products'    => array(
				'enable'        => false,
				'category_id'   => '',
				'hook_to_show'  => 'woocommerce_after_single_product_summary',
				'hide_woo_cart' => false,
				'meta_links'    => array(),
				'category_ids'  => array(),
				'product_ids'   => array(),
				'by_category'   => true,
				'by_product'    => false,
			),
			'woo_checkout'    => array(
				'enable'      => false,
				'product_id'  => '',
				'redirect_to' => 'cart',
				'description' => '[ccb-total-0]',
				'formulas'    => array(),
			),
			'payment_gateway' => array(
				'cards'        => array(
					'enable'        => false,
					'card_payments' => array(
						'stripe'   => array(
							'enable'             => false,
							'secretKey'          => '',
							'publishKey'         => '',
							'currency'           => 'USD',
							'mode'               => 'test_mode',
							'payment_type'       => 'same_page',
							'logo'               => CALC_URL . '/frontend/dist/img/stripe.svg',
							'label'              => 'Stripe',
							'slug'               => 'stripe',
							'payment_logo_width' => '68px',
						),
						'razorpay' => array(
							'enable'             => false,
							'keyId'              => '',
							'secretKey'          => '',
							'currency'           => 'USD',
							'payment_type'       => 'same_page',
							'logo'               => CALC_URL . '/frontend/dist/img/razorpay.png',
							'label'              => 'Razorpay',
							'slug'               => 'razorpay',
							'payment_logo_width' => '88px',
						),
					),
				),
				'paypal'       => array(
					'enable'        => false,
					'paypal_email'  => '',
					'currency_code' => '',
					'paypal_mode'   => '',
				),
				'cash_payment' => array(
					'enable' => false,
					'label'  => 'Cash Payment',
					'type'   => '',
				),
				'formulas'     => array(),
			),
			'webhooks'        => array(
				'enableSendForms'        => false,
				'enablePaymentBtn'       => false,
				'enableEmailQuote'       => false,
				'send_form_url'          => '',
				'payment_btn_url'        => '',
				'email_quote_url'        => '',
				'secret_key_send_form'   => '',
				'secret_key_payment_btn' => '',
				'secret_key_email_quote' => '',
			),
			'recaptcha_type'  => array(
				'v2' => 'Google reCAPTCHA v2',
				'v3' => 'Google reCAPTCHA v3',
			),
			'recaptcha_v3'    => array(
				'siteKey'   => '',
				'secretKey' => '',
			),
			'recaptcha'       => array(
				'enable'  => false,
				'type'    => 'v2',
				'options' => array(
					'v2' => 'Google reCAPTCHA v2',
					'v3' => 'Google reCAPTCHA v3',
				),
				'v2'      => array(
					'siteKey'   => '',
					'secretKey' => '',
				),
				'v3'      => array(
					'siteKey'   => '',
					'secretKey' => '',
				),
			),
			'notice'          => array(
				'requiredField' => 'This field is required',
			),
			'icon'            => 'fas fa-cogs',
			'type'            => 'Cost Calculator Settings',
		);
	}

	public static function general_settings_data() {
		return array(
			'currency'        => array(
				'use_in_all'          => false,
				'currency'            => '$',
				'num_after_integer'   => 2,
				'decimal_separator'   => '.',
				'thousands_separator' => ',',
				'currencyPosition'    => 'left_with_space',
			),
			'invoice'         => array(
				'use_in_all'       => false,
				'companyName'      => '',
				'companyInfo'      => '',
				'companyLogo'      => '',
				'showAfterPayment' => true,
				'fromEmail'        => '',
				'fromName'         => '',
				'emailButton'      => false,
				'submitBtnText'    => 'Send',
				'btnText'          => 'Send Quote',
				'successText'      => 'Email Quote Successfully Sent!',
				'errorText'        => 'Fill in the required fields correctly.',
				'closeBtn'         => 'Close',
				'buttonText'       => 'PDF Download',
				'dateFormat'       => 'MM/DD/YYYY HH:mm',
			),
			'email_templates' => array(
				'title'           => 'Calculation result',
				'description'     => 'This email is automatically generated and does not require a response. If you have a question, please contact: support@example.com',
				'logo'            => '',
				'logo_position'   => 'left',
				'footer'          => true,
				'template_color'  => array(
					'value'   => '#EEF1F7',
					'type'    => 'color',
					'default' => '#EEF1F7',
				),
				'content_bg'      => array(
					'value'   => '#FFFFFF',
					'type'    => 'color',
					'default' => '#FFFFFF',
				),
				'main_text_color' => array(
					'value'   => '#001931',
					'type'    => 'color',
					'default' => '#001931',
				),
				'border_color'    => array(
					'value'   => '#ddd',
					'type'    => 'color',
					'default' => '#ddd',
				),
				'button_color'    => array(
					'value'   => '#00B163',
					'type'    => 'color',
					'default' => '#00B163',
				),
			),
			'form_fields'     => array(
				'use_in_all'           => false,
				'emailSubject'         => '',
				'adminEmailAddress'    => '',
				'openModalBtnText'     => __( 'Submit order', 'cost-calculator-builder' ),
				'submitBtnText'        => __( 'Make order', 'cost-calculator-builder' ),
				'terms_use_in_all'     => false,
				'terms_and_conditions' => array(
					'checkbox'  => false,
					'text'      => 'By clicking this box, I agree to your',
					'page_id'   => '',
					'link'      => '',
					'link_text' => '',
				),
			),
			'backup_settings' => array(
				'auto_backup' => false,
			),
			'recaptcha'       => array(
				'use_in_all' => false,
				'enable'     => false,
				'type'       => 'v2',
				'v3'         => array(
					'siteKey'   => '',
					'secretKey' => '',
				),
				'v2'         => array(
					'siteKey'   => '',
					'secretKey' => '',
				),
				'options'    => array(
					'v2' => 'Google reCAPTCHA v2',
					'v3' => 'Google reCAPTCHA v3',
				),
			),
			'payment_gateway' => array(
				'cards'        => array(
					'use_in_all'    => false,
					'card_payments' => array(
						'stripe'   => array(
							'enable'             => false,
							'secretKey'          => '',
							'publishKey'         => '',
							'currency'           => 'USD',
							'mode'               => 'test_mode',
							'payment_type'       => 'same_page',
							'logo'               => CALC_URL . '/frontend/dist/img/stripe.svg',
							'label'              => 'Stripe',
							'slug'               => 'stripe',
							'payment_logo_width' => '68px',
						),
						'razorpay' => array(
							'enable'             => false,
							'keyId'              => '',
							'secretKey'          => '',
							'currency'           => 'USD',
							'payment_type'       => 'same_page',
							'logo'               => CALC_URL . '/frontend/dist/img/razorpay.png',
							'label'              => 'Razorpay',
							'slug'               => 'razorpay',
							'payment_logo_width' => '112px',
						),
					),
				),
				'paypal'       => array(
					'use_in_all'    => false,
					'paypal_email'  => '',
					'currency_code' => '',
					'paypal_mode'   => '',
				),
				'cash_payment' => array(
					'use_in_all' => false,
					'label'      => 'Cash Payment',
					'type'       => '',
				),
				'formulas'     => array(),
			),
		);
	}

	public static function get_settings_pages() {
		return array(
			array(
				'type'  => 'basic',
				'title' => __( 'Summary block ', 'cost-calculator-builder' ),
				'slug'  => 'total-summary',
				'icon'  => 'ccb-icon-new-calculator',
			),
			array(
				'type'  => 'basic',
				'title' => __( 'Currency', 'cost-calculator-builder' ),
				'slug'  => 'currency',
				'icon'  => 'ccb-icon-Union-23',
			),
			array(
				'type'  => 'basic',
				'title' => __( 'Warning texts', 'cost-calculator-builder' ),
				'slug'  => 'texts',
				'icon'  => 'ccb-icon-Path-3601',
			),
			array(
				'type'      => 'basic',
				'title'     => __( 'Confirmation page', 'cost-calculator-builder' ),
				'slug'      => 'thank-you-page',
				'icon'      => 'ccb-icon-Check-Circle-new',
				'component' => 'confirmation-page',
			),
			array(
				'type'  => 'pro',
				'title' => __( 'Order Form', 'cost-calculator-builder' ),
				'slug'  => 'send-form',
				'icon'  => 'ccb-icon-XMLID_426',
			),
			array(
				'type'  => 'pro',
				'title' => __( 'Woo Products', 'cost-calculator-builder' ),
				'slug'  => 'woo-products',
				'icon'  => 'ccb-icon-Union-17',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Woo Checkout', 'cost-calculator-builder' ),
				'slug'  => 'woo-checkout',
				'icon'  => 'ccb-icon-Path-3498',
			),
			array(
				'type'  => 'pro',
				'title' => __( 'Payments', 'cost-calculator-builder' ),
				'slug'  => 'payment-gateway',
				'icon'  => 'ccb-icon-Browser',
			),
			array(
				'type'  => 'pro',
				'title' => __( 'Webhooks', 'cost-calculator-builder' ),
				'slug'  => 'webhooks',
				'icon'  => 'ccb-icon-Webhooks',
			),
		);
	}

	public static function get_general_settings_pages() {
		return array(
			array(
				'type'  => 'basic',
				'title' => __( 'Currency', 'cost-calculator-builder' ),
				'slug'  => 'currency',
				'icon'  => 'ccb-icon-Union-23',
			),

			array(
				'type'  => 'basic',
				'title' => __( 'PDF Entries', 'cost-calculator-builder' ),
				'slug'  => 'invoice',
				'icon'  => 'ccb-icon-Path-3494',
			),

			array(
				'type'  => 'basic',
				'title' => __( 'Contact Form', 'cost-calculator-builder' ),
				'slug'  => 'email',
				'icon'  => 'ccb-icon-XMLID_426',
			),

			array(
				'type'  => 'basic',
				'title' => __( 'Email Template', 'cost-calculator-builder' ),
				'slug'  => 'email-template',
				'icon'  => 'ccb-icon-email-template',
			),

			array(
				'type'  => 'basic',
				'title' => __( 'Backup Settings', 'cost-calculator-builder' ),
				'slug'  => 'backup-settings',
				'icon'  => 'ccb-icon-History',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Captcha', 'cost-calculator-builder' ),
				'slug'  => 'captcha',
				'icon'  => 'ccb-icon-Path-3468',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Payments', 'cost-calculator-builder' ),
				'slug'  => 'payment-gateway',
				'icon'  => 'ccb-icon-Browser',
			),
		);
	}

	public static function get_tab_data() {
		return array(
			'calculators' => array(
				'icon'      => 'ccb-icon-new-calculator',
				'label'     => __( 'Create', 'cost-calculator-builder' ),
				'component' => 'ccb-calculator-tab',
			),
			'conditions'  => array(
				'icon'      => 'ccb-icon-path3745',
				'label'     => __( 'Conditions', 'cost-calculator-builder' ),
				'component' => '',
			),
			'settings'    => array(
				'icon'      => 'ccb-icon-Union-28',
				'label'     => __( 'Settings', 'cost-calculator-builder' ),
				'component' => 'ccb-settings-tab',
			),
			'appearances' => array(
				'icon'      => 'ccb-icon-Union-20',
				'label'     => __( 'Appearance', 'cost-calculator-builder' ),
				'component' => '',
			),
		);
	}

	public static function stm_calc_created_set_option( $post_id, $post, $update ) {
		if ( ! $update ) {
			return;
		}

		$created = get_option( 'stm_calc_created', false );
		if ( ! $created ) {
			$data = array(
				'show_time'   => time(),
				'step'        => 0,
				'prev_action' => '',
			);
			set_transient( 'stm_cost-calculator-builder_single_notice_setting', $data );
			update_option( 'stm_calc_created', true );
		}
	}

	public static function stm_admin_notice_rate_calc( $data ) {
		if ( is_array( $data ) ) {
			$data['title']   = 'Well done!';
			$data['content'] = 'You have built your first calculator up. Now please help us by rating <strong>Cost Calculator 5 Stars!</strong>';
		}

		return $data;
	}

	public static function get_calculator_settings( $calc_id ) {
		$general_settings = get_option( 'ccb_general_settings' );
		if ( ! $calc_id ) {
			return array(
				'settings'         => array(),
				'general_settings' => $general_settings,
			);
		}
		$settings = get_option( 'stm_ccb_form_settings_' . $calc_id );

		$is_need_product_data = self::is_have_woo_product_meta_links( $settings['woo_products'] );

		if ( function_exists( 'is_product' ) && $is_need_product_data ) {
			$settings['woo_products']['current_product'] = self::get_wc_product_data();
			$settings['woo_products']['is_product_page'] = is_product();
		}

		return ccb_sync_settings_from_general_settings( $settings, $general_settings, true );
	}

	private static function get_wc_product_data() {
		if ( defined( CCB_PRO_PATH ) && ! file_exists( CCB_PRO_PATH . '/includes/classes/CCBWooProducts.php' ) ) {
			return array();
		}
		require_once CCB_PRO_PATH . '/includes/classes/CCBWooProducts.php';

		return CCBWooProducts::get_current_product_stock_data();
	}

	/**  check is need to get product woocommerce product info for settings */
	private static function is_have_woo_product_meta_links( $woo_products_settings ) {
		if ( ! $woo_products_settings['enable'] ) {
			return false;
		}

		if ( ! function_exists( 'is_product' ) || ! is_product() ) {
			return false;
		}

		if ( count( $woo_products_settings['meta_links'] ) > 0 ) {
			return true;
		}

		return false;
	}
}
