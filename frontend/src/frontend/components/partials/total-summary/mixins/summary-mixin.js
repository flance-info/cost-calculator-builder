export default {
  props: ['field', 'classes', 'style'],
  methods: {
    breakBorder(field) {
      const fieldName = field.alias.replace(/\_field_id.*/, '');

      if (fieldName === 'file_upload' && !field.allowPrice) {
        return false;
      }

      if (
        (['checkbox', 'toggle', 'checkbox_with_img'].includes(fieldName) &&
          field.options.length !== 0) ||
        field.option_unit
      ) {
        return true;
      }
    },
  },

  computed: {
    getSettings() {
      return this.$store.getters.getSettings;
    },

    showUnitInSummary() {
      return this.getSettings.general.show_option_unit;
    },
  },
};
