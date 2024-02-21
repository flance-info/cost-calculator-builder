import settingsMixin from './settingsMixin';
import { toast } from '../../../../../utils/toast';
import singleProBanner from '../../pro-banners/single-pro-banner';
export default {
  mixins: [settingsMixin],

  data: () => ({
    sendFormVisible: false,
    paymentButtonVisible: false,
    emailQuoteVisible: false,
    showPassword1: false,
    showPassword2: false,
    showPassword3: false,
    modalVisible: false,
    iframeSrc: 'https://www.youtube.com/embed/N7PaFFs0zMM?controls=1',
  }),

  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },

  components: {
    singleProBanner,
  },

  methods: {
    handleClickOutside(e) {
      if (
        this.$refs.sendForm &&
        !this.$refs.sendForm.contains(e.target) &&
        !this.$refs.sendFormDemoBox.contains(e.target)
      ) {
        this.sendFormVisible = false;
      }
      if (
        this.$refs.paymentButton &&
        !this.$refs.paymentButton.contains(e.target) &&
        !this.$refs.paymentButtonDemoBox.contains(e.target)
      ) {
        this.paymentButtonVisible = false;
      }
      if (
        this.$refs.emailQuote &&
        !this.$refs.emailQuote.contains(e.target) &&
        !this.$refs.emailQuoteDemoBox.contains(e.target)
      ) {
        this.emailQuoteVisible = false;
      }
    },
    async sendDemoData(type) {
      const data = {
        calc_id: this.$store.getters.getSettings.calc_id,
      };
      if (
        type === 'send-form' &&
        this.settingsField.webhooks.send_form_url.trim().length !== 0
      ) {
        this.settingsField.calc_id, (data.type = type);
        data.url = this.settingsField.webhooks.send_form_url;
      } else if (
        type === 'send-payment' &&
        this.settingsField.webhooks.payment_btn_url.trim().length !== 0
      ) {
        this.settingsField.calc_id, (data.type = type);
        data.url = this.settingsField.webhooks.payment_btn_url;
      } else if (
        type === 'send-email-quote' &&
        this.settingsField.webhooks.email_quote_url.trim().length !== 0
      ) {
        this.settingsField.calc_id, (data.type = type);
        data.url = this.settingsField.webhooks.email_quote_url;
      } else {
        toast('Please check the url you provided', 'error');
      }
      let formData = new FormData();
      formData.append('action', 'ccb_send_demo_webhook');
      formData.append('nonce', window.ccb_nonces.ccb_webhook_nonce);
      formData.append('data', JSON.stringify(data));
      formData.append('calc_id', this.$store.getters.getId);

      let response = await fetch(window.ajax_window.ajax_url, {
        method: 'POST',
        body: formData,
      });

      if (response.status === 200) {
        toast('Demo data has been sent', 'success');
      }
    },
    toggleItem(item) {
      this[item] = !this[item];
    },
    openModal() {
      this.modalVisible = true;
      this.$nextTick(() => {
        this.$refs.modalIframe.contentWindow.postMessage({ autoplay: 1 }, '*');
      });
    },
    closeModal() {
      this.modalVisible = false;
      this.$refs.modalIframe.contentWindow.postMessage({ autoplay: 0 }, '*');
    },
    getIframeSrc() {
      return `${this.iframeSrc}&autoplay=1`;
    },
  },
  computed: {
    getModalClasses() {
      return {
        focused: true,
      };
    },
  },
};
