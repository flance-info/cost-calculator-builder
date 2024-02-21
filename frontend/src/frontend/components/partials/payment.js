import Helpers from '../../../utils/helpers';
import PaymentHelper from '../../../utils/payments';
import fieldsMixin from '../fields/fieldsMixin';
export default {
  mixins: [fieldsMixin],
  props: {
    form: {
      default: false,
    },

    after: {
      default: '',
    },
  },

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
      { slug: 'cash_payment', name: 'Cash Payment', requiredSettingFields: [] },
    ],
    stripe: {
      stripe: '',
      stripeCard: '',
      stripeComplete: '',
      stripeClientSecret: '',
    },
    twoCheckout: {
      hideCard: true,
      cardNumber: '',
      month_and_year: '',
      cvv: '',
      zipCode: '',
      offsetWidth: 0,
      cardStyle: { transform: '' },
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
    getCardPlaceholder() {
      const texts = this.twoCheckout.cardNumber.split(' ');
      if (texts.length > 2) {
        return `${texts[0]} ${texts[1]} ${texts[2]}`;
      }
    },

    paymentDetailsList() {
      return ['paypal', 'stripe', 'cash_payment', 'twoCheckout', 'razorpay'];
    },

    formulas() {
      return this.$store.getters.getSettings?.payment_gateway?.formulas;
    },

    appearance() {
      return this.$store.getters.getAppearance;
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

    getHideCalc: {
      get() {
        return this.$store.getters.getHideCalc;
      },

      set(val) {
        this.$store.commit('updateHideCalc', val);
      },
    },

    getMethod: {
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

        this.$store.dispatch('updateMethodAction', value);
      },
    },

    getStripeSettings() {
      return this.getSettings
        ? Object.assign(
            {},
            this.getSettings?.payment_gateway?.cards?.card_payments?.stripe
          )
        : {};
    },

    getTwoCheckoutSettings() {
      return this.getSettings
        ? Object.assign(
            {},
            this.getSettings?.payment_gateway?.cards?.card_payments?.twoCheckout
          )
        : {};
    },

    getRazorpaySettings() {
      return this.getSettings
        ? Object.assign(
            {},
            this.getSettings?.payment_gateway?.cards?.card_payments?.razorpay
          )
        : {};
    },

    getPayPalSettings() {
      return this.getSettings ? this.getSettings?.payment_gateway?.paypal : {};
    },

    getCashPaymentSettings() {
      return this.getSettings
        ? this.getSettings?.payment_gateway?.cash_payment
        : {};
    },

    getWooCheckoutSettings() {
      return this.getSettings.woo_checkout || {};
    },

    paymentAvailable() {
      return (
        this.getStripeSettings?.enable ||
        this.getPayPalSettings?.enable ||
        this.getCashPaymentSettings?.enable ||
        this.getTwoCheckoutSettings?.enable ||
        this.getRazorpaySettings?.enable
      );
    },

    getSettings() {
      return this.$store.getters.getSettings;
    },

    purchaseBtnClass() {
      if (!this.getMethod || this.$store.getters.getUnusedFields.length > 0) {
        return 'disabled';
      }
      return '';
    },
  },

  created() {
    if (this.after && this.after === 'stripe') {
      this.getMethod = this.after;
      this.getHideCalc = true;
    }
  },

  methods: {
    formState() {
      const vm = this;
      let status = true;
      this.formRequiredFields = [];
      const requiredFields =
        this.$store.getters.getSettings.texts?.form_fields || {};

      vm.paymentForm.sendFields.forEach((element, index) => {
        const key = `${element.name}_field`;
        if (element.required && !(element.value.length > 0)) {
          vm.paymentForm.requires[index].required = true;
          status = false;
          const message = requiredFields[key];
          this.formRequiredFields.push({ key, message });
        } else vm.paymentForm.requires[index].required = false;
      });

      let idx;
      const email = this.paymentForm.sendFields.find((f, i) => {
        if (f.name === 'email') {
          idx = i;
          return f;
        }
      });

      if (status && !this.isValidEmail(email.value)) {
        status = false;
        this.paymentForm.requires[idx].required = true;
        this.formRequiredFields.push({
          key: 'email_field',
          message: requiredFields.email_format,
        });
      }

      if (!status) {
        vm.paymentForm.errorMessage = true;
        vm.paymentForm.errorCaptcha = false;
        vm.paymentForm.successMessage = false;
      }

      return status;
    },

    parseSubtotal(data) {
      const exceptions = ['total', 'html', 'line'];
      let result = [];

      data.forEach((item) => {
        const fieldName = item.alias.replace(/\_field_id.*/, '');

        if (!exceptions.includes(fieldName) && item.hidden !== true) {
          let res = {
            alias: item.alias,
            title: item.label,
            value: item.converted,
          };

          if (item.checked || 'text' === fieldName) {
            if (fieldName === 'datePicker' && true === item.day_price) {
              res.value = item.value;
              res.day_price = item.day_price;
              res.convertedPrice = item.convertedPrice;
            }

            if (item.hasOwnProperty('options') && item.options.length > 0) {
              res.options = item.options.map((option) => {
                return {
                  label: option.label,
                  value: option.value,
                  converted: option.converted,
                };
              });
            }

            if (item.summary_view) {
              res.summary_value = item.summary_value;
              res.summary_view = item.summary_view;
              res.extraView = item.extraView;
            }
            if (item.option_unit) {
              res.option_unit = item.option_unit;
            }
            result.push(res);
          }
        }
      });

      return result;
    },

    async sendData() {
      const vm = this;
      vm.loader = true;

      const orderDetails = this.getOrderDetails;
      orderDetails.orderDetails =
        this.appendFileFieldsWithoutAddToSummary(orderDetails);

      this.$store.commit('setFormFields', vm.paymentForm.sendFields);

      if (this.paymentForm.status) {
        orderDetails.status = 'complete';
      }

      const response = await this.$store.dispatch('addOrder', orderDetails);
      if (response?.success) {
        this.$store.commit('setOrderId', response.data.order_id);
        vm.paymentForm.successMessage = true;
      }

      vm.loader = false;
      return response;
    },

    /**
     * Add file fields to "orderDetails"
     * if "Show in Grand Total" option is disabled but
     * file/s was loaded in form
     */

    resetFields() {
      let vm = this;

      vm.paymentForm.orderId = null;
      vm.paymentForm.sendFields.forEach(function (element) {
        element.value = '';
      });
    },

    async OrderPayment() {
      /** IF demo or live site ( demonstration only ) **/
      if (this.$store.getters.getIsLiveDemoLocation) {
        const demoModeDiv = this.getDemoModeNotice();
        const purchaseBtn = this.$el.querySelector('.ccb-btn-container button');
        purchaseBtn.parentNode.parentNode.after(demoModeDiv);
        return;
      }

      const formState = this.formState();

      if (formState) {
        const response = await this.sendData();
        if (response && response.data.status === 'success') {
          this.paymentForm.orderId = response.data.order_id;
          const paymentResponse = await this.applyPayment();
          if (paymentResponse && paymentResponse.status === 200)
            this.getMethod = null;

          if (this.stripe.stripeClientSecret) this.paymentForm.status = true;
        }
      }
    },

    async applyWoo(post_id) {
      /** IF demo or live site ( demonstration only ) **/
      if (this.$store.getters.getIsLiveDemoLocation) {
        const demoModeDiv = this.getDemoModeNotice();
        const purchaseBtn = this.$el.querySelector('.ccb-btn-container button');
        purchaseBtn.parentNode.parentNode.after(demoModeDiv);
        return;
      }
      /** END| IF demo or live site ( demonstration only ) **/

      const response = await this.sendWooData();

      if (response && response.data.status === 'success') {
        this.wooApply(post_id, this);
      }
    },

    async applyPayment() {
      const self = this;
      this.getStep = '';

      /** IF demo or live site ( demonstration only ) **/
      if (this.$store.getters.getIsLiveDemoLocation) {
        const demoModeDiv = this.getDemoModeNotice();
        const purchaseBtn = this.$el.querySelector('.ccb-btn-container button');
        purchaseBtn.parentNode.parentNode.after(demoModeDiv);
        return;
      }
      /** END| IF demo or live site ( demonstration only ) **/

      if (this.$store.getters.hasUnusedFields) {
        this.loader = false;
        const [first] = this.$store.getters.getUnusedFields;
        if (first?.alias) this.scrollIntoRequired(first.alias);
        return;
      }

      this.loader = true;
      const descriptions = this.$store.getters.getSettings.general.hide_empty
        ? this.$store.getters.getDescriptions('showZero')
        : this.$store.getters.getDescriptions();

      const totals = this.getFormTotals.map((t) => ({
        title: t.label,
        value: t.converted,
      }));

      const data = {
        descriptions,
        action: 'ccb_payment',
        nonce: this.nonces.ccb_payment,
        sendFields: this.paymentForm.sendFields,
        item_name: this.getSettings.title,
        method: this.getMethod,
        calcTotals: this.getFormTotals,
        calcTotalsConverted: totals,
        order_id: this.paymentForm.orderId,
        calcId: this.getSettings.calc_id,
        showUnit: this.$store.getters.getSettings.general.show_option_unit,
        files: this.getAllOrderFiles(descriptions),
      };

      if (this.getMethod === 'razorpay') {
        await this.activatedRazorpay(data);
      } else if (this.getMethod === 'twoCheckout') {
        this.twoCheckout.paymentData = data;
        await this.generateTwoCheckoutToken();
      } else if (this.getMethod === 'stripe') {
        let result = null;
        await this.stripe.stripe
          .createPaymentMethod('card', this.stripe.stripeCard)
          .then(async (cardResult) => {
            if (
              cardResult.error !== undefined &&
              cardResult.error.message !== undefined
            ) {
              this.getStep = 'notice';
              this.noticeData = {
                type: 'error',
                title: cardResult.error.message,
              };
              this.showPaymentNotice('danger', cardResult.error.message);
            } else {
              let payment_data = Object.assign({}, data);
              payment_data.paymentMethodId = cardResult.paymentMethod.id;
              payment_data.action_type = 'intent_payment';

              await this.$store
                .dispatch('fetchPayment', payment_data)
                .then(async (response) => {
                  result = response;
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
                    this.getStep = 'notice';
                    this.noticeData = {
                      type: 'error',
                      title: result.message,
                    };
                    this.stripe.stripeClientSecret = false;
                  }

                  this.loader = false;
                });

              if (this.stripe.stripeClientSecret) {
                return await this.stripe.stripe
                  .retrievePaymentIntent(this.stripe.stripeClientSecret)
                  .then((retrieve_result) => {
                    data.token_id = retrieve_result.paymentIntent.id;
                    data.nonce = this.nonces.ccb_payment;
                    this.getStep = 'finish';

                    this.$store.commit('setPaymentType', this.getMethod);
                    this.$store.commit(
                      'setIssuedOn',
                      this.paymentForm.sendFields[0].value
                    );
                  });
              }
            }
          });
        return result;
      } else if (this.getMethod === 'paypal') {
        const result = await this.$store.dispatch('fetchPayment', data);
        setTimeout(() => {
          if (result) {
            this.getMethod = null;
            this.resetFields();
            this.showPaymentNotice(result.status, result.message);
          }
        }, 500);

        if (result && result.success === false) {
          this.getStep = 'notice';
          this.noticeData = {
            type: 'error',
            title: result.message,
          };
        }

        return result;
      } else if (this.getMethod === 'cash_payment') {
        const result = await this.$store.dispatch('fetchPayment', data);
        setTimeout(() => {
          if (result) {
            this.getStep = 'finish';
            this.$store.commit('setPaymentType', this.getMethod);
            this.$store.commit(
              'setIssuedOn',
              this.paymentForm.sendFields[0].value
            );
            this.loader = false;
          }
        }, 500);

        if (result && result.success === false) {
          this.getStep = 'notice';
          this.noticeData = {
            type: 'error',
            title: result.message,
          };
        }

        return result;
      }
    },

    showPaymentNotice(status, message) {
      this.loader = false;
      this.payment.status = status;
      this.payment.message = message;
    },

    focusOnCard() {
      this.$nextTick(() => {
        this.$refs['card']?.focus();
      });
    },

    cardBlur() {
      this.twoCheckout.hideCard = true;
      this.twoCheckout.cardStyle.transform = `translateX(0)`;
    },

    cardFocusOut() {
      if (this.twoCheckout.cardNumber.length === 19) {
        this.twoCheckout.hideCard = false;
        this.twoCheckout.cardStyle.transform = `translateX(-${this.twoCheckout.offsetWidth}px)`;
      }
    },

    ...Helpers,
    ...PaymentHelper,
  },

  watch: {
    getMethod(value) {
      if (this.$store.getters.hasUnusedFields && value) {
        this.loader = false;
        const [first] = this.$store.getters.getUnusedFields;
        if (first?.alias) this.scrollIntoRequired(first.alias);
      }
    },

    'twoCheckout.cardNumber': {
      handler(cardNumber) {
        const $text = document.querySelector('#text-width');
        this.twoCheckout.offsetWidth = $text?.offsetWidth || 0;

        let formattedCardNumber = cardNumber.replace(/[^\d]/g, '');
        formattedCardNumber = formattedCardNumber.substring(0, 16);

        let cardNumberSections = formattedCardNumber.match(/\d{1,4}/g);
        if (cardNumberSections !== null) {
          formattedCardNumber = cardNumberSections.join(' ');
        }

        if (cardNumber !== formattedCardNumber) {
          cardNumber = formattedCardNumber;
        }

        this.twoCheckout.cardNumber = cardNumber;
        if (cardNumber.length === 19) {
          this.twoCheckout.hideCard = false;
          this.twoCheckout.cardStyle.transform = `translateX(-${this.twoCheckout.offsetWidth}px)`;
          this.$refs['month_and_year']?.focus();
        } else if (cardNumber.length !== 19) {
          this.twoCheckout.hideCard = true;
          this.twoCheckout.cardStyle.transform = `translateX(0)`;
        }
      },
      deep: true,
    },
    'twoCheckout.month_and_year': {
      handler(value) {
        let formattedValue = value.replace(/[^\d]/g, '');
        formattedValue = formattedValue.substring(0, 4);

        let valueSections = formattedValue.match(/\d{1,2}/g);

        if (valueSections !== null) {
          const month = valueSections[0];
          if (month?.length === 1) {
            valueSections[0] = +month > 1 && +month < 10 ? `0${month}` : month;
          }

          formattedValue = valueSections.join(' / ');
        }

        if (value !== formattedValue) {
          value = formattedValue;
        }

        this.twoCheckout.month_and_year = value;

        if (value.length === 7) {
          this.$refs['cvv']?.focus();
        }
      },
      deep: true,
    },

    'twoCheckout.cvv': {
      handler(value) {
        let formattedValue = value.replace(/[^\d]/g, '');
        formattedValue = formattedValue.substring(0, 3);

        if (value !== formattedValue) {
          value = formattedValue;
        }

        this.twoCheckout.cvv = value;

        if (value.length === 3) {
          this.$refs['zip_code']?.focus();
        }
      },
      deep: true,
    },
    'twoCheckout.zip_code': {
      handler(value) {
        let formattedValue = value.replace(/[^\d]/g, '');
        formattedValue = formattedValue.substring(0, 10);

        if (value !== formattedValue) {
          value = formattedValue;
        }

        this.twoCheckout.zip_code = value;
      },
      deep: true,
    },
  },
};
