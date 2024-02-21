import fieldsMixin from '../../fields/fieldsMixin';

import defaultWrapper from './wrappers/default-wrapper';
import modalWrapper from './wrappers/modal-wrapper';

export default {
  mixins: [fieldsMixin],

  components: {
    'default-wrapper': defaultWrapper,
    'modal-wrapper': modalWrapper,
  },

  created() {
    this.thankYouPage = this.settingsField.thankYouPage;
  },

  data: () => ({
    showThankYouPage: false,
    showDetails: false,
    thankYouPage: null,
  }),

  computed: {
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
      const type = this.settingsField.thankYouPage?.type;
      if (type === 'modal') return false;

      const previousPage = localStorage.getItem('ccb_previous_page');

      if (type === 'separate_page') return !!previousPage;

      return true;
    },

    showCloseBtn() {
      const type = this.settingsField.thankYouPage?.type;
      return type === 'modal';
    },

    getOrder() {
      return {
        orderId: this.$store.getters.getOrderId,
      };
    },

    getSettings() {
      const layout = this.getElementAppearanceStyleByPath(
        this.appearance,
        'desktop.layout.data'
      );

      const boxStyle = layout?.box_style || 'vertical';
      return {
        boxStyle,
        calcId: this.$store.getters.getCalcId,
      };
    },
  },

  methods: {
    downloadPdf() {
      this.$emit('invoice');
      this.initializeHooks('ccb_confirmation_pdf_button_action');
    },

    sendPdf() {
      this.backToCalculatorAction();
      this.$emit('send-pdf');
    },

    backToCalculatorAction() {
      const previousPage = localStorage.getItem('ccb_previous_page');
      if (previousPage) {
        localStorage.removeItem('ccb_previous_page');
        window.location.href = previousPage;
        return;
      }

      const type = this.settingsField.thankYouPage?.type;
      this.$emit('reset');
      if (type === 'modal') {
        this.$store.commit('setThankYouModalOpen', false);
        this.$store.commit('setThankYouModalHide', true);
      }
      this.initializeHooks('ccb_confirmation_back_button_action');
    },

    customButtonFunction() {
      this.initializeHooks('ccb_confirmation_custom_button_action');
    },

    async initializeHooks(action) {
      try {
        const formData = new URLSearchParams();
        formData.append('action', action);
        formData.append('nonce', window.ccb_nonces.ccb_wp_hook_nonce);

        const response = await fetch(window.ajax_window.ajax_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          },
          body: formData.toString(),
        });

        if (!response.ok) {
          throw new Error('Network response error');
        }
        return await response.json();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('An error occurred:', error);
      }
    },
  },

  mounted() {
    this.showThankYouPage = true;
  },
};
