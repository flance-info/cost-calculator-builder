import currencyDto from '../dtos/currencyDto';
import {
  currency,
  email,
  captcha,
  invoice,
  emailTemplate,
  backupSettings,
  paymentGateway,
} from '../general-settings';
import loader from '../../../loader';
export default {
  props: [],
  components: {
    loader,
    'ccb-general-settings-currency': currency,
    'ccb-general-settings-invoice': invoice,
    'ccb-general-settings-email': email,
    'ccb-general-settings-email-template': emailTemplate,
    'ccb-general-settings-captcha': captcha,
    'ccb-general-settings-backup-settings': backupSettings,
    'ccb-general-settings-payment-gateway': paymentGateway,
  },

  data: () => ({
    tab: 'currency',
    currencies: currencyDto,
    preloader: true,
    mobileState: true,
  }),

  async mounted() {
    await this.$store.dispatch('getPagesAll');

    if (this.getParameterByName('option') !== null) {
      this.tab = this.getParameterByName('option');
    }

    if (!this.$store.getters.getDataLoaded) {
      await this.$store.dispatch('setGeneralSettings');
      setTimeout(() => (this.preloader = false), 200);
    }
  },

  computed: {
    getComponent() {
      return `ccb-general-settings-${this.tab}`;
    },
  },

  methods: {
    mobileSwitcher() {
      this.mobileState = !this.mobileState;
    },
  },
};
