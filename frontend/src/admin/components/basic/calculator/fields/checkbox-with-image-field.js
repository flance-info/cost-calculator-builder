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
    checkboxField: {},
    errors: {},
    tab: 'main',
    errorsCount: 0,
    selectedIdx: null,
    fieldOptions: [],
  }),

  computed: {
    options() {
      let options = [];
      if (this.checkboxField && this.fieldOptions)
        options = Array.from(this.fieldOptions).filter((e) => e.optionText);

      if (!this.checkboxField.default) this.checkboxField.default = '';

      return options;
    },

    getDescOptions() {
      return this.$store.getters.getDescOptions;
    },

    translations() {
      return this.$store.getters.getTranslations;
    },

    getCheckboxStyles() {
      return [
        {
          label: 'Default',
          value: 'default',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/image_default.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/image_default.png`,
          },
        },
        {
          label: 'Box with icon',
          value: 'with-icon',
          img: {
            vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_6_vertical.png`,
            horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_6_horizontal.png`,
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

      return `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/image_default.png`;
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
        this.settings.general.styles.checkbox_with_img
      ) {
        this.checkboxField.apply_style_for_all = true;
        if (this.checkboxField.styles) {
          const fields = this.$store.getters.getBuilder;
          const field = fields.find(
            (f) => f.alias === this.settings.general.styles.checkbox_with_img
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
        this.checkboxField.default.length !== undefined &&
        this.checkboxField.default.length > 0
          ? this.checkboxField.default.split(',')
          : [];

      let index = defaultValues.indexOf(choosen);
      if (index !== -1) {
        defaultValues.splice(index, 1);
      } else {
        defaultValues.push(choosen);
      }
      this.checkboxField.default = defaultValues.join(',');
    },

    /** clean up default options **/
    updateDefault() {
      let defaultValues =
        this.checkboxField.default.length > 0
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
        this.checkboxField.default !== undefined &&
        this.checkboxField.default.length > 0
          ? this.checkboxField.default.split(',')
          : [];
      defaultValues.forEach((defaultOption, index) => {
        if (
          optionIndex === defaultOption.split('_')[1] &&
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
        src: null,
        icon: null,
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
      if (this.checkboxField.default === optionValue + '_' + index) {
        this.checkboxField.default = '';
      }
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
        type: 'Checkbox With Image',
        allowRound: false,
        checkedLength: 0,
        additionalCss: '',
        additionalStyles: '',
        addToSummary: true,
        allowCurrency: false,
        _tag: 'cost-checkbox-with-image',
        icon: 'ccb-icon-Path-3512',
        alias: 'checkbox_with_img_field_id_',
        desc_option: 'after',
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
        show_value_in_option: true,
      };
    },

    save(checkboxField, id, index, alias) {
      this.validate(checkboxField);
      if (Object.keys(this.errors).length > 0) return;

      const settings = this.settings;
      if (this.checkboxField.apply_style_for_all === true) {
        settings.general.styles.checkbox_with_img = this.checkboxField.alias;
        this.settings = settings;
      } else {
        settings.general.styles.checkbox_with_img = '';
        this.settings = settings;
      }

      this.checkboxField.options = this.fieldOptions || [];
      this.$emit('save', checkboxField, id, index, alias);
    },

    checkRequired(alias) {
      this.removeErrorTip(alias);
      this.errorsCount--;
    },

    validate(checkboxField, saveAction = true, idx) {
      delete this.errors.checkbox;
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
            this.checkboxField.styles &&
            this.checkboxField.styles.style === 'with-icon'
              ? element.icon
              : element.src;
          if (!imageOrIcon && saveAction) {
            invalidOptionId = element.id;
            this.errorsCount++;
            this.errors.checkbox = true;
            this.$store.commit('setEditFieldError', true);
            $optionImg.innerHTML = `<span class="ccb-error-tip default">this is required field</span>`;
          }

          /** display tooltip error if there are empty option value **/
          if ($option && element.optionValue.length === 0 && saveAction) {
            this.errorsCount++;
            this.errors.checkbox = true;
            this.$store.commit('setEditFieldError', true);
            $option.innerHTML = `<span class="ccb-error-tip default">this is required field</span>`;
          }
        });

        /** reset error content **/
        const errors = document.querySelectorAll('.invalid-format-fields');
        errors?.forEach((e) => (e ? (e.innerHTML = '') : null));

        const $errorImage = document.getElementById(
          `errorImage_${invalidOptionId}`
        );
        if (typeof idx === 'number' && invalidOptionId && $errorImage) {
          this.errors.checkbox = true;
          $errorImage.innerHTML = `<span class="error-tip" style="max-width: unset; top: -45px">${this.translations?.format_error}</span>`;
        }
      }
    },

    setThumbnail(src, index, actionClear = false) {
      if (this.fieldOptions[index]) {
        if (
          this.checkboxField.styles &&
          this.checkboxField.styles.style === 'with-icon'
        ) {
          this.fieldOptions[index].icon = src;
        } else {
          this.fieldOptions[index].src = src;
        }
      }

      if (!actionClear) this.validate(this.checkboxField, false, +index);
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
        optionsData.forEach((option, index) => {
          if (option.optionValue.length <= 0) {
            return;
          }

          this.updateDefault(optionsData);
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
