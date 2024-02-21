import ccbModalWindow from '../../../utility/modal';

export default {
  components: {
    'ccb-modal-window': ccbModalWindow,
  },

  computed: {
    customSettings() {
      const settings = {};
      Object.keys(this.settingsField).forEach((settingsKey) => {
        const settingsPayment = JSON.parse(
          JSON.stringify(this.settingsField[settingsKey] || {})
        );
        const generalPayment = JSON.parse(
          JSON.stringify(this.generalSettings[settingsKey] || {})
        );

        if (generalPayment && generalPayment.use_in_all) {
          delete generalPayment.enable;
          settings[settingsKey] = { ...settingsPayment, ...generalPayment };
        } else {
          settings[settingsKey] = this.settingsField[settingsKey];
        }
      });

      return settings;
    },

    settingsField: {
      get() {
        return this.$store.getters.getSettings;
      },

      set(value) {
        this.$store.commit('updateSettings', value);
      },
    },

    generalSettings() {
      return this.$store.getters.getGeneralSettings;
    },

    getFormulaFields() {
      let builder = this.$store.getters.getBuilder;

      builder.forEach((el) => {
        if (el.alias && el.alias.includes('group') && el.groupElements.length) {
          builder = [...builder, ...el.groupElements];
        }
      });

      const fields = builder.filter(
        (f) =>
          f._tag === 'cost-total' ||
          (f._tag === 'cost-repeater' && (f.enableFormula || f.sumAllAvailable))
      );

      if (fields && fields.length > 0) {
        let result = fields.map((f, idx) => ({
          idx,
          title: f.label,
          alias: f.alias,
        }));
        return result;
      } else {
        this.defaultFormula = [{ idx: 0, title: 'Total description' }];
        this.formulas = [{ idx: 0, title: 'Total description' }];
        return this.defaultFormula;
      }
    },

    getTotalsIdx() {
      return this.formulas.map((f) => f.idx);
    },
  },

  methods: {
    multiselectChooseTotals(formula) {
      const inArray = this.formulas.find((f) => f.idx === formula.idx);
      if (inArray) return this.removeIdx(formula);

      this.formulas.push(formula);
    },

    removeIdx(formula) {
      this.formulas = this.formulas.filter((f) => f.idx !== formula.idx);
    },

    updateFormulas() {
      const formulas = this.getFormulaFields;
      if (
        this.formulas.length === 0 &&
        Array.isArray(formulas) &&
        typeof formulas[0] !== 'undefined'
      ) {
        this.formulas.push(formulas[0]);
      }
    },

    clear() {
      const formulas = this.getFormulaFields;
      if (this.formulas.length > 0) {
        this.formulas = this.formulas.filter((f) => {
          const fInFormulas = formulas.find(
            (innerF) => innerF.idx === f.idx && f.title === innerF.title
          );
          return !!fInFormulas;
        });
      }
    },

    removeExactError(type, field) {
      const settingsErrors = this.$store.getters.getSettingsError || [];
      const removedSettings = settingsErrors.filter(
        (e) => e.type !== type && e.field !== field
      );
      this.$store.commit('setSettingsError', removedSettings);
    },

    isError(type, field) {
      const settingsErrors = this.$store.getters.getSettingsError || [];
      if (!settingsErrors.length) return false;
      const found = settingsErrors.find(
        (e) => e.type === type && e.field === field
      );
      return !!found;
    },

    autoSelect(e, formula) {
      if (e.target?.className === 'option-item settings-item') {
        this.multiselectChooseTotals(formula);
      }
    },
  },

  filters: {
    'to-short': (value) => {
      if (value && value.length >= 20) {
        return value.substring(0, 17) + '...';
      }
      return value || '';
    },
    'to-short-input': (value) => {
      const available = window.screen.width > 1440 ? 23 : 19;
      if (value && value.length >= available) {
        return value.substring(0, available - 3) + '...';
      }
      return value || '';
    },

    'to-short-description': (value) => {
      if (value && value.length >= 88) {
        return value.substring(0, 85) + '...';
      }
      return value || '';
    },
  },

  watch: {
    'settingsField.formFields.terms_and_conditions.page_id': function () {
      let page_id = this.settingsField.formFields.terms_and_conditions.page_id;
      let page = this.$store.getters.getPages.find(
        (page) => page.id === parseInt(page_id)
      );
      if (page !== undefined) {
        this.settingsField.formFields.terms_and_conditions.link = page.link;
        if (
          this.settingsField.formFields.terms_and_conditions.link_text
            .length === 0
        ) {
          this.settingsField.formFields.terms_and_conditions.link_text =
            page.title.length < 21
              ? page.title
              : page.title.substr(0, 20) + '...';
        }
      } else {
        this.settingsField.formFields.terms_and_conditions.link = '';
      }
    },
  },
};
