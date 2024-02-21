import copyText from '../utility/copyText';
import ccbModalWindow from '../utility/modal';

export default {
  components: {
    'ccb-modal-window': ccbModalWindow,
  },
  computed: {
    generalSettings: {
      get() {
        return this.$store.getters.getGeneralSettings;
      },

      set(value) {
        this.$store.commit('updateGeneralSettings', value);
      },
    },
  },

  data: () => ({
    dataLoaded: false,
    shortCode: {
      className: '',
      text: 'Copy',
    },
  }),

  methods: {
    async saveGeneralSettings() {
      await this.$store.dispatch('saveGeneralSettings');
    },

    resetCopy() {
      this.shortCode = {
        className: '',
        text: 'Copy',
      };
    },

    copyShortCode(id) {
      copyText(id);
      this.shortCode.className = 'copied';
      this.shortCode.text = 'Copied!';
    },
  },

  watch: {
    'generalSettings.form_fields.terms_and_conditions.page_id': function () {
      let page_id =
        this.generalSettings.form_fields.terms_and_conditions.page_id;
      let page = this.$store.getters.getPagesAll.find(
        (page) => page.id === parseInt(page_id)
      );
      if (page !== undefined) {
        this.generalSettings.form_fields.terms_and_conditions.link = page.link;
        if (
          this.generalSettings.form_fields.terms_and_conditions.link_text
            .length === 0
        ) {
          this.generalSettings.form_fields.terms_and_conditions.link_text =
            page.title;
        }
      } else {
        this.generalSettings.form_fields.terms_and_conditions.link = '';
      }
    },
  },
};
