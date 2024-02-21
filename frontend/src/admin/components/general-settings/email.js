import generalSettingsMixin from './generalSettingsMixin';
import settingsProBanner from '../basic/pro-banners/settings-pro-banner';
export default {
  mixins: [generalSettingsMixin],
  components: {
    settingsProBanner,
  },
  methods: {
    addEmail() {
      this.generalSettings.form_fields.customEmailAddresses.push('');
    },
    removeEmail(index) {
      this.generalSettings.form_fields.customEmailAddresses.splice(index, 1);
    },
  },
};
