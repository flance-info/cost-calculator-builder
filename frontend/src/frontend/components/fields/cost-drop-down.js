import fieldsMixin from './fieldsMixin';

export default {
  mixins: [fieldsMixin],
  props: {
    field: [Object, String],
    value: {
      default: '',
    },
    index: [Number],
  },
  data: () => ({
    dropDownField: {},
    openList: false,
  }),

  created() {
    this.dropDownField = this.parseComponentData();
    this.selectValue = this.value;
  },
  mounted() {
    this.initListeners();
  },
  methods: {
    openListHandler() {
      this.openList = !this.openList;
    },
    selectOption(element, toggle = true) {
      this.openList = toggle ? !this.openList : this.openList;
      if (element) {
        this.selectValue = element.value;
      } else {
        this.selectValue = +this.wooProductPrice || 0;
      }
    },
    initListeners() {
      window.removeEventListener('click', this.listenerHandler);
      window.addEventListener('click', this.listenerHandler);
    },
    listenerHandler(e) {
      const $target = e.target;
      if (!Array.from($target.classList).includes('calc-dd-toggle')) {
        this.openList = false;
      }
    },
  },

  watch: {
    value(val) {
      if (val && val.toString().indexOf('_') === -1) {
        Array.from(this.dropDownField.options).forEach((element, index) => {
          if (element.optionValue === val) {
            this.selectValue = val + '_' + index;
          }
        });
      } else if (val.length === 0) {
        this.selectValue = '0';
      } else {
        this.selectValue = val;
      }
    },
  },

  computed: {
    getEmptyValue() {
      return this.wooProductPrice || '';
    },

    additionalCss() {
      return this.$store.getters.getCalcStore.hasOwnProperty(
        this.dropDownField.alias
      ) &&
        this.$store.getters.getCalcStore[this.dropDownField.alias].hidden ===
          true
        ? 'display: none;'
        : '';
    },

    getLabel() {
      let result = this.getOptions.find((o) => o.value === this.selectValue);
      return result ? result.label : '';
    },

    getOptions() {
      let result = [];
      if (this.dropDownField.options) {
        result = Array.from(this.dropDownField.options).map(
          (element, index) => {
            const productValue = +this.wooProductPrice || 0;
            const optionValue = +element.optionValue + productValue;

            return {
              label: element.optionText,
              value: `${optionValue}_${index}`,
              converted: this.currencyFormat(
                this.dropDownField.allowRound
                  ? Math.round(element.optionValue) + productValue
                  : optionValue,
                { currency: true },
                this.currencySettings
              ),
            };
          }
        );
      }

      return result;
    },

    selectValue: {
      get() {
        return this.value;
      },

      set(value) {
        if (value === 0) {
          this.$emit(
            this.dropDownField._event,
            0,
            this.dropDownField.alias,
            '',
            this.index
          );
          this.$emit('condition-apply', this.dropDownField.alias);
        }

        const productValue = +this.wooProductPrice || 0;
        if (!value || value === productValue) {
          if (productValue) {
            setTimeout(() => {
              this.$emit(
                this.dropDownField._event,
                productValue,
                this.dropDownField.alias,
                '',
                this.index
              );
              this.$emit('condition-apply', this.dropDownField.alias);
            });
          }

          return;
        }

        let [, index] = value.split('_');
        let option = null;

        this.getOptions.forEach((element, key) => {
          if (!option && element.value === value && +index === key) {
            option = JSON.parse(JSON.stringify(element));
          }
        });

        setTimeout(() => {
          this.$emit(
            this.dropDownField._event,
            value,
            this.dropDownField.alias,
            option ? option.label : '',
            this.index
          );
          this.$emit('condition-apply', this.dropDownField.alias);
        });
      },
    },
  },

  filters: {
    'to-short-label': (value) => {
      const dynamicLength = window.innerWidth > 500 ? 32 : 29;
      if (value.length >= dynamicLength) {
        return value.substring(0, dynamicLength - 3) + '...';
      }
      return value;
    },
  },
};
