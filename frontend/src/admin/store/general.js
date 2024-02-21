import fetchRequest from '@plugins/fetchRequest';
import { toast } from '../../utils/toast';

export default {
  state: {
    dataLoaded: false,
    generalSettings: {
      currency: {
        use_in_all: false,
        currency: '$',
        num_after_integer: 2,
        decimal_separator: '.',
        thousands_separator: ',',
        currencyPosition: 'left_with_space',
      },
      invoice: {
        use_in_all: false,
        companyName: '',
        companyInfo: '',
        companyLogo: '',
        showAfterPayment: true,
        emailButton: false,
        submitBtnText: 'Send',
        btnText: 'Send Quote',
        closeBtn: 'Close',
        successText: 'Email Quote Successfully Sent!',
        errorText: 'Fill in the required fields correctly.',
        fromEmail: '',
        fromName: '',
        buttonText: 'PDF Download',
        dateFormat: 'MM/DD/YYYY HH:mm',
      },
      email_templates: {
        title: 'Calculation result',
        description:
          'This email is automatically generated and does not require a response. If you have a question, please contact: support@example.com',
        logo: '',
        logo_position: 'left',
        footer: true,
        template_color: {
          value: '#EEF1F7',
          type: 'color',
          default: '#EEF1F7',
        },
        content_bg: {
          value: '#FFFFFF',
          type: 'color',
          default: '#FFFFFF',
        },
        main_text_color: {
          value: '#001931',
          type: 'color',
          default: '#001931',
        },
        border_color: {
          value: '#ddd',
          type: 'color',
          default: '#ddd',
        },
        button_color: {
          value: '#00B163',
          type: 'color',
          default: '#00B163',
        },
      },
      form_fields: {
        use_in_all: false,
        emailSubject: '',
        adminEmailAddress: '',
        openModalBtnText: 'Make order',
        submitBtnText: 'Submit order',
        customEmailAddresses: [],
        terms_use_in_all: false,
        terms_and_conditions: {
          checkbox: false,
          text: 'By clicking this box, I agree to your',
          page_id: '',
          link: '',
          link_text: '',
        },
      },
      recaptcha: {
        use_in_all: false,
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
      payment_gateway: {
        cards: {
          use_in_all: false,
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
              logo: `${window.ajax_window.plugin_url}/frontend/dist/img/2checkout.png`,
            },
          },
        },
        paypal: {
          use_in_all: false,
          paypal_email: '',
          currency_code: 'GBP',
          paypal_mode: 'sandbox',
        },
        cash_payment: {
          use_in_all: false,
          label: 'Cash Payment',
          type: '',
        },
        formulas: [],
      },
      backup_settings: {
        auto_backup: false,
      },
    },
    pages: [],
  },

  actions: {
    async saveGeneralSettings({ getters }) {
      const data = {
        settings: getters.getGeneralSettings,
        nonce: window.ccb_nonces.ccb_save_settings,
      };

      fetchRequest(
        `${window.ajaxurl}?action=calc_save_general_settings`,
        'POST',
        data
      )
        .then((response) => response.json())
        .then((response) => {
          if (response && response.success) {
            toast('Settings saved successfully', 'success');
          } else {
            toast('Something went wrong', 'error');
          }
        });
    },

    async setGeneralSettings({ commit }) {
      await fetchRequest(`${window.ajaxurl}?action=calc_get_general_settings`)
        .then((response) => response.json())
        .then((response) => {
          if (response && response.success) {
            commit('updateDataLoaded', true);
            if (response.data.currency)
              commit('updateGeneralSettings', response.data);
          }
        });
    },

    async getPagesAll({ commit }) {
      let formData = new FormData();
      formData.append('action', 'embed-get-pages');
      formData.append('nonce', window.ccb_nonces.embed_get_pages);

      let response = await fetch(window.ajax_window.ajax_url, {
        method: 'POST',
        body: formData,
      }).then((response) => response.json());
      commit('updatePagesAll', response);
    },
  },

  mutations: {
    updateGeneralSettings(state, settings) {
      state.generalSettings = this._vm.$validateData(
        this._vm.$deepMerge(state.generalSettings, settings)
      );
    },

    updateDataLoaded(state, value) {
      state.dataLoaded = value;
    },

    updatePagesAll(state, response) {
      state.pages = response.pages.map((page) => {
        return {
          id: page.id,
          title:
            page.title.length < 21
              ? page.title
              : page.title.substr(0, 20) + '...',
          tooltip: page.title,
          link: page.link,
        };
      });
    },
  },
  getters: {
    getGeneralSettings: (state) => state.generalSettings,
    getDataLoaded: (state) => state.dataLoaded,
    getPagesAll: (state) => state.pages,
  },
};
