export default {
  state: {
    tab: 'total-summary',
    forms: [],
    sp_list: [],
    pages: [],
    products: [],
    categories: [],
    desc_options: {},
    woo_meta_links: [],
    woo_meta_fields: ['price', 'quantity'],
    woo_actions: {
      set_value: 'Set value',
      set_value_disable: 'Set value and disable',
    },
    settings: {
      general: {
        tour_title: 'Summary block',
        tour_description: 'Edit the default view of the Total summary.',
        header_title: 'Summary',
        descriptions: true,
        hide_empty: true,
        hide_empty_for_orders_pdf_emails: true,
        sticky: false,
        show_option_unit: false,
        in_pro: false,
        icons: 'ccb-icon-new-calculator',
        slug: 'total-summary',
        styles: {
          toggle: '',
          checkbox: '',
          radio: '',
          checkbox_with_img: '',
          radio_with_img: '',
        },
      },
      currency: {
        tour_title: 'Currency',
        tour_description:
          'Set the currency sign and edit its default appearance.',
        currency: '$',
        num_after_integer: 2,
        decimal_separator: '.',
        thousands_separator: ',',
        currencyPosition: 'left_with_space',
        in_pro: false,
        icons: 'ccb-icon-Union-23',
        slug: 'currency',
      },

      texts: {
        tour_title: 'Warning texts',
        tour_description: 'Manage notifications of Calculator forms.',
        title: 'Your service request has been completed!',
        description: 'We have sent your request information to your email.',
        issued_on: 'Issued on',
        reset_btn: 'Create new calculation',
        invoice_btn: 'Get invoice',
        required_msg: 'This field is required',
        in_pro: false,
        icons: 'ccb-icon-Path-3601',
        slug: 'texts',
        form_fields: {
          email_format: 'Invalid email',
          email_field: 'Email is required',
          name_field: 'Name is required',
          phone_field: 'Phone number is required',
          terms_and_conditions_field:
            'Please, check out our terms and click on the checkbox',
        },
      },
      thankYouPage: {
        type: 'same_page',
        page_id: '',
        custom_page_link: '',
        title: 'Thank you for your order!',
        description: 'We have sent order details to your email.',
        order_title: 'Order ID',
        back_button_text: 'Back to calculator',
        download_button: false,
        download_button_text: 'Download PDF',
        share_button: false,
        share_button_text: 'Send PDF to',
        custom_button: false,
        custom_button_text: 'Go to website',
        custom_button_link: '',
      },
      formFields: {
        tour_title: 'Order Form',
        tour_description: 'Choose contact form type and fill out settings.',
        fields: [],
        formulas: [],
        emailSubject: '',
        contactFormId: '',
        accessEmail: false,
        adminEmailAddress: '',
        customEmailAddresses: [],
        submitBtnText: 'Submit order',
        openModalBtnText: 'Make order',
        allowContactForm: false,
        body:
          'Dear sir/madam\n' +
          'We would be very grateful to you if you could provide us the quotation of the following:\n' +
          '\nTotal Summary\n' +
          '[ccb-subtotal]\n' +
          'Total: [ccb-total-0]\n' +
          'Looking forward to hearing back from you.\n' +
          'Thanks in advance',
        payment: false,
        paymentMethod: '',
        paymentMethods: [],
        in_pro: true,
        icons: 'ccb-icon-XMLID_426',
        slug: 'send-form',
        terms_and_conditions: {
          enable: false,
          checkbox: false,
          text: 'By clicking this box, I agree to your',
          page_id: '',
          link: '',
          link_text: '',
        },
      },
      sendFormFields: [
        { name: 'name', required: true, value: '' },
        { name: 'email', required: true, value: '' },
        { name: 'phone', required: true, value: '' },
        { name: 'message', required: false, value: '' },
      ],
      sendFormRequires: [
        { required: false },
        { required: false },
        { required: false },
        { required: false },
      ],
      woo_products: {
        tour_title: 'Woo Products',
        tour_description: 'Enables Calculator on the product page.',
        enable: false,
        category_id: '',
        category_ids: [],
        product_ids: [],
        by_category: true,
        by_product: false,
        hook_to_show: 'woocommerce_after_single_product_summary',
        hide_woo_cart: false,
        meta_links: [],
        in_pro: true,
        icons: 'ccb-icon-Union-17',
        slug: 'woo-products',
      },

      woo_checkout: {
        tour_title: 'Woo Checkout',
        tour_description: 'Enables WooCommerce Checkout.',
        enable: false,
        product_id: '',
        redirect_to: 'cart',
        description: '[ccb-total-0]',
        formulas: [],
        in_pro: true,
        icons: 'ccb-icon-Path-3498',
        slug: 'woo-checkout',
        replace_product: true,
      },

      payment_gateway: {
        slug: 'payment-gateway',
        icons: 'ccb-icon-Path-3500',
        tour_title: 'Payment Gateways',
        tour_description: 'Set-up your payments',
        in_pro: true,
        cards: {
          enable: false,
          card_payments: {
            stripe: {
              enable: false,
              secretKey: '',
              publishKey: '',
              currency: 'USD',
              mode: 'test_mode',
              payment_type: 'same_page',
              label: 'Stripe',
              payment_logo_width: '68px',
              slug: 'stripe',
              logo: `${window.ajax_window.plugin_url}/frontend/dist/img/stripe.svg`,
            },
            razorpay: {
              enable: false,
              keyId: '',
              secretKey: '',
              payment_type: 'same_page',
              currency: 'USD',
              label: 'Razorpay',
              payment_logo_width: '112px',
              slug: 'razorpay',
              logo: `${window.ajax_window.plugin_url}/frontend/dist/img/razorpay.png`,
            },
          },
        },
        paypal: {
          enable: false,
          paypal_email: '',
          currency_code: '',
          paypal_mode: 'sandbox',
          formulas: [],
          in_pro: true,
          slug: 'paypal',
        },
        cash_payment: {
          enable: false,
          label: 'Cash Payment',
          type: '',
        },
        formulas: [],
      },

      webhooks: {
        tour_title: 'Webhooks',
        tour_description: 'Enables custom webhooks for different events.',
        enableSendForms: false,
        enablePaymentBtn: false,
        enableEmailQuote: false,
        send_form_url: '',
        payment_btn_url: '',
        email_quote_url: '',
        secret_key_send_form: '',
        secret_key_payment_btn: '',
        secret_key_email_quote: '',
        in_pro: true,
        icons: 'ccb-icon-Webhooks',
        slug: 'webhooks',
      },

      recaptcha: {
        enable: false,
        type: 'v2',
        v2: {
          siteKey: '',
          secretKey: '',
        },

        v3: {
          siteKey: '',
          secretKey: '',
        },

        options: {
          v2: 'Google reCAPTCHA v2',
          v3: 'Google reCAPTCHA v3',
        },
      },
      notice: {
        requiredField: 'This field is required',
      },
      title: 'Untitled',
      icon: 'fas fa-cogs',
      type: 'Cost Calculator Settings',
    },
  },
  mutations: {
    setSpList(state, list) {
      state.sp_list = list;
    },

    setDescOptions(state, options) {
      state.desc_options = options || {};
    },

    updateAll(state, response) {
      state.desc_options = response.desc_options;
      state.forms = response.forms;
      state.sp_list = response.sp_list;
      state.pages = response.pages;
      state.products = response.products;
      state.categories = response.categories;
      state.woo_meta_links =
        typeof response.settings?.woo_products?.meta_links !== 'undefined'
          ? response.settings.woo_products.meta_links
          : [];

      if (response.settings && response.settings.general)
        state.settings = this._vm.$validateData(
          this._vm.$deepMerge(state.settings, response.settings)
        );
    },

    updateSettings(state, settings) {
      if (settings?.hasOwnProperty('general'))
        state.settings = this._vm.$validateData(
          this._vm.$deepMerge(state.settings, settings)
        );
    },

    updateCalcId(state, id) {
      state.settings.calc_id = id;
    },

    addWooMetaLink(state) {
      const defaultLink = {
        woo_meta: '',
        action: '',
        calc_field: '',
      };
      state.woo_meta_links.push(defaultLink);
      state.settings.woo_products.meta_links = [...state.woo_meta_links];
    },

    updateWooMetaLinks(state, links) {
      state.woo_meta_links = links;
      state.settings.woo_products.meta_links = [...state.woo_meta_links];
    },

    updateWooCategoryIds(state, ids) {
      state.settings.woo_products.category_ids = ids;
    },

    updateWooProductIds(state, ids) {
      state.settings.woo_products.product_ids = ids;
    },

    updateTab(state, tab) {
      state.tab = tab;
    },

    updateGrandTotal(state) {
      if (!state.settings.general.descriptions) {
        state.settings.general.hide_empty = false;
        state.settings.general.hide_empty_for_orders_pdf_emails = false;
        state.settings.general.show_details_accordion = false;
        state.settings.general.show_option_unit = false;
      }
    },
  },
  getters: {
    getTab: (state) => state.tab,
    getForms: (state) => state.forms,
    getSpList: (state) => state.sp_list,
    getSettings: (state) => state.settings,
    getPages: (state) => state.pages,
    getProducts: (state) => state.products,
    getCategories: (state) => state.categories,
    getCalcId: (state) => state.settings.calc_id,
    getDescOptions: (state) => state.desc_options,
    getWooMetaLinks: (state) => state.woo_meta_links,
    getWooMetaFields: (state) => state.woo_meta_fields,
    getWooActions: (state) => state.woo_actions,
  },
};
