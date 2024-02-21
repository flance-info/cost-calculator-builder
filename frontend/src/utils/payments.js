const PaymentHelper = {};

PaymentHelper.isPaymentEnabled = function (paymentSlug) {
  let payments = [
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
  ];

  let paymentSettings = this.getSettingsBySlug(
    paymentSlug,
    this.$store.getters.getSettings
  );

  let payment = payments.filter((p) => p.slug === paymentSlug);
  let isDisabled = true;

  if (payment.length <= 0) {
    return false;
  }

  /** is all payment settings exist **/
  if (paymentSettings && paymentSettings.enable) {
    isDisabled = payment[0].requiredSettingFields.some(
      (requiredField) => !paymentSettings[requiredField]
    );
  }

  /** if form enabled and payment enabled, check is in the payment list **/
  if (window.calcForm && !isDisabled) {
    return this.$store.getters.getSettings.formFields.paymentMethods.includes(
      paymentSlug
    );
  }

  return !isDisabled;
};

PaymentHelper.getSettingsBySlug = function (slug, settings) {
  const stripeData = {
    ...settings?.payment_gateway?.cards?.card_payments?.stripe,
  };

  const twoCheckoutData = {
    ...settings?.payment_gateway?.cards?.card_payments?.twoCheckout,
  };

  const razorpayData = {
    ...settings?.payment_gateway?.cards?.card_payments?.razorpay,
  };

  const data = {
    stripe: stripeData,
    twoCheckout: twoCheckoutData,
    razorpay: razorpayData,
    paypal: settings?.payment_gateway?.paypal,
    cash_payment: settings?.payment_gateway?.cash_payment,
  };

  return data[slug] ? data[slug] : settings[slug];
};

PaymentHelper.twoCheckoutTokenSuccess = async function (data) {
  if (data?.response?.token) {
    const paymentData = this.twoCheckout.paymentData;
    paymentData.token = data.response.token.token;
    const result = await this.$store.dispatch('fetchPayment', paymentData);
    if (result && result.success) {
      this.getStep = 'finish';
      this.$store.commit('setPaymentType', this.getMethod);
      this.$store.commit('setIssuedOn', this.paymentForm.sendFields[0].value);
    } else {
      this.getStep = 'notice';
      this.noticeData = {
        type: 'error',
        title: result.message,
      };
    }
    this.loader = false;
  }
};

PaymentHelper.twoCheckoutTokenError = function (data) {
  this.getStep = 'notice';
  this.noticeData = {
    type: 'error',
    title: data.errorMsg,
  };
  this.showPaymentNotice('danger', data.errorMsg);
  this.loader = false;
};

PaymentHelper.generateTwoCheckoutToken = function () {
  // let settings = this.$store.getters.getSettings;
  // let twoCheckoutSettings = settings
  //   ? Object.assign(
  //       {},
  //       settings?.payment_gateway?.cards?.card_payments?.twoCheckout
  //     )
  //   : {};
  // let self = this;
  // this.$nextTick(() => {
  // const splitYearAndMonth = self?.twoCheckout?.month_and_year?.split('/');
  // const args = {
  //   sellerId: twoCheckoutSettings.merchantCode,
  //   publishableKey: twoCheckoutSettings.publishKey,
  //   ccNo: self.twoCheckout.cardNumber?.split(' ').join('-'),
  //   cvv: self.twoCheckout.cvv,
  //   expMonth: splitYearAndMonth[0]?.trim(),
  //   expYear: `20${splitYearAndMonth[1]?.trim()}`,
  // };
  //
  // window.TCO.loadPubKey('production', () => {
  //   window.TCO.requestToken(
  //     self.twoCheckoutTokenSuccess,
  //     self.twoCheckoutTokenError,
  //     args
  //   );
  // });
  // });
};

PaymentHelper.razorpayConfig = function () {
  return {
    display: {
      blocks: {
        banks: {
          name: 'Methods with Offers',
          instruments: [
            {
              method: 'wallet',
              wallets: ['olamoney'],
            },
          ],
        },
      },
      sequence: ['block.banks'],
      preferences: {
        show_default_blocks: true,
      },
    },
  };
};

PaymentHelper.activatedRazorpay = async function (data) {
  let settings = this.$store.getters.getSettings;
  const generalSettings = this.$store.getters.getGeneralSettings;
  let razorpaySettings = settings
    ? Object.assign(
        {},
        settings?.payment_gateway?.cards?.card_payments?.razorpay
      )
    : {};

  const self = this;
  await this.$store.dispatch('fetchPayment', data).then((result) => {
    if (result && result.success === false) {
      this.getStep = 'notice';
      this.noticeData = {
        type: 'error',
        title: result.message,
      };
    } else if (result && result.success) {
      const options = result.data;

      let keyId = razorpaySettings.keyId;

      if (
        generalSettings?.payment_gateway?.card_payments?.cards?.use_in_all &&
        generalSettings?.payment_gateway?.card_payments?.cards?.razorpay?.enable
      ) {
        keyId =
          generalSettings?.payment_gateway?.card_payments?.cards?.razorpay
            ?.keyId;
      }

      options.key = keyId;
      options.handler = function (response) {
        if (response) {
          self.getStep = 'finish';
          self.$store.commit('setPaymentType', this.getMethod);

          self.$store.dispatch('razorpayPaymentReceived', {
            orderId: self.$store.getters.getOrderId,
          });
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        self.getStep = 'notice';
        self.noticeData = {
          type: 'error',
          title: response.error.reason,
        };
      });

      rzp.open();
    }

    this.loader = false;

    // if (intent.status === 'success') {
    //   self.stripe.stripeClientSecret = intent.clientSecret;
    // } else {
    //   self.showPaymentNotice(intent.status, intent.message);
    // }
  });
};

