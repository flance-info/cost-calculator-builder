import { mapGetters } from '@libs/vue/vuex';
import fieldsMixin from './fieldsMixin';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

export default {
  mixins: [fieldsMixin],
  props: {
    id: {
      default: null,
    },
    value: {
      default: 0,
      type: [Number, String],
    },
    index: [Number],
    field: [Object, String],
  },

  data: () => ({
    min: 0,
    step: 1,
    max: 100,
    leftVal: 0,
    rightVal: 0,
    rangeSlider: {},
    multiRange: null,
    multiRangeValue: 0,
    storedValues: null,
  }),

  created() {
    this.multiRange = this.parseComponentData();
    if (this.multiRange.alias) {
      this.min = this.multiRange.minValue;
      this.max = this.multiRange.maxValue;
      this.step = this.multiRange.step;

      this.leftVal =
        this.min >= +this.multiRange.default_left
          ? this.min
          : this.max < +this.multiRange.default_left
          ? this.min
          : +this.multiRange.default_left;

      this.rightVal =
        +this.multiRange.default_right > this.max
          ? this.max
          : this.min > +this.multiRange.default_right
          ? this.max
          : +this.multiRange.default_right;
    }
  },

  mounted() {
    this.change();
  },

  computed: {
    additionalCss() {
      return this.$store.getters.getCalcStore.hasOwnProperty(
        this.field.alias
      ) && this.$store.getters.getCalcStore[this.field.alias].hidden === true
        ? 'display: none;'
        : '';
    },

    ...mapGetters(['getSettings']),

    getFormatedValue() {
      let val = `${this.leftVal} - ${this.rightVal}`;
      if (this.multiRange.allowCurrency && !this.multiRange.multiply) {
        return this.formatByCurrency(val);
      } else {
        return this.multiRange.unitPosition === 'right'
          ? `${val} ${this.multiRange.sign ?? ''}`
          : `${this.multiRange.sign ?? ''} ${val}`;
      }
    },

    getStyles() {
      return {
        '--min': +this.min,
        '--max': +this.max,
        '--step': +this.step,
        '--value-a': this.leftVal,
        '--value-b': this.rightVal,
        '--text-value-a': `'${this.leftVal} '`,
        '--text-value-b': `'${this.rightVal} '`,
        '--suffix': `''`,
        '--primary-color': this.getAccentColor,
      };
    },
  },

  watch: {
    value(val) {
      if (+val !== 0 && typeof val !== 'object') {
        this.rangeSlider.value = [this.leftVal, this.rightVal];
        this.change();
        return;
      }

      if (
        val.hasOwnProperty('start') &&
        val.hasOwnProperty('end') &&
        (+val.start !== +this.leftVal || +val.end !== +this.rightVal)
      ) {
        this.leftVal = this.initValue(val.start, this.min);
        this.rightVal = this.initValue(+val.end, this.max, true);
        this.rangeSlider.value = [this.leftVal, this.rightVal];
        this.change();
      }
      if (+val === 0) {
        this.leftVal = 0;
        this.rightVal = 0;
        this.rangeSlider.value = [this.leftVal, this.rightVal];
        this.change();
      }
    },

    leftVal(val) {
      if (+val > this.rightVal) this.leftVal = this.rightVal;
    },

    rightVal(val) {
      if (+val < this.leftVal) this.rightVal = this.leftVal;
    },
  },
  methods: {
    formatByCurrency(val) {
      let currencyPosition = this.getSettings.currency.currencyPosition;
      let currency = this.getSettings.currency.currency;
      let result = '';
      if (currencyPosition === 'left') {
        result = currency + val;
      }

      if (currencyPosition === 'right') {
        result = val + currency;
      }

      if (currencyPosition === 'left_with_space') {
        result = currency + ' ' + val;
      }

      if (currencyPosition === 'right_with_space') {
        result = val + ' ' + currency;
      }

      return result;
    },

    rtlClass(siteLang) {
      let rtlLangs = ['ar', 'ary', 'azb', 'fa_AF', 'skr', 'ur'];

      return rtlLangs.includes(siteLang);
    },

    initValue(value, secondVal, isMax) {
      let defaultVal = value ? value : 0;
      if (isMax) return defaultVal > secondVal ? secondVal : defaultVal;
      return defaultVal < secondVal ? secondVal : defaultVal;
    },

    change() {
      if (!this.storedValues || +this.rightVal >= +this.leftVal) {
        this.storedValues = {
          right: +this.rightVal,
          left: +this.leftVal,
        };
      }

      const value = {
        value:
          +this.rightVal > +this.leftVal ? +this.rightVal - +this.leftVal : 0,
        start:
          +this.rightVal > +this.leftVal
            ? +this.leftVal
            : this.storedValues.left,
        end:
          +this.rightVal === +this.leftVal
            ? +this.leftVal
            : this.storedValues.right,
      };

      this.$emit(
        this.multiRange._event,
        value,
        this.multiRange.alias,
        undefined,
        this.index
      );
      this.$emit('condition-apply', this.multiRange.alias);
    },
  },
};
