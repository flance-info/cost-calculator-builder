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
    timeField: {},
    errors: {},
    tab: 'main',
    errorsCount: 0,
  }),

  computed: {
    getDescOptions() {
      return this.$store.getters.getDescOptions;
    },

    isInvalidInput() {
      const interval = this.timeField.min_interval;
      if (interval === '') return false;
      const converted = this.convertTimeToMinutes(interval);
      this.timeField.min_interval_minutes = converted;
      return !converted;
    },
  },

  mounted() {
    this.field = this.field.hasOwnProperty('_id') ? this.field : {};
    this.timeField = { ...this.resetValue(), ...this.field };
    if (this.timeField._id === null) {
      this.timeField._id = this.order;
      this.timeField.alias = this.timeField.alias + this.timeField._id;
    }
  },

  methods: {
    numberCounterAction(modelKey, action = '+') {
      let input = document.querySelector('input[name=' + modelKey + ']');
      let step = 1;
      if (!this.timeField.hasOwnProperty(modelKey) || input === null) {
        return;
      }
      if (input.step.length !== 0) {
        step = input.step;
      }

      let value = this.timeField[modelKey];
      if (action === '-') {
        value = parseFloat(value) - parseFloat(input.step);
      } else {
        value = parseFloat(value) + parseFloat(input.step);
      }

      if (+input.min.length !== 0 && value < input.min) {
        return;
      }
      if (parseInt(step) === parseFloat(step)) {
        value = value.toFixed();
      } else {
        value = value.toFixed(2);
      }

      this.timeField[modelKey] = value;
    },

    resetValue() {
      return {
        _id: null,
        label: '',
        range: '0',
        description: '',
        placeholderHours: '',
        placeholderTime: '',
        format: false,
        _event: 'click',
        type: 'Time Picker',
        _tag: 'time-picker',
        addToSummary: true,
        additionalStyles: '',
        icon: 'ccb-icon-Path-3513',
        alias: 'timePicker_field_id_',
        desc_option: 'after',
        min_interval: '1h',
        min_interval_minutes: 60,
        use_interval: false,
      };
    },

    saveField() {
      const interval = this.timeField.min_interval;
      if (!interval?.trim()) {
        this.timeField.min_interval = '1h';
      }

      if (Object.keys(this.errors).length > 0 || this.isInvalidInput) {
        return;
      }
      this.$emit(
        'save',
        this.timeField,
        this.id,
        this.index,
        this.timeField.alias
      );
    },

    convertTimeToMinutes(timeString) {
      const match = timeString.match(
        /^(\d+(\.\d+)?)\s*([hm])\s*(\d+(\.\d+)?)?\s*([hm])?$/
      );

      if (match) {
        if (match[3] === 'm' && match[4]) {
          return false;
        }

        let hours = parseFloat(match[1]);
        let minutes = parseFloat(match[4]);

        if ((isNaN(hours) && isNaN(minutes)) || match[6] === 'h') {
          return false;
        }

        let totalMinutes = 0;

        if (match[3] === 'h') {
          totalMinutes += Math.round(hours * 60);
        }

        if (!isNaN(minutes) || match[3] === 'm') {
          if (!isNaN(minutes) && match[6] !== 'm') {
            return false;
          }

          const roundedMinutes = Math.round(minutes);
          if (minutes > 10 && match[6] === 'm' && roundedMinutes % 5 !== 0) {
            return false;
          }

          if (match[3] === 'm') {
            const m = minutes || hours || 0;
            if (m > 10 && Math.round(m) % 5 !== 0) return false;
            return hours;
          } else {
            totalMinutes += roundedMinutes;
          }
        }

        return totalMinutes;
      }

      return false;
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
  },
};
