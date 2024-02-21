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
    errorsCount: 0,
    errors: {
      minValue: false,
      maxValue: false,
      step: false,
      unit: false,
    },
    numFields: ['default', 'minValue', 'maxValue', 'step', 'unit'],
    rangeField: {},
    tab: 'main',
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
    this.rangeField = { ...this.resetValue(), ...this.field };
    if (this.rangeField._id === null) {
      this.rangeField._id = this.order;
      this.rangeField.alias = this.rangeField.alias + this.rangeField._id;
    }
  },

  methods: {
    unitMinValue(event) {
      let keyCode = event.keyCode ? event.keyCode : event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        // 46 is dot
        event.preventDefault();
      }
    },

    fixErrorByKey(key) {
      const value = this.stringValueAsNum(this.rangeField[key].toString());
      if (this.errors[key] !== false && value) {
        this.errors[key] = false;
        if (this.errorsCount) this.errorsCount--;
      }
    },

    numberCounterAction(modelKey, action = '+') {
      const input = document.querySelector('input[name=' + modelKey + ']');

      let step = 1;
      let value = this.rangeField[modelKey];
      let toFixedCount = 2;
      if (!this.rangeField.hasOwnProperty(modelKey) || input === null) {
        return;
      }

      if (input.step.length !== 0) {
        step = input.step;
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

      if (value) {
        this.rangeField[modelKey] = value;
      }
    },

    parseNumFields() {
      this.numFields.forEach((modelKey) => {
        /** remove dot if ends on it, and if just dot in value **/
        if (
          this.rangeField[modelKey].lastIndexOf('.') ===
          this.rangeField[modelKey].length - 1
        ) {
          this.rangeField[modelKey] = this.rangeField[modelKey].substring(
            0,
            this.rangeField[modelKey].length - 1
          );
        }
      });
    },

    save(rangeField, id, index, alias) {
      this.parseNumFields();

      let valid = this.validate();
      if (!valid) {
        return;
      }

      this.$emit('save', rangeField, id, index, alias);
    },

    validate() {
      let valid = true;
      this.errorsCount = 0;

      // Check for required fields
      const keys = ['step', 'minValue', 'maxValue'];
      for (const key of keys) {
        if (
          typeof this.rangeField[key] !== 'undefined' &&
          this.rangeField[key].toString().length === 0
        ) {
          valid = false;
          this.errorsCount++;
          this.errors[key] = this.translations.required_field;
        }
      }

      if (
        this.rangeField.minValue &&
        this.rangeField.maxValue &&
        parseFloat(this.rangeField.minValue) >
          parseFloat(this.rangeField.maxValue)
      ) {
        valid = false;
        this.errorsCount++;
        this.errors.maxValue = this.translations.min_higher_max;
      }

      /** check 'default' is in min/max range */
      if (
        this.rangeField.default &&
        (this.rangeField.minValue || this.rangeField.maxValue)
      ) {
        if (
          this.rangeField.minValue &&
          this.rangeField.maxValue &&
          (parseFloat(this.rangeField.default) >
            parseFloat(this.rangeField.maxValue) ||
            parseFloat(this.rangeField.default) <
              parseFloat(this.rangeField.minValue))
        ) {
          valid = false;
          this.errorsCount++;
          this.errors.default = this.translations.must_be_between;
        } else if (
          this.rangeField.minValue &&
          parseFloat(this.rangeField.default) <
            parseFloat(this.rangeField.minValue)
        ) {
          valid = false;
          this.errorsCount++;
          this.errors.default = this.translations.must_be_greater_min;
        } else if (
          this.rangeField.maxValue &&
          parseFloat(this.rangeField.default) >
            parseFloat(this.rangeField.maxValue)
        ) {
          valid = false;
          this.errorsCount++;
          this.errors.default = this.translations.must_be_less_max;
        }
      }
      return valid;
    },

    resetValue: function () {
      return {
        step: 1,
        unit: 1,
        sign: '',
        label: '',
        _id: null,
        default: '',
        minValue: 0,
        maxValue: 100,
        description: '',
        _event: 'change',
        additionalCss: '',
        allowRound: false,
        multiply: false,
        unitPosition: 'right',
        unitSymbol: '',
        _tag: 'cost-range',
        additionalStyles: '',
        addToSummary: true,
        allowCurrency: false,
        type: 'Range Button',
        icon: 'ccb-icon-Union-5',
        alias: 'range_field_id_',
        desc_option: 'after',
      };
    },
  },
  watch: {
    rangeField: {
      handler: function (value) {
        /** clean all errors **/
        Object.keys(this.errors).forEach((key) => {
          this.errors[key] = false;
        });

        this.validate();

        this.numFields.forEach((modelKey) => {
          if (!value.hasOwnProperty(modelKey) || value[modelKey].length <= 0) {
            return;
          }
          this.rangeField[modelKey] = this.stringValueAsNum(value[modelKey]);
        });

        if (!value.unit) {
          value.unit = 1;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
