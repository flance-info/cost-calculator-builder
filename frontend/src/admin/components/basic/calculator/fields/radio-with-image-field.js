import imgSelector from '../../../utility/imgSelector';
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

  components: {
    'img-selector': imgSelector,
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
      if (
        this.settings.general.styles &&
        this.settings.general.styles.radio_with_img
      ) {
        this.radioField.apply_style_for_all = true;
        if (this.radioField.styles) {
          const fields = this.$store.getters.getBuilder;
          const field = fields.find(
            (f) => f.alias === this.settings.general.styles.radio_with_img
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

    translations() {
      return this.$store.getters.getTranslations;
    },

    getRadioStyles() {
      return [
        {
          label: 'Default',
          value: 'default',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/radio/pro_default.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/radio/pro_default.png`,
          },
        },
        {
          label: 'Box with icon',
          value: 'with-icon',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/radio/style_3_vertical.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/radio/style_3_horizontal.png`,
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

      return `${window.ajax_window.plugin_url}/frontend/dist/img/styles/radio/pro_default.png`;
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
      this.fieldOptions.push({
        src: null,
        optionText: '',
        optionValue: '',
        icon: null,
      });
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
      let step = 1,
        value = 0,
        toFixedCount = 2;

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
        _tag: 'cost-radio-with-image',
        additionalStyles: '',
        addToSummary: true,
        allowCurrency: false,
        type: 'Radio With Image',
        icon: 'ccb-icon-Path-3511',
        alias: 'radio_with_img_field_id_',
        desc_option: 'after',
        summary_view: 'show_value',
        styles: {
          box_style: 'vertical',
          style: 'default',
        },
        options: [
          {
            src: null,
            optionText: '',
            optionValue: '',
          },
        ],
        apply_style_for_all: false,
        show_value_in_option: true,
      };
    },

    save(radioField, id, index, alias) {
      this.validate(radioField);
      if (Object.keys(this.errors).length > 0) return;

      const settings = this.settings;
      if (this.radioField.apply_style_for_all === true) {
        settings.general.styles.radio_with_img = this.radioField.alias;
        this.settings = settings;
      } else {
        settings.general.styles.radio_with_img = '';
        this.settings = settings;
      }

      this.radioField.options = this.fieldOptions || [];
      this.$emit('save', radioField, id, index, alias);
    },

    validate(radioField, saveAction = true, idx) {
      delete this.errors.radio;
      this.errorsCount = 0;

      if (this.fieldOptions) {
        let invalidOptionId = null;
        Array.from(this.fieldOptions).map((element, index) => {
          const $option = document.getElementById(`errorOptionValue${index}`);
          $option ? ($option.innerHTML = '') : null;

          const $optionImg = document.getElementById(
            `errorOptionImage${index}`
          );
          $optionImg ? ($optionImg.innerHTML = '') : null;

          /** display tooltip error if format does not match (JPG, PNG) **/
          const imageOrIcon =
            this.radioField.styles &&
            this.radioField.styles.style === 'with-icon'
              ? element.icon
              : element.src;
          if (!imageOrIcon && saveAction) {
            invalidOptionId = element.id;
            this.errorsCount++;
            this.errors.radio = true;
            this.$store.commit('setEditFieldError', true);
            $optionImg.innerHTML = `<span class="ccb-error-tip default">this is required field</span>`;
          }

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

        /** reset error content **/
        const errors = document.querySelectorAll('.invalid-format-fields');
        errors?.forEach((e) => (e ? (e.innerHTML = '') : null));

        const $errorImage = document.getElementById(
          `errorImage_${invalidOptionId}`
        );
        if (typeof idx === 'number' && invalidOptionId && $errorImage) {
          this.errors.radio = true;
          $errorImage.innerHTML = `<span class="error-tip" style="max-width: unset; top: -45px">${this.translations?.format_error}</span>`;
        }
      }
    },

    setThumbnail(src, index, actionClear = false) {
      if (this.fieldOptions[index]) {
        if (
          this.radioField.styles &&
          this.radioField.styles.style === 'with-icon'
        ) {
          this.fieldOptions[index].icon = src;
        } else {
          this.fieldOptions[index].src = src;
        }
      }

      if (!actionClear) this.validate(this.radioField, false, +index);
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
