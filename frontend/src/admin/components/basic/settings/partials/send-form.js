import settingsMixin from './settingsMixin';
import paymentDto from '../../../dtos/paymentDto';
import singleProBanner from '../../pro-banners/single-pro-banner';

export default {
  mixins: [settingsMixin],

  data: () => ({
    showContactForm: false,
    payments: paymentDto,
    extended: false,
    termsExtended: false,
    paymentMethods: [],
    formulas: [],
    defaultFormula: [],
  }),

  components: {
    singleProBanner,
  },

  mounted() {
    this.initExtend();

    if (Array.isArray(this.settingsField.formFields?.formulas))
      this.formulas = this.settingsField.formFields.formulas;

    this.clear();
    this.showContactForm = true;
  },

  computed: {
    generalSettings() {
      return this.$store.getters.getGeneralSettings;
    },

    getCaptchaInfo() {
      const captchaSettings = this.$store.getters.getGeneralSettings.recaptcha;
      const currentCaptcha = captchaSettings[captchaSettings.type];
      return currentCaptcha.secretKey && currentCaptcha.siteKey;
    },

    getPaymentSettingsBySlug() {
      return (slug) => {
        const settings = JSON.parse(JSON.stringify(this.settingsField));
        const generalPaymentGateway = this.generalSettings.payment_gateway;

        let paypalData = settings.payment_gateway.paypal;
        if (slug === 'paypal' && generalPaymentGateway.paypal.use_in_all) {
          paypalData = generalPaymentGateway.paypal;
          paypalData.enable = true;
        }

        let cardData = settings.payment_gateway.cards.card_payments;
        if (
          Object.keys(cardData).includes(slug) &&
          generalPaymentGateway.cards.card_payments[slug]?.enable
        ) {
          cardData[slug] = {
            ...generalPaymentGateway.cards.card_payments[slug],
            enable: settings.payment_gateway.cards.card_payments[slug]?.enable,
          };
        }

        const data = {
          paypal: paypalData,
          woo_checkout: settings.woo_checkout,
          cash_payment: settings.payment_gateway.cash_payment,
          stripe: cardData[slug],
          twoCheckout: cardData[slug],
          razorpay: cardData[slug],
        };

        return data[slug];
      };
    },

    getPayments() {
      const settings = JSON.parse(JSON.stringify(this.settingsField));

      let payments = JSON.parse(JSON.stringify(this.payments));
      payments = payments.map((paymentType) => {
        const paymentSettings = this.getPaymentSettingsBySlug(paymentType.slug);
        if (paymentSettings.enable) {
          if (!paymentType.requiredSettingFields.length) {
            paymentType.disabled = false;
          }

          paymentType.requiredSettingFields.forEach((requiredField) => {
            if (paymentSettings[requiredField]) {
              paymentType.disabled = false;
            }
          });
        } else {
          paymentType.disabled = true;
          settings.formFields.paymentMethods =
            settings.formFields.paymentMethods.filter(
              (e) => e !== paymentType.slug
            );
        }

        return paymentType;
      });

      return payments;
    },

    getValues() {
      return this.settingsField.formFields.paymentMethods;
    },
  },

  methods: {
    initExtend() {
      if (this.generalSettings?.form_fields.use_in_all) this.extended = true;
      if (this.extended && this.generalSettings?.form_fields.terms_use_in_all)
        this.termsExtended = true;
    },

    toggleGateways(e) {
      e.preventDefault();
      const value = e.target.value;
      if (this.settingsField.formFields.paymentMethods.includes(value)) {
        this.settingsField.formFields.paymentMethods =
          this.settingsField.formFields.paymentMethods.filter(
            (v) => v !== value
          );
      } else {
        this.settingsField.formFields.paymentMethods.push(value);
      }
    },
    addEmail() {
      this.settingsField.formFields.customEmailAddresses.push('');
    },
    removeEmail(index) {
      this.settingsField.formFields.customEmailAddresses.splice(index, 1);
    },
  },

  updated() {
    const vm = this;
    vm.settingsField.formFields.allowContactForm =
      parseInt(vm.settingsField.formFields.contactFormId) || false;
    if (!vm.settingsField.formFields.allowContactForm) {
      this.initExtend();
    } else {
      this.extended = false;
      this.termsExtended = false;
    }

    this.updateFormulas();
    this.settingsField.formFields.formulas = this.formulas;
  },
};