PaymentHelper.generateStripe = function (access = true) {
  let settings = this.$store.getters.getSettings;

  let stripeSettings = settings
    ? Object.assign({}, settings?.payment_gateway?.cards?.card_payments?.stripe)
    : {};

  let self = this;
  this.$nextTick(() => {
    const stripe_id = stripeSettings.publishKey;
    if (!stripe_id.length && access) {
      self.payment.status = 'danger';
      self.payment.message = 'Something went wrong';
      return false;
    } else if (access) {
      self.payment.status = '';
      self.payment.message = '';
    }

    self.stripe.stripe = window.Stripe(stripe_id);
    let elements = self.stripe.stripe.elements();

    self.stripe.stripeCard = elements.create('card');
    self.stripe.stripeCard.mount('#ccb_stripe_' + settings.calc_id);
    self.stripe.stripeCard.addEventListener('change', (event) => {
      self.stripe.stripeComplete = event.complete;
    });
  });
};

PaymentHelper.handleStripeCard = async (data, self) => {
  let settings = self.$store.getters.getSettings;
  let stripeSettings = settings
    ? Object.assign({}, settings?.payment_gateway?.cards?.card_payments?.stripe)
    : {};

  await self.stripe.stripe
    .handleCardAction(data.clientSecret)
    .then(async (card_action_result) => {
      if (card_action_result.error) {
        self.showPaymentNotice('danger', 'Your card was not authenticated!');
      } else if (
        card_action_result.paymentIntent.status === 'requires_confirmation'
      ) {
        let retrieve_data = {
          action: 'ccb_payment',
          action_type: 'intent_payment',
          method: 'stripe',
          stripe_info: stripeSettings,
          calcTotals: self.$store.getters.getFormula,
          paymentIntentId: data.paymentIntentId,
          nonce: self.nonces.ccb_payment,
          calcId: settings.calc_id,
        };
        // Retrieve Payment
        await self.$store
          .dispatch('fetchPayment', retrieve_data)
          .then((intent) => {
            if (intent.status === 'success') {
              // Order Complete
              self.stripe.stripeClientSecret = intent.clientSecret;
            } else {
              self.showPaymentNotice(intent.status, intent.message);
            }
          });
      }
    });
};

PaymentHelper.wooApply = async (post_id, self) => {
  if (self.$store.getters.hasUnusedFields) {
    return;
  }
  const orderFiles = self.getAllOrderFiles();
  self.loader = true;
  const params = {
    post_id,
    files: orderFiles,
    totals: self.getFormTotals,
    callback: () => {
      self.loader = false;
    },
  };
  self.loader = await self.$store.dispatch('applyWoo', params);
};

/**
 * Return all uploaded files
 * though:
 * - 'Settings->Zero Values in Grand Total' is disabled
 * - 'FileField->Show in Grand Total' is disabled
 * - 'FileField->Price' is zero
 * Not return field data if file not uploaded
 */
PaymentHelper.getAllOrderFiles = function () {
  const files = [];
  let fileDescriptions = this.$store.getters.getFileFieldDescriptions();
  fileDescriptions.forEach((item) => {
    if (item.options.value.length > 0) {
      files.push({ alias: item.alias, files: item.options.value });
    }
  });
  return files;
};

PaymentHelper.parseOrderDetails = function (data) {
  const result = [];
  const exceptions = ['total', 'html', 'line'];

  data.forEach((item) => {
    const fieldName = item.alias.replace(/\_field_id.*/, '');
    if (!exceptions.includes(fieldName) && item.hidden !== true) {
      if (item.alias.includes('repeater')) {
        if (item.groupElements.length) {
          const group = {
            alias: item.alias,
            groupTitle: item.label,
            groupElements: [],
          };

          item.groupElements.forEach((innerEl) => {
            let res = {
              alias: innerEl.alias,
              title: innerEl.label,
              value: innerEl.converted,
            };

            if (
              innerEl.hasOwnProperty('options') &&
              innerEl.options.length > 0
            ) {
              res.options = innerEl.options.map((option) => {
                return {
                  label: option.label,
                  value: option.value,
                  converted: option.converted,
                };
              });
            }

            if (innerEl.summary_view) {
              res.summary_value = innerEl.summary_value;
              res.summary_view = innerEl.summary_view;
              res.extraView = innerEl.extraView;
            }

            group.groupElements.push(res);
          });

          result.push(group);
        }
      } else {
        const res = {
          alias: item.alias,
          title: item.label,
          value: item.converted,
          addToSummary: item.addToSummary,
        };

        if (item.alias.includes('file_upload') && !item.allowPrice) {
          res.value = item.option_unit;
        } else if (item.hasOwnProperty('options') && item.options.length > 0) {
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

        result.push(res);
      }
    }
  });

  return result;
};
export default PaymentHelper;
