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

    available: {
      default: [],
    },
  },

  data: () => ({
    errors: { max: false, min: false, step: false },
    numFields: ['default', 'step', 'unit', 'min', 'max'],
    quantityField: {},
    tab: 'main',
    errorsCount: 0,
  }),

  mounted() {
    this.field = this.field.hasOwnProperty('_id') ? this.field : {};
    this.quantityField = { ...this.resetValue(), ...this.field };

    if (this.quantityField._id === null) {
      this.quantityField._id = this.order;
      this.quantityField.alias =
        this.quantityField.alias + this.quantityField._id;
    }

    this.quantityField.required = this.quantityField.hasOwnProperty('required')
      ? JSON.parse(this.quantityField.required)
      : false;
  },

  computed: {
    getDescOptions() {
      return this.$store.getters.getDescOptions;
    },
    translations() {
      return this.$store.getters.getTranslations;
    },
  },

  methods: {
    unitMinValue(event) {
      let keyCode = event.keyCode ? event.keyCode : event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        // 46 is dot
        event.preventDefault();
      }
    },

    numberCounterAction(modelKey, action = '+') {
      let input = document.querySelector('input[name=' + modelKey + ']');
      let step = 1;
      let toFixedCount = 2;

      if (!this.quantityField.hasOwnProperty(modelKey) || input === null) {
        return;
      }

      if (input.step.length !== 0) {
        step = input.step;
      }

      let value = this.quantityField[modelKey];

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

      if (value) {
        this.quantityField[modelKey] = value;
      }
    },

    close() {
      this.$emit('cancel');
    },

    parseNumFields() {
      this.numFields.forEach((modelKey) => {
        /** remove dot if ends on it, and if just dot in value **/
        if (
          this.quantityField.hasOwnProperty(modelKey) &&
          this.quantityField[modelKey].lastIndexOf('.') ===
            this.quantityField[modelKey].length - 1
        ) {
          this.quantityField[modelKey] = this.quantityField[modelKey].substring(
            0,
            this.quantityField[modelKey].length - 1
          );
        }
      });
    },

    validate() {
      let valid = true;
      this.errorsCount = 0;

      if (!this.stringValueAsNum(`${this.quantityField.step || 1}`)) {
        this.errors.step = this.translations.required_field;
        valid = false;
        this.errorsCount++;
      }

      if (!this.stringValueAsNum(`${this.quantityField.min || 0}`)) {
        this.errors.min = this.translations.required_field;
        valid = false;
        this.errorsCount++;
      }

      if (!this.stringValueAsNum(`${this.quantityField.max || 100}`)) {
        this.errors.max = this.translations.required_field;
        valid = false;
        this.errorsCount++;
      }

      if (
        this.quantityField.min &&
        this.quantityField.max &&
        parseFloat(this.quantityField.min) > parseFloat(this.quantityField.max)
      ) {
        this.errors.max = this.translations.min_higher_max;
        valid = false;
        this.errorsCount++;
      }

      /** check 'default' is in min/max range */
      if (
        this.quantityField.default &&
        (this.quantityField.min || this.quantityField.max)
      ) {
        if (
          this.quantityField.min &&
          this.quantityField.max &&
          (parseFloat(this.quantityField.default) >
            parseFloat(this.quantityField.max) ||
            parseFloat(this.quantityField.default) <
              parseFloat(this.quantityField.min))
        ) {
          this.errors.default = this.translations.must_be_between;
          valid = false;
          this.errorsCount++;
        } else if (
          this.quantityField.min &&
          parseFloat(this.quantityField.default) <
            parseFloat(this.quantityField.min)
        ) {
          this.errors.default = this.translations.must_be_greater_min;
          valid = false;
          this.errorsCount++;
        } else if (
          this.quantityField.max &&
          parseFloat(this.quantityField.default) >
            parseFloat(this.quantityField.max)
        ) {
          this.errors.default = this.translations.must_be_less_max;
          valid = false;
          this.errorsCount++;
        }
      }

      return valid;
    },
    save(quantityField, id, index, alias) {
      this.parseNumFields();

      let valid = this.validate();
      if (valid) {
        this.$emit('save', quantityField, id, index, alias);
      }
    },

    resetValue() {
      return {
        unit: 1,
        min: 0,
        max: 100,
        label: '',
        _id: null,
        default: '',
        description: '',
        placeholder: '',
        required: false,
        _event: 'keyup',
        type: 'Quantity',
        allowRound: false,
        additionalCss: '',
        additionalStyles: '',
        addToSummary: true,
        allowCurrency: false,
        multiply: false,
        unitPosition: 'right',
        unitSymbol: '',
        enabled_currency_settings: false,
        _tag: 'cost-quantity',
        icon: 'ccb-icon-Subtraction-6',
        alias: 'quantity_field_id_',
        desc_option: 'after',
        step: 1,
      };
    },
  },
  watch: {
    quantityField: {
      handler: function (value) {
        /** clean all errors **/
        Object.keys(this.errors).forEach((key) => {
          this.errors[key] = false;
        });

        this.validate();

        if (!value.unit) {
          value.unit = 1;
        }

        this.numFields.forEach((modelKey) => {
          if (!value.hasOwnProperty(modelKey) || value[modelKey].length <= 0) {
            return;
          }
          this.quantityField[modelKey] = this.stringValueAsNum(value[modelKey]);
        });
      },
      deep: true,
      immediate: true,
    },
  },
};
