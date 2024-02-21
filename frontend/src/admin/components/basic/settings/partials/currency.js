import settingsMixin from './settingsMixin';

export default {
  mixins: [settingsMixin],
  data: () => ({
    extended: false,
  }),

  mounted() {
    if (this.generalSettings?.currency.use_in_all) this.extended = true;
  },

  methods: {
    numberCounterAction(optionIndex, action = '+') {
      let input = document.querySelector(
        'input[name=option_' + optionIndex + ']'
      );
      let step = 1;
      let value = 0;
      let toFixedCount = 2;

      if (
        !this.settingsField.currency.hasOwnProperty(optionIndex) ||
        input === null
      ) {
        return;
      }

      if (input.step.length !== 0) {
        step = input.step;
      }

      if (this.settingsField.currency[optionIndex] > 0) {
        value = this.settingsField.currency[optionIndex];
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

      this.settingsField.currency[optionIndex] = value;
    },
  },

  watch: {
    'settingsField.currency.num_after_integer': function (newValue, oldValue) {
      if (!newValue) {
        this.settingsField.currency.num_after_integer = 1;
      }

      if (newValue < 0 || newValue > 8) {
        this.settingsField.currency.num_after_integer = oldValue;
      }
    },
  },
};
