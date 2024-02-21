import fieldMixin from './mixins/field-mixin';

export default {
  mixins: [fieldMixin],
  props: {
    field: {
      type: Object,
      default: {},
    },

    id: {
      default: null,
    },

    order: {
      default: 0,
    },

    index: {
      default: null,
    },
  },

  data: () => ({
    toggleField: {},
    errors: {},
    tab: 'main',
    errorsCount: 0,
    fieldOptions: [],
  }),

  computed: {
    getDescOptions() {
      return this.$store.getters.getDescOptions;
    },

    getToggleStyles() {
      return [
        {
          label: 'Default',
          value: 'default',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/toggle/vertical_toggle.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/toggle/horizontal_toggle.png`,
          },
        },
        {
          label: 'Box with toggle and description',
          value: 'box-with-toggle-and-description',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/toggle/style_1.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/toggle/style_1.png`,
          },
        },
      ];
    },

    getCurrentImage() {
      if (this.toggleField.styles) {
        const current = this.getToggleStyles.find(
          (s) => s.value === this.toggleField.styles.style
        );
        if (current) {
          return current.img[this.toggleField.styles.box_style];
        }
      }

      return `${window.ajax_window.plugin_url}/frontend/dist/img/styles/toggle/vertical_toggle.png`;
    },

    settings: {
      get() {
        return this.$store.getters.getSettings;
      },

      set(value) {
        this.$store.commit('updateSettings', value);
      },
    },
  },

  mounted() {
    this.field = this.field.hasOwnProperty('_id') ? this.field : {};
    this.toggleField = { ...this.resetValue(), ...this.field };

    this.fieldOptions = JSON.parse(
      JSON.stringify(this.toggleField.options || [])
    );

    if (this.toggleField._id === null) {
      this.toggleField._id = this.order;
      this.toggleField.alias = this.toggleField.alias + this.toggleField._id;
    }
    this.toggleField.required = this.toggleField.hasOwnProperty('required')
      ? JSON.parse(this.toggleField.required)
      : false;

    this.toggleField.apply_style_for_all = false;
    setTimeout(() => {
      if (this.settings.general.styles && this.settings.general.styles.toggle) {
        this.toggleField.apply_style_for_all = true;
        if (this.toggleField.styles) {
          const fields = this.$store.getters.getBuilder;
          const field = fields.find(
            (f) => f.alias === this.settings.general.styles.toggle
          );
          if (field) {
            this.toggleField.styles = JSON.parse(JSON.stringify(field.styles));
          }
        }
      }
    });
  },

  methods: {
    /** get Option name form options list **/
    getOptionTextByChoosenOption(choosenOption) {
      if (
        choosenOption.split('_').length === 2 &&
        this.fieldOptions.hasOwnProperty(choosenOption.split('_')[1])
      ) {
        return this.fieldOptions[choosenOption.split('_')[1]].optionText;
      }
      return '';
    },

    /** remove from default by choosen **/
    removeFromDefaultValueByChoosenOption(choosenOption) {
      if (choosenOption.length <= 0 || choosenOption.split('_').length < 2) {
        return;
      }
      if (this.fieldOptions.hasOwnProperty(choosenOption.split('_')[1])) {
        this.chooseDefaultValues(
          choosenOption.split('_')[1],
          this.fieldOptions[choosenOption.split('_')[1]]
        );
      }
    },

    /** add option to default **/
    chooseDefaultValues(optionIndex, option) {
      if (option.optionValue.length === 0) {
        this.errors.checkbox = true;
        document.getElementById(
          'errorOptionValue' + optionIndex
        ).innerHTML = `<span class="ccb-error-tip default">this is required field</span>`;
        return;
      }

      let choosen = option.optionValue + '_' + optionIndex;
      let defaultValues =
        this.toggleField.default.length > 0
          ? this.toggleField.default.split(',')
          : [];

      let index = defaultValues.indexOf(choosen);
      if (index !== -1) {
        defaultValues.splice(index, 1);
      } else {
        defaultValues.push(choosen);
      }
      this.toggleField.default = defaultValues.join(',');
    },

    /** clean up default options **/
    updateDefault() {
      let defaultValues =
        this.toggleField.default !== undefined &&
        this.toggleField.default.length > 0
          ? this.toggleField.default.split(',')
          : [];

      defaultValues.forEach((defaultOption, index) => {
        if (defaultOption.split('_').length < 2) {
          defaultValues.splice(index, 1);
        }
        let optionIndex = defaultOption.split('_')[1];
        let optionValue = defaultOption.split('_')[0];

        if (optionValue.length <= 0 || optionIndex.length <= 0) {
          defaultValues.splice(index, 1);
        }

        if (!this.fieldOptions.hasOwnProperty(optionIndex)) {
          defaultValues.splice(index, 1);
        }
      });
      this.toggleField.default = defaultValues.join(',');
    },

    /** remove from default option by index **/
    removeOptionFromDefault(optionIndex) {
      let defaultValues =
        this.toggleField.default.length > 0
          ? this.toggleField.default.split(',')
          : [];
      defaultValues.forEach((defaultOption, index) => {
        if (
          +optionIndex === +defaultOption.split('_')[1] &&
          defaultOption.split('_').length === 2
        ) {
          defaultValues.splice(index, 1);
        }
      });
      this.toggleField.default = defaultValues.join(',');
    },

    addOption: function () {
      this.fieldOptions.push({
        optionText: '',
        optionValue: '',
        optionHint: '',
      });
    },

    numberCounterActionForOption(optionIndex, action = '+') {
      let input = document.querySelector(
        'input[name=option_' + optionIndex + ']'
      );
      let step = 1;
      let value = 0;
      let toFixedCount = 2;

      if (!this.fieldOptions.hasOwnProperty(optionIndex) || input === null) {
        return;
      }

      if (input.step.length !== 0) {
        step = input.step;
      }

      if (this.fieldOptions[optionIndex].optionValue.length > 0) {
        value = this.fieldOptions[optionIndex].optionValue;
      }

      if (this.isFloat(value)) {
        toFixedCount = value.split('.')[1].length;
        /** set step based on count of integers after dot **/
        step = Math.pow(0.1, toFixedCount).toFixed(toFixedCount);
      }

      value =
        action === '-'
          ? parseFloat(value) - parseFloat(step)
          : parseFloat(value) + parseFloat(step);

      if (input.min.length !== 0 && value < input.min) {
        return;
      }

      value =
        parseInt(step) === parseFloat(step)
          ? value.toFixed()
          : value.toFixed(toFixedCount);

      this.removeErrorTip('errorOptionValue' + optionIndex);
      this.fieldOptions[optionIndex].optionValue = value;
    },

    removeErrorTip(index) {
      const errorClass = document.getElementById(index);
      while (errorClass.firstChild)
        errorClass.removeChild(errorClass.firstChild);
    },

    removeOption(index, optionValue) {
      if (this.toggleField.default === optionValue + '_' + index) {
        this.toggleField.default = '';
      }
      this.fieldOptions.splice(index, 1);
      this.removeOptionFromDefault(index);
    },

    resetValue() {
      return {
        _id: null,
        label: '',
        default: '',
        type: 'Toggle',
        description: '',
        required: false,
        _event: 'change',
        allowRound: false,
        additionalCss: '',
        additionalStyles: '',
        addToSummary: true,
        allowCurrency: false,
        checkedLength: 0,
        _tag: 'cost-toggle',
        icon: 'ccb-icon-Path-3515',
        alias: 'toggle_field_id_',
        desc_option: 'after',
        summary_view: 'show_value',
        styles: {
          box_style: 'vertical',
          style: 'default',
        },
        options: [
          {
            optionText: '',
            optionValue: '',
            optionHint: '',
          },
        ],
        apply_style_for_all: false,
      };
    },

    save(toggleField, id, index, alias) {
      this.validate(toggleField, id, index);
      if (Object.keys(this.errors).length > 0) return;

      const settings = this.settings;
      if (this.toggleField.apply_style_for_all === true) {
        settings.general.styles.toggle = this.toggleField.alias;
        this.settings = settings;
      } else {
        settings.general.styles.toggle = '';
        this.settings = settings;
      }

      this.toggleField.options = this.fieldOptions || [];
      this.$emit('save', toggleField, id, index, alias);
    },

    validate() {
      delete this.errors.toggle;
      this.errorsCount = 0;
      if (this.fieldOptions) {
        Array.from(this.fieldOptions).map((element, index) => {
          document.getElementById('errorOptionValue' + index).innerHTML = '';
          /** remove dot if ends on it, and if just dot in value **/
          if (
            element.optionValue.lastIndexOf('.') ===
            element.optionValue.length - 1
          ) {
            element.optionValue = element.optionValue.substring(
              0,
              element.optionValue.length - 1
            );
          }
          if (element.optionValue.length === 0) {
            this.errorsCount++;
            this.errors.toggle = true;
            this.$store.commit('setEditFieldError', true);
            document.getElementById(
              'errorOptionValue' + index
            ).innerHTML = `<span class="ccb-error-tip default">this is required field</span>`;
          }
        });
      }
    },

    checkRequired(alias) {
      this.removeErrorTip(alias);
      this.errorsCount--;
    },
  },

  destroyed() {
    this.$store.commit('setEditFieldError', false);
  },

  watch: {
    '$store.getters.getEditFieldError': function (value) {
      if (value === 'save_field') {
        this.save(this.toggleField, this.id, this.index);
      }
    },
    fieldOptions: {
      handler: function (optionsData) {
        if (
          typeof optionsData === 'undefined' ||
          !(optionsData instanceof Array)
        ) {
          return;
        }
        this.updateDefault(optionsData);

        optionsData.forEach((option, index) => {
          if (option.optionValue.length <= 0) {
            return;
          }
          this.fieldOptions[index].optionValue = this.stringValueAsNum(
            option.optionValue
          );
        });
      },
      deep: true,
      immediate: true,
    },
  },
};
