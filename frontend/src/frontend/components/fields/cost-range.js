import $ from 'jquery';
import { mapGetters } from '@libs/vue/vuex';
import fieldsMixin from './fieldsMixin';

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
    rangeValue: 0,
    rangeField: null,
    min: 0,
    max: 100,
    step: 1,
    $calc: null,
  }),

  watch: {
    value(val) {
      const parsed = +val;
      this.rangeValue = parsed;
      this.change();
    },
    rangeValue(value) {
      if (value !== this.value) {
        this.rangeValue = this.value;
      }
    },
  },

  computed: {
    getStyles() {
      this.min = +this.min;
      this.max = +this.max;

      return {
        '--min': this.min,
        '--max': this.max,
        '--step': this.step,
        '--value': this.rangeValue,
        '--text-value': `'${this.rangeValue} '`,
        '--suffix': `''`,
        '--primary-color': this.getAccentColor,
      };
    },

    additionalCss() {
      return this.$store.getters.getCalcStore.hasOwnProperty(
        this.rangeField.alias
      ) &&
        this.$store.getters.getCalcStore[this.rangeField.alias].hidden === true
        ? 'display: none;'
        : '';
    },

    ...mapGetters(['getSettings']),

    getFormatedValue() {
      if (this.rangeField.allowCurrency && !this.rangeField.multiply) {
        return this.currencyFormat(
          this.rangeValue,
          { currency: true },
          { ...this.getSettings.currency }
        );
      } else {
        return this.rangeField.unitPosition === 'right'
          ? `${this.rangeValue} ${this.rangeField.sign}`
          : `${this.rangeField.sign} ${this.rangeValue}`;
      }
    },
  },

  mounted() {
    this.$calc = $(`*[data-calc-id="${this.id}"]`);
    this.change();
    this.getAccentColor;
  },

  created() {
    this.rangeField = this.parseComponentData();
    if (this.rangeField.alias) {
      if (this.rangeField.hidden !== true) {
        this.rangeValue = this.initValue();
      }

      this.min = this.rangeField.minValue;
      this.max = this.rangeField.maxValue;
      this.step = this.rangeField.step;
    }
  },

  methods: {
    rtlClass(siteLang) {
      let rtlLangs = ['ar', 'ary', 'azb', 'fa_AF', 'skr', 'ur'];

      return rtlLangs.includes(siteLang);
    },

    initValue() {
      let defaultVal = this.rangeField.default ? this.rangeField.default : 0;
      defaultVal =
        +defaultVal < +this.rangeField.minValue
          ? this.rangeField.minValue
          : defaultVal;
      return defaultVal;
    },

    change() {
      this.$emit(
        this.rangeField._event,
        +this.rangeValue,
        this.rangeField.alias,
        undefined,
        this.index
      );
      this.$emit('condition-apply', this.rangeField.alias);
    },
  },
};
