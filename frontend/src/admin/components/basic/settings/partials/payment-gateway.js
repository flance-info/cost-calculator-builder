import settingsMixin from './settingsMixin';
import currencyDto from '../../../dtos/currencyDto';
import modeDto from '../../../dtos/modeDto';
import singleProBanner from '../../pro-banners/single-pro-banner';
import { toast } from '../../../../../utils/toast';

export default {
  mixins: [settingsMixin],

  data: () => ({
    formulas: [],
    modes: modeDto,
    currencies: currencyDto,
    defaultFormula: [],
    currentPayment: null,
    paypalExtended: false,
    razorPayExtended: false,
    stripeExtended: false,
    cashPaymentExtended: false,
  }),

  components: {
    singleProBanner,
  },

  computed: {
    paymentStatus() {
      return (type) => {
        const settingsData =
          this.settingsField.payment_gateway.cards.card_payments[type];
        if (type === 'stripe') {
          return settingsData?.publishKey?.length &&
            settingsData?.secretKey?.length
            ? 'Integrated'
            : 'Not integrated';
        }

        if (type === 'twoCheckout') {
          return settingsData?.publishKey?.length &&
            settingsData?.privateKey?.length &&
            settingsData?.merchantCode?.length
            ? 'Integrated'
            : 'Not integrated';
        }

        if (type === 'razorpay') {
          return settingsData?.keyId?.length && settingsData?.secretKey?.length
            ? 'Integrated'
            : 'Not integrated';
        }

        return 'Not integrated';
      };
    },
  },

  mounted() {
    if (this.generalSettings?.payment_gateway?.paypal.use_in_all) {
      this.paypalExtended = true;
    }

    if (this.generalSettings?.payment_gateway?.cards.use_in_all) {
      if (
        this.generalSettings?.payment_gateway?.cards?.card_payments?.razorpay
          ?.enable
      ) {
        this.razorPayExtended = true;
      }

      if (
        this.generalSettings?.payment_gateway?.cards?.card_payments?.stripe
          ?.enable
      ) {
        this.stripeExtended = true;
      }
    }

    if (this.generalSettings?.payment_gateway?.cash_payment.use_in_all) {
      this.cashPaymentExtended = true;
    }

    if (
      this.settingsField?.payment_gateway?.paypal &&
      typeof this.settingsField.payment_gateway.formulas === 'object'
    ) {
      this.formulas = this.settingsField.payment_gateway.formulas;
    }

    this.clear();
  },

  updated() {
    this.updateFormulas();
    this.settingsField.payment_gateway.formulas = this.formulas;
  },

  methods: {
    setPaymentMethod(type) {
      const data = this.settingsField.payment_gateway.cards.card_payments;
      if (data[type]) {
        this.currentPayment = this.clone(data[type]);
        this.$store.commit('setModalType', 'payment-settings');
        this.$store.commit('setOpenModal', true);
      }
    },

    clearCurrentPayment() {
      this.currentPayment = null;
    },

    closeModel() {
      this.$store.commit('setModalHide', true);
      this.$store.commit('setOpenModal', false);

      setTimeout(() => {
        this.$store.commit('setModalHide', false);
        this.$store.commit('setModalType', '');
        this.clearCurrentPayment();
      }, 200);
    },

    savePayment() {
      const settingsField = this.clone(this.settingsField);
      const { slug } = this.currentPayment;

      if (
        this.currentPayment &&
        settingsField.payment_gateway.cards.card_payments[slug]
      ) {
        settingsField.payment_gateway.cards.card_payments[slug] =
          this.currentPayment;
        this.settingsField = settingsField;
      }
      this.closeModel();
      toast('Payment saved', 'success');
    },

    clone(data) {
      return JSON.parse(JSON.stringify(data));
    },

    async deletePayment() {
      await this.$store.dispatch('deletePayment', {
        type: this.currentPayment.slug,
        isSingle: true,
      });

      this.closeModel();
      this.currentPayment = null;
      toast('Payment deleted', 'success');
    },
  },
};
