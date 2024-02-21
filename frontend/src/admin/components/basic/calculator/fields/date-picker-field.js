import moment from 'moment-timezone';
import customDateCalendar from '../partials/custom-date-calendar';
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
    dateField: {},
    errors: {},
    tab: 'main',
    numFields: ['day_price', 'days_from_current'],
  }),
  components: {
    'custom-date-calendar': customDateCalendar,
  },
  computed: {
    getDescOptions() {
      return this.$store.getters.getDescOptions;
    },
    language() {
      return this.$store.getters.getLanguage;
    },
    weekdays() {
      moment.updateLocale(this.language, {
        week: {
          dow: 1,
        },
      });
      return moment.weekdaysShort(true);
    },
  },

  mounted() {
    this.field = this.field.hasOwnProperty('_id') ? this.field : {};
    this.dateField = { ...this.resetValue(), ...this.field };
    if (this.dateField._id === null) {
      this.dateField._id = this.order;
      this.dateField.alias = this.dateField.alias + this.dateField._id;
    }
  },

  methods: {
    numberCounterAction(modelKey, action = '+') {
      let input = document.querySelector('input[name=' + modelKey + ']');
      let step = 1;
      let toFixedCount = 2;

      if (!this.dateField.hasOwnProperty(modelKey) || input === null) {
        return;
      }
      if (input.step.length !== 0) {
        step = input.step;
      }

      let value = this.dateField[modelKey];

      if (!value) {
        value = action === '-' ? 1 : 0;
      }
      if (this.isFloat(value) && 'days_from_current' !== modelKey) {
        toFixedCount = value.split('.')[1].length;
        /** set step based on count of integers after dot **/
        step = Math.pow(0.1, toFixedCount).toFixed(toFixedCount);
      }

      value =
        action === '-'
          ? parseFloat(value) - parseFloat(step)
          : parseFloat(value) + parseFloat(step);

      if (isNaN(value)) {
        value = 0;
      }
      if (input.min.length !== 0 && value < input.min) {
        return;
      }

      value =
        parseInt(step) === parseFloat(step)
          ? value.toFixed()
          : value.toFixed(toFixedCount);

      this.dateField[modelKey] = value;
    },

    validate() {
      delete this.errors.days_from_current;
      const days = this.dateField.days_from_current;
      if (
        this.dateField.days_from_current !== null &&
        ((this.dateField.days_from_current && parseInt(days, 10) < 0) ||
          isNaN(parseInt(days, 10)))
      ) {
        this.errors.days_from_current = true;
        this.$store.commit('setEditFieldError', true);
        return;
      }
    },

    setNotAllowedWeekDays(weekIndex) {
      let index = this.dateField.not_allowed_week_days.indexOf(weekIndex);
      if (index !== -1) {
        this.dateField.not_allowed_week_days.splice(index, 1);
      } else {
        this.dateField.not_allowed_week_days.push(weekIndex);
      }
    },

    setNotAllowedDates(value, key) {
      this.dateField.not_allowed_dates[key] = value;
    },

    resetValue() {
      return {
        _id: null,
        label: '',
        range: '0',
        description: '',
        placeholder: '',
        _event: 'click',
        type: 'Date Picker',
        _tag: 'date-picker',
        addToSummary: true,
        allowCurrency: false,
        additionalStyles: '',
        icon: 'ccb-icon-Path-3513',
        is_have_unselectable: false,
        not_allowed_week_days: [],
        not_allowed_dates: {
          period: { start: null, end: null },
          all_past: false,
          current: false,
          days_from_current: false,
        },
        days_from_current: 0,
        alias: 'datePicker_field_id_',
        day_price: 0,
        day_price_enabled: false,
        desc_option: 'after',
        calculate_unselectable_days: false,
      };
    },

    parseNumFields() {
      if (false === this.dateField.is_have_unselectable) {
        return;
      }

      this.numFields.forEach((modelKey) => {
        /** remove dot if ends on it, and if just dot in value **/
        if (
          this.dateField.hasOwnProperty(modelKey) &&
          this.dateField[modelKey].lastIndexOf('.') ===
            this.dateField[modelKey].length - 1
        ) {
          this.dateField[modelKey] = this.dateField[modelKey].substring(
            0,
            this.dateField[modelKey].length - 1
          );
        }
      });
    },

    saveField() {
      this.parseNumFields();
      this.validate();

      if (Object.keys(this.errors).length > 0) {
        return;
      }
      this.$emit(
        'save',
        this.dateField,
        this.id,
        this.index,
        this.dateField.alias
      );
    },

    toggleCalculateUnselectableDays() {
      this.dateField.calculate_unselectable_days =
        !this.dateField.calculate_unselectable_days;
    },
  },

  destroyed() {
    this.$store.commit('setEditFieldError', false);
  },

  watch: {
    '$store.getters.getEditFieldError': function (value) {
      if (value === 'save_field') {
        this.saveField();
      }
    },
    dateField: {
      handler: function (value) {
        /** clean all errors **/
        this.errors = {};
        this.validate();

        this.numFields.forEach((modelKey) => {
          if (!value.hasOwnProperty(modelKey) || value[modelKey].length <= 0) {
            return;
          }
          //** make days be ints */
          if (
            this.dateField.days_from_current &&
            'days_from_current' === modelKey
          ) {
            this.dateField[modelKey] = parseInt(value[modelKey]).toString();
          } else {
            this.dateField[modelKey] = this.stringValueAsNum(value[modelKey]);
          }
        });
      },
      deep: true,
      immediate: true,
    },
  },
};
