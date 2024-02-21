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
    radioField: {},
    errors: {},
    tab: 'main',
    errorsCount: 0,
    fieldOptions: [],
  }),

  mounted() {
    this.field = this.field.hasOwnProperty('_id') ? this.field : {};
    this.radioField = { ...this.resetValue(), ...this.field };

    this.fieldOptions = JSON.parse(
      JSON.stringify(this.radioField.options || [])
    );

    if (this.radioField._id === null) {
      this.radioField._id = this.order;
      this.radioField.alias = this.radioField.alias + this.radioField._id;
    }
    this.radioField.required = this.radioField.hasOwnProperty('required')
      ? JSON.parse(this.radioField.required)
      : false;
    if (!this.radioField.default) this.radioField.default = '';

    this.radioField.apply_style_for_all = false;
    setTimeout(() => {
      if (this.settings.general.styles && this.settings.general.styles.radio) {
        this.radioField.apply_style_for_all = true;
        if (this.radioField.styles) {
          const fields = this.$store.getters.getBuilder;
          const field = fields.find(
            (f) => f.alias === this.settings.general.styles.radio
          );
          if (field) {
            this.radioField.styles = JSON.parse(JSON.stringify(field.styles));
          }
        }
      }
    });
  },

  computed: {
    options() {
      let options = [];
      if (this.radioField && this.fieldOptions)
        options = Array.from(this.fieldOptions).filter((e) => e.optionText);

      if (!this.radioField.default) this.radioField.default = '';

      return options;
    },

    getDescOptions() {
      return this.$store.getters.getDescOptions;
    },

    getRadioStyles() {
      return [
        {
          label: 'Default',
          value: 'default',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/radio/radio_vertical.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/radio/radio_horizontal.png`,
          },
        },
        {
          label: 'Box',
          value: 'box',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/radio/style_1_vertical.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/radio/style_1_horizontal.png`,
          },
        },
        {
          label: 'Box with Radio Button',
          value: 'box-with-radio',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/radio/style_2_vertical.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/radio/style_2_horizontal.png`,
          },
        },
      ];
    },

    getCurrentImage() {
      if (this.radioField.styles) {
        const current = this.getRadioStyles.find(
          (s) => s.value === this.radioField.styles.style
        );
        if (current) {
          return current.img[this.radioField.styles.box_style];
        }
      }

      return `${window.ajax_window.plugin_url}/frontend/dist/img/styles/radio/radio_vertical.png`;
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

  methods: {
    addOption: function () {
      this.fieldOptions.push({ optionText: '', optionValue: '' });
    },

    changeDefault(event, val, index) {
      const vm = this;
      let [, indexValue] = vm.radioField.default.split('_');
      if (indexValue === index) vm.radioField.default = val + '_' + index;
    },

    checkRequired(alias) {
      this.removeErrorTip(alias);
      this.errorsCount--;
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
      if (this.radioField.default === optionValue + '_' + index)
        this.radioField.default = '';
      this.fieldOptions.splice(index, 1);
    },

    resetValue() {
      return {
        label: '',
        _id: null,
        default: '',
        onValue: null,
        description: '',
        required: false,
        _event: 'change',
        allowRound: false,
        additionalCss: '',
        _tag: 'cost-radio',
        additionalStyles: '',
        addToSummary: true,
        allowCurrency: false,
        type: 'Radio Button',
        icon: 'ccb-icon-Path-3511',
        alias: 'radio_field_id_',
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
          },
        ],
        apply_style_for_all: false,
      };
    },

    save(radioField, id, index, alias) {
      this.validate(radioField);
      if (Object.keys(this.errors).length > 0) return;

      const settings = this.settings;
      if (this.radioField.apply_style_for_all === true) {
        settings.general.styles.radio = this.radioField.alias;
        this.settings = settings;
      } else {
        settings.general.styles.radio = '';
        this.settings = settings;
      }

      this.radioField.options = this.fieldOptions || [];
      this.$emit('save', radioField, id, index, alias);
    },

    validate() {
      delete this.errors.radio;
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
        this.save(this.radioField, this.id, this.index);
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
