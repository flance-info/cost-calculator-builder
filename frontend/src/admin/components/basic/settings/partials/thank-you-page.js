import settingsMixin from './settingsMixin';
import paymentDto from '../../../dtos/paymentDto';
import defaultWrapper from '../../../../../frontend/components/partials/thank-you-page/wrappers/default-wrapper';
import Customize from '../../../../../utils/customize';
import singleProBanner from '../../pro-banners/single-pro-banner';

export default {
  mixins: [settingsMixin],
  data: () => ({
    showDetails: false,
    payments: paymentDto,
    showThankYouPage: false,
    thankYouPage: false,
  }),

  components: {
    singleProBanner,
    'default-wrapper': defaultWrapper,
  },

  computed: {
    showCloseBtn() {
      const type = this.settingsField.thankYouPage?.type;
      return type === 'modal';
    },

    getOrder() {
      return {
        orderId: 23129311,
      };
    },

    showNotice() {
      const payment_gateway = this.settingsField?.payment_gateway;
      return (
        !this.settingsField.formFields.accessEmail &&
        !(
          payment_gateway?.cash_payment.enable ||
          payment_gateway?.paypal.enable ||
          payment_gateway?.cards?.card_payments?.stripe?.enable ||
          payment_gateway?.cards?.card_payments?.twoCheckout?.enable ||
          payment_gateway?.cards?.card_payments?.razorpay?.enable
        )
      );
    },

    getWrapper() {
      const type = this.settingsField.thankYouPage?.type;
      const types = {
        same_page: 'default-wrapper',
        modal: 'modal-wrapper',
      };

      if (types[type]) return types[type];

      return 'default-wrapper';
    },

    showBackToCalculators() {
      const type = this.thankYouPage.type;
      return type !== 'modal';
    },

    getSettings() {
      const layout = this.getElementAppearanceStyleByPath(
        this.appearance,
        'desktop.layout.data'
      );
      return {
        boxStyle: layout?.box_style || 'vertical',
        calcId: this.$store.getters.getCalcId,
      };
    },

    appearance() {
      return this.$store.getters.getAppearance;
    },
  },

  methods: {
    downloadPdf() {},

    sendPdf() {},

    backToCalculatorAction() {},

    ...Customize,
  },

  created() {
    this.thankYouPage = this.settingsField.thankYouPage;
  },

  mounted() {
    this.showThankYouPage = true;
    this.initEffects();
  },
};
