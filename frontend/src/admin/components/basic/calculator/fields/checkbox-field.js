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
    options: [],
  },

  data: () => ({
    checkboxField: {},
    errors: {},
    tab: 'main',
    errorsCount: 0,
    fieldOptions: [],
  }),

  computed: {
    getDescOptions() {
      return this.$store.getters.getDescOptions;
    },

    getCheckboxStyles() {
      return [
        {
          label: 'Default',
          value: 'default',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/checkbox_vertical.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/checkbox_horizontal.png`,
          },
        },
        {
          label: 'Box',
          value: 'box',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_5_vertical.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_5_horizontal.png`,
          },
        },
        {
          label: 'Box with checkbox',
          value: 'box-with-checkbox',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_2_vertical.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_2_horizontal.png`,
          },
        },
        {
          label: 'Box with checkbox and description',
          value: 'box-with-checkbox-and-description',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/checkbox_box_vertical.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/checkbox_box_horizontal.png`,
          },
        },
        {
          label: 'Box with heading checkbox and description',
          value: 'box-with-heading-checkbox-and-description',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_1_vertical.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_1_horizontal.png`,
          },
        },
      ];
    },

    getCurrentImage() {
      if (this.checkboxField.styles) {
        const current = this.getCheckboxStyles.find(
          (s) => s.value === this.checkboxField.styles.style
        );
        if (current) {
          return current.img[this.checkboxField.styles.box_style];
        }
      }

      return `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/checkbox_vertical.png`;
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
    this.checkboxField = { ...this.resetValue(), ...this.field };

    this.fieldOptions = JSON.parse(
      JSON.stringify(this.checkboxField?.options || [])
    );

    if (this.checkboxField._id === null) {
      this.checkboxField._id = this.order;
      this.checkboxField.alias =
        this.checkboxField.alias + this.checkboxField._id;
    }
    this.checkboxField.required = this.checkboxField.hasOwnProperty('required')
      ? JSON.parse(this.checkboxField.required)
      : false;

    this.checkboxField.apply_style_for_all = false;
    setTimeout(() => {
      if (
        this.settings.general.styles &&
        this.settings.general.styles.checkbox
      ) {
        this.checkboxField.apply_style_for_all = true;
        if (this.checkboxField.styles) {
          const fields = this.$store.getters.getBuilder;
          const field = fields.find(
            (f) => f.alias === this.settings.general.styles.checkbox
          );
          if (field) {
            this.checkboxField.styles = JSON.parse(
              JSON.stringify(field.styles)
            );
          }
        }
      }
    });
  },

  methods: {
    /** get Option name form options list **/
    getOptionTextByChoosenOption(chosenOption) {
      if (
        chosenOption.split('_').length === 2 &&
        this.fieldOptions.hasOwnProperty(chosenOption.split('_')[1])
      ) {
        return this.fieldOptions[chosenOption.split('_')[1]].optionText;
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

      let chosen = option.optionValue + '_' + optionIndex;
      let defaultValues =
        this.checkboxField.default !== undefined &&
        this.checkboxField.default.length > 0
          ? this.checkboxField.default.split(',')
          : [];

      let index = defaultValues.indexOf(chosen);
      if (index !== -1) {
        defaultValues.splice(index, 1);
      } else {
        defaultValues.push(chosen);
      }
      this.checkboxField.default = defaultValues.join(',');
    },

    updateDefault() {
      let defaultValues =
        this.checkboxField.default?.length > 0
          ? this.checkboxField.default.split(',')
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
      this.checkboxField.default = defaultValues.join(',');
    },

    /** remove from default option by index **/
    removeOptionFromDefault(optionIndex) {
      let defaultValues =
        this.checkboxField.default.length > 0
          ? this.checkboxField.default.split(',')
          : [];
      defaultValues.forEach((defaultOption, index) => {
        if (
          +optionIndex === +defaultOption.split('_')[1] &&
          defaultOption.split('_').length === 2
        ) {
          defaultValues.splice(index, 1);
        }
      });
      this.checkboxField.default = defaultValues.join(',');
    },

    addOption() {
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
      if (this.checkboxField.default === optionValue + '_' + index)
        this.checkboxField.default = '';
      this.fieldOptions.splice(index, 1);
      this.removeOptionFromDefault(index);
    },

    resetValue() {
      return {
        _id: null,
        label: '',
        default: '',
        description: '',
        required: false,
        _event: 'change',
        type: 'Checkbox',
        allowRound: false,
        additionalCss: '',
        additionalStyles: '',
        addToSummary: true,
        allowCurrency: false,
        checkedLength: 0,
        minChecked: 0,
        _tag: 'cost-checkbox',
        icon: 'ccb-icon-Path-3512',
        alias: 'checkbox_field_id_',
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

    save(checkboxField, id, index, alias) {
      this.validate(checkboxField);
      if (Object.keys(this.errors).length > 0) return;

      const settings = this.settings;
      if (this.checkboxField.apply_style_for_all === true) {
        settings.general.styles.checkbox = this.checkboxField.alias;
        this.settings = settings;
      } else {
        settings.general.styles.checkbox = '';
        this.settings = settings;
      }

      this.checkboxField.options = this.fieldOptions;
      this.$emit('save', checkboxField, id, index, alias);
    },

    checkRequired(alias) {
      this.removeErrorTip(alias);
      this.errorsCount--;
    },

    validate() {
      this.errorsCount = 0;
      delete this.errors.checkbox;

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
            this.errors.checkbox = true;
            this.$store.commit('setEditFieldError', true);
            document.getElementById(
              'errorOptionValue' + index
            ).innerHTML = `<span class="ccb-error-tip default">this is required field</span>`;
          }
        });
      }
    },
  },

  destroyed() {
    this.$store.commit('setEditFieldError', false);
  },

  watch: {
    '$store.getters.getEditFieldError': function (value) {
      if (value === 'save_field') {
        this.save(this.checkboxField, this.id, this.index);
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
