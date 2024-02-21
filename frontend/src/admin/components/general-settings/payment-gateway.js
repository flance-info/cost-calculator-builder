import generalSettingsMixin from './generalSettingsMixin';
import settingsProBanner from '../basic/pro-banners/settings-pro-banner';
import { toast } from '../../../utils/toast';

export default {
  mixins: [generalSettingsMixin],
  components: {
    settingsProBanner,
  },

  data: () => ({
    currentPayment: null,
  }),

  computed: {
    paymentStatus() {
      return (type) => {
        const settingsData =
          this.generalSettings.payment_gateway.cards.card_payments[type];
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

  methods: {
    setPaymentMethod(type) {
      const data = this.generalSettings.payment_gateway.cards.card_payments;
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
      const generalSettings = this.clone(this.generalSettings);
      const { slug } = this.currentPayment;

      if (
        this.currentPayment &&
        generalSettings.payment_gateway.cards.card_payments[slug]
      ) {
        generalSettings.payment_gateway.cards.card_payments[slug] =
          this.currentPayment;
        this.generalSettings = generalSettings;
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
      });
      this.closeModel();
      this.currentPayment = null;
      toast('Payment deleted', 'success');
    },
  },
};
