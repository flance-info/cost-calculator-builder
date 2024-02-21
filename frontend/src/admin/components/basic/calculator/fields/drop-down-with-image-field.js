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
    dropField: {},
    errors: {},
    tab: 'main',
    errorsCount: 0,
    fieldOptions: [],
  }),

  computed: {
    getDescOptions() {
      return this.$store.getters.getDescOptions;
    },

    translations() {
      return this.$store.getters.getTranslations;
    },
  },

  mounted() {
    this.field = this.field.hasOwnProperty('_id') ? this.field : {};
    this.dropField = { ...this.resetValue(), ...this.field };

    this.fieldOptions = JSON.parse(
      JSON.stringify(this.dropField.options || [])
    );

    if (this.dropField._id === null) {
      this.dropField._id = this.order;
      this.dropField.alias = this.dropField.alias + this.dropField._id;
    }

    this.dropField.required = this.dropField.hasOwnProperty('required')
      ? JSON.parse(this.dropField.required)
      : false;
    if (!this.dropField.default) this.dropField.default = '';
  },

  methods: {
    numberCounterActionForOption(optionIndex, action = '+') {
      let step = 1,
        value = 0,
        toFixedCount = 2;

      const $input = document.querySelector(
        'input[name=option_' + optionIndex + ']'
      );
      if (!this.fieldOptions.hasOwnProperty(optionIndex) || $input === null) {
        return;
      }

      if ($input.step.length !== 0) {
        step = $input.step;
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

      if ($input.min.length !== 0 && value < $input.min) {
        return;
      }

      value =
        parseInt(step) === parseFloat(step)
          ? value.toFixed()
          : value.toFixed(toFixedCount);

      this.removeErrorTip('errorOptionValue' + optionIndex);
      this.fieldOptions[optionIndex].optionValue = value;
    },

    resetValue() {
      return {
        label: '',
        _id: null,
        default: '',
        description: '',
        required: false,
        nextTickCount: 0,
        hasNextTick: true,
        fieldDisabled: false,
        _event: 'change',
        allowRound: false,
        additionalCss: '',
        additionalStyles: '',
        addToSummary: true,
        allowCurrency: false,
        type: 'Drop Down With Image',
        _tag: 'cost-drop-down-with-image',
        icon: 'ccb-icon-Union-30',
        alias: 'dropDown_with_img_field_id_',
        desc_option: 'after',
        summary_view: 'show_value',
        options: [
          {
            src: null,
            optionText: '',
            optionValue: '',
            id: `option_${this.randomID()}`,
          },
        ],
        show_value_in_option: true,
      };
    },

    save(dropField, id, index, alias) {
      this.validate(dropField);
      if (Object.keys(this.errors).length > 0) return;

      this.dropField.options = this.fieldOptions || [];
      this.$emit('save', dropField, id, index, alias);
    },

    validate(dropField, saveAction = true, idx) {
      delete this.errors.dropField;
      this.errorsCount = 0;
      if (this.fieldOptions) {
        let invalidOptionId = null;
        Array.from(this.fieldOptions).map((element, index) => {
          const $option = document.getElementById(`errorOptionValue${index}`);
          $option ? ($option.innerHTML = '') : null;

          /** display tooltip error if format does not match (JPG, PNG) **/
          if (idx === index && !element.src && !saveAction)
            invalidOptionId = element.id;

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
          this.errors.dropField = true;
          $errorImage.innerHTML = `<span class="error-tip" style="max-width: unset; top: -45px">${this.translations?.format_error}</span>`;
        }
      }
    },

    checkRequired(alias) {
      this.removeErrorTip(alias);
      this.errorsCount--;
    },

    changeDefault(event, val, index) {
      const vm = this;
      let [, indexValue] = vm.dropField.default.split('_');
      if (+indexValue === +index) vm.dropField.default = val + '_' + index;
    },

    removeErrorTip(index) {
      const errorClass = document.getElementById(index);
      while (errorClass.firstChild)
        errorClass.removeChild(errorClass.firstChild);
    },

    removeOption(index, optionValue) {
      if (this.dropField.default === optionValue + '_' + index)
        this.dropField.default = '';
      this.fieldOptions.splice(index, 1);
    },

    addOption() {
      this.fieldOptions.push({
        src: null,
        optionText: '',
        optionValue: '',
        id: `option_${this.randomID()}`,
      });
    },

    setThumbnail(src, index, actionClear = false) {
      if (this.fieldOptions[index]) this.fieldOptions[index].src = src;

      if (!actionClear) this.validate(this.dropField, false, +index);
    },
  },

  destroyed() {
    this.$store.commit('setEditFieldError', false);
  },

  watch: {
    '$store.getters.getEditFieldError': function (value) {
      if (value === 'save_field') {
        this.save(this.dropField, this.id, this.index);
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
