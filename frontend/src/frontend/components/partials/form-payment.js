import fieldsMixin from '../fields/fieldsMixin';
import PaymentHelper from '../../../utils/payments';

export default {
  mixins: [fieldsMixin],

  data: () => ({
    nonces: window.ccb_nonces,
    loader: false,
    payments: [
      { slug: 'paypal', name: 'PayPal', requiredSettingFields: [] },
      { slug: 'stripe', name: 'Stripe', requiredSettingFields: ['publishKey'] },
      {
        slug: 'razorpay',
        name: 'Razorpay',
        requiredSettingFields: ['keyId', 'secretKey'],
      },
      {
        slug: 'woo_checkout',
        name: 'Woo Checkout',
        requiredSettingFields: ['product_id'],
      },
      { slug: 'cash_payment', name: 'Cash payment', requiredSettingFields: [] },
    ],
    stripe: {
      stripe: '',
      stripeCard: '',
      stripeComplete: '',
      stripeClientSecret: '',
    },
    paymentForm: {
      status: false,
      access: true,
      orderId: null,
      sendFields: [
        { name: 'name', required: true, value: '' },
        { name: 'email', required: true, value: '' },
        { name: 'phone', required: true, value: '' },
        { name: 'message', required: false, value: '' },
      ],
      errorCaptcha: false,
      errorMessage: false,
      successMessage: false,

      requires: [
        { required: false },
        { required: false },
        { required: false },
        { required: false },
      ],
    },
    payment: {
      status: '',
      message: '',
    },
  }),

  computed: {
    appearance() {
      return this.$store.getters.getAppearance;
    },

    formulas() {
      return this.$store.getters.getSettings?.payment_gateway?.formulas;
    },

    getCashPaymentSettings() {
      const payment_gateway =
        this.$store.getters.getSettings.payment_gateway || {};
      return payment_gateway.cash_payment || {};
    },

    getPayPalSettings() {
      const payment_gateway =
        this.$store.getters.getSettings.payment_gateway || {};
      return payment_gateway.paypal || {};
    },

    getStripeSettings() {
      const settings = this.$store.getters.getSettings;
      return settings?.payment_gateway?.cards?.card_payments?.stripe || {};
    },

    getTwoCheckoutSettings() {
      const settings = this.$store.getters.getSettings;
      return settings?.payment_gateway?.cards?.card_payments?.twoCheckout || {};
    },

    getRazorpaySettings() {
      const settings = this.$store.getters.getSettings;
      return settings?.payment_gateway?.cards?.card_payments?.razorpay || {};
    },

    btnStyles() {
      const btnAppearance = this.getElementAppearanceStyleByPath(
        this.appearance,
        'elements.primary_button.data'
      );
      let result = {};

      result['padding'] = [0, btnAppearance['field_side_indents']].join('px ');
      Object.keys(btnAppearance).forEach((key) => {
        if (key === 'background') {
          result = { ...result, ...btnAppearance[key] };
        } else if (key === 'shadow') {
          result['box-shadow'] = btnAppearance[key];
        } else {
          result[key] = btnAppearance[key];
        }
      });

      return result;
    },

    orderId() {
      return this.$store.getters.getOrderId;
    },

    paymentMethod: {
      get() {
        return this.$store.getters.getMethod;
      },

      set(value) {
        this.formRequiredFields = [];
        this.payment.status = '';
        this.payment.message = '';

        if (value === 'stripe') {
          this.generateStripe();
        }

        if (value === 'twoCheckout') {
          this.generateTwoCheckoutToken();
        }

        if (value === 'razorpay') {
          // console.log('razorpay 2');
        }

        this.$store.dispatch('updateMethodAction', value);
      },
    },

    settings() {
      return this.$store.getters.getSettings;
    },

    showStripeCard: {
      get() {
        return this.$store.getters.getHideCalc;
      },

      set(val) {
        this.$store.commit('updateHideCalc', val);
      },
    },

    stripeSettings() {
      const payment_gateway = this.settings.payment_gateway || {};
      return this.settings
        ? Object.assign({}, payment_gateway?.cards?.card_payments?.stripe)
        : {};
    },
  },

  methods: {
    async applyPayment() {
      if (this.$store.getters.hasUnusedFields) {
        this.loader = false;
        const [first] = this.$store.getters.getUnusedFields;
        if (first?.alias) this.scrollIntoRequired(first.alias);
        return;
      }

      this.formRequiredFields = [];
      const requiredFields =
        this.$store.getters.getSettings.texts?.form_fields || {};

      let validInputData = false;
      this.paymentForm.sendFields.forEach((element, index) => {
        const key = `${element.name}_field`;
        if (element.required && !(element.value.length > 0)) {
          this.paymentForm.requires[index].required = true;
          validInputData = true;

          const message = requiredFields[key];
          this.formRequiredFields.push({ key, message });
        } else this.paymentForm.requires[index].required = false;
      });

      let idx;
      const email = this.paymentForm.sendFields.find((f, i) => {
        if (f.name === 'email') {
          idx = i;
          return f;
        }
      });

      if (!validInputData && !this.isValidEmail(email.value)) {
        validInputData = true;
        this.paymentForm.requires[idx].required = true;
        this.formRequiredFields.push({
          key: 'email_field',
          message: requiredFields.email_format,
        });
      }

      if (!validInputData) {
        this.loader = false;
        return;
      }

      this.loader = true;
      const self = this;
      const descriptions = this.$store.getters.getDescriptions();

      const data = {
        descriptions,
        nonce: this.nonces.ccb_payment,
        action: 'ccb_payment',
        item_name: this.settings.title,
        method: this.paymentMethod,
        calcTotals: this.getFormTotals,
        order_id: this.orderId,
        calcId: this.settings.calc_id,
      };

      if (this.paymentMethod === 'stripe') {
        await this.stripe.stripe
          .createPaymentMethod('card', this.stripe.stripeCard)
          .then(async (cardResult) => {
            if (
              cardResult.error !== undefined &&
              cardResult.error.message !== undefined
            ) {
              this.showPaymentNotice('error', cardResult.error.message);
            } else {
              let payment_data = Object.assign({}, data);
              payment_data.paymentMethodId = cardResult.paymentMethod.id;
              payment_data.action_type = 'intent_payment';

              await this.$store
                .dispatch('fetchPayment', payment_data)
                .then(async (response) => {
                  if (response.status === 'success') {
                    if (response.requiresAction) {
                      // Card requires Auhentication
                      await this.handleStripeCard(response, self);
                    } else {
                      // Order Complete
                      this.$store.dispatch(
                        'completeOrder',
                        this.$store.getters.getOrderId
                      );
                      this.stripe.stripeClientSecret = response.clientSecret;
                    }
                  } else {
                    this.showPaymentNotice(response.status, response.message);
                    this.stripe.stripeClientSecret = false;
                  }
                });

              if (this.stripe.stripeClientSecret) {
                await this.stripe.stripe
                  .retrievePaymentIntent(this.stripe.stripeClientSecret)
                  .then((retrieve_result) => {
                    data.token_id = retrieve_result.paymentIntent.id;
                    this.getStep = 'finish';
                    this.$store.commit('setPaymentType', this.paymentMethod);
                  });
              }
            }
          });
      }

      if (data.action) {
        if (this.paymentMethod !== 'razorpay') {
          const result = await this.$store.dispatch('fetchPayment', data);
          if (this.paymentMethod === 'cash_payment') {
            setTimeout(() => {
              this.getStep = 'finish';
              this.$store.commit('setPaymentType', this.paymentMethod);
              this.loader = false;
            }, 1000);
          }
          return result;
        } else {
          await this.activatedRazorpay(data);
        }
      }
    },

    async applyWoo(post_id) {
      this.wooApply(post_id, this);
    },

    showPaymentNotice(status, message) {
      this.loader = false;
      if (this.getStep !== 'finish') {
        this.getStep = 'notice';
        this.noticeData = {
          type: status,
          title: message,
        };
      }
    },
    ...PaymentHelper,
  },
};
