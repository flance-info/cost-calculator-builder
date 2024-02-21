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
    errors: {
      unit: false,
      step: false,
      maxValue: false,
      minValue: false,
      default_left: false,
      default_right: false,
    },
    multiRangeField: {},
    tab: 'main',
    numFields: [
      'default_left',
      'default_right',
      'minValue',
      'maxValue',
      'step',
      'unit',
    ],
    errorsCount: 0,
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
    this.multiRangeField = { ...this.resetValue(), ...this.field };
    if (this.multiRangeField._id === null) {
      this.multiRangeField._id = this.order;
      this.multiRangeField.alias =
        this.multiRangeField.alias + this.multiRangeField._id;
    }
  },

  methods: {
    fixErrorByKey(key) {
      const value = this.stringValueAsNum(this.multiRangeField[key].toString());
      if (this.errors[key] !== false && value) {
        this.errors[key] = false;
        if (this.errorsCount) this.errorsCount--;
      }
    },

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
      let value = this.multiRangeField[modelKey];
      let toFixedCount = 2;

      if (!this.multiRangeField.hasOwnProperty(modelKey) || input === null) {
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
        this.multiRangeField[modelKey] = value;
      }
    },

    parseNumFields() {
      this.numFields.forEach((modelKey) => {
        /** remove dot if ends on it, and if just dot in value **/
        if (
          this.multiRangeField[modelKey].lastIndexOf('.') ===
          this.multiRangeField[modelKey].length - 1
        ) {
          this.multiRangeField[modelKey] = this.multiRangeField[
            modelKey
          ].substring(0, this.multiRangeField[modelKey].length - 1);
        }
      });
    },

    save(multiRangeField, id, index, alias) {
      this.parseNumFields();

      let valid = this.validate();
      if (!valid) {
        return;
      }

      this.$emit('save', multiRangeField, id, index, alias);
    },

    validate() {
      let valid = true;
      this.errorsCount = 0;

      // Check for required fields
      const keys = [
        'step',
        'minValue',
        'maxValue',
        'default_left',
        'default_right',
      ];

      for (const key of keys) {
        if (
          typeof this.multiRangeField[key] !== 'undefined' &&
          this.multiRangeField[key].toString().length === 0
        ) {
          valid = false;
          this.errorsCount++;
          this.errors[key] = this.translations.required_field;
        }
      }

      if (
        this.multiRangeField.minValue &&
        this.multiRangeField.maxValue &&
        parseFloat(this.multiRangeField.minValue) >
          parseFloat(this.multiRangeField.maxValue)
      ) {
        valid = false;
        this.errorsCount++;
        this.errors.maxValue = this.translations.min_higher_max;
      }

      /** check 'defaults' is in min/max range */
      if (
        this.multiRangeField.default_left &&
        this.multiRangeField.default_right &&
        (this.multiRangeField.minValue || this.multiRangeField.maxValue)
      ) {
        const right = this.multiRangeField.default_right;
        const left = this.multiRangeField.default_left;
        const min = this.multiRangeField.minValue;
        const max = this.multiRangeField.maxValue;
        const errorMsg = this.translations.must_be_between;

        if (min && max) {
          if (
            parseFloat(right) > parseFloat(max) ||
            parseFloat(right) < parseFloat(min)
          ) {
            valid = false;
            this.errorsCount++;
            this.errors.default_right = errorMsg;
          }

          if (
            parseFloat(left) > parseFloat(max) ||
            parseFloat(left) < parseFloat(min)
          ) {
            valid = false;
            this.errorsCount++;
            this.errors.default_left = errorMsg;
          }
        } else if (min) {
          if (parseFloat(right) < parseFloat(min)) {
            valid = false;
            this.errorsCount++;
            this.errors.default_right = errorMsg;
          }

          if (parseFloat(left) < parseFloat(min)) {
            valid = false;
            this.errorsCount++;
            this.errors.default_left = errorMsg;
          }
        } else if (max) {
          if (parseFloat(right) > parseFloat(max)) {
            valid = false;
            this.errorsCount++;
            this.errors.default_right = errorMsg;
          }

          if (parseFloat(left) > parseFloat(max)) {
            valid = false;
            this.errorsCount++;
            this.errors.default_left = errorMsg;
          }
        }
      }
      return valid;
    },

    resetValue: function () {
      return {
        step: 1,
        unit: 1,
        label: '',
        _id: null,
        minValue: 0,
        maxValue: 100,
        description: '',
        _event: 'change',
        default_left: 0,
        default_right: 50,
        additionalCss: '',
        addToSummary: true,
        allowRound: false,
        multiply: false,
        unitPosition: 'right',
        unitSymbol: '',
        type: 'Multi Range',
        additionalStyles: '',
        allowCurrency: false,
        _tag: 'cost-multi-range',
        icon: 'ccb-icon-Union-6',
        alias: 'multi_range_field_id_',
        desc_option: 'after',
      };
    },
  },
  watch: {
    multiRangeField: {
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
          this.multiRangeField[modelKey] = this.stringValueAsNum(
            value[modelKey]
          );
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
