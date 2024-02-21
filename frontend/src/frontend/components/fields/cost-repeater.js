import $ from 'jquery';
import fieldsMixin from './fieldsMixin';
import globalFieldsMixin from '../../../mixins/fields.mixin';

export default {
  mixins: [fieldsMixin, globalFieldsMixin],
  props: {
    id: {
      default: null,
    },
    value: {
      default: 0,
      type: [Number, String],
    },

    field: [Object, String],
    key: [Object, String, Number],
    fields: {
      default: null,
    },
  },

  data: () => ({
    $calc: null,
    repeaterField: null,
    showRepeater: false,

    groupedElements: [],
    groupedFields: [],
    defaultGroupedElements: null,
    defaultGroupedFields: null,
    localCalcStore: [],
    updateKey: 0,

    collapsedIdx: {},
  }),

  computed: {
    isPro() {
      let parsedURL = new URL(window.location.href);

      let domain = parsedURL.hostname;

      return domain === 'stylemixthemes.com';
    },

    translations() {
      return this.$store.getters.getTranslations;
    },

    repeaterValue() {
      let repeaterValue = 0;

      if (this.repeaterField.sumAllAvailable) {
        const ignoreFields = ['html', 'text', 'line'];
        for (const f of this.localCalcStore) {
          repeaterValue += Object.values(f)
            .filter((inner) => {
              let fieldName = inner.alias.replace(/\_field_id.*/, '');
              if (fieldName === 'datePicker' && !inner.day_price) return false;
              return !ignoreFields.includes(fieldName);
            })
            .map((inner) => +inner.value)
            .filter((inner) => !Number.isNaN(inner))
            .reduce((partialSum, a) => partialSum + a, 0);
        }
        return repeaterValue;
      }

      for (const f of this.localCalcStore) {
        let formula = this.repeaterField.costCalcFormula;
        const fields = Object.values(f);
        for (const field of fields) {
          let replacer = new RegExp('\\b' + field.alias + '\\b', 'g');
          formula = formula.replace(replacer, field.value);
        }
        repeaterValue += eval(formula);
      }

      return repeaterValue;
    },

    getLimit() {
      return +this.repeaterField.repeatCount;
    },

    additionalCss() {
      return this.$store.getters.getCalcStore.hasOwnProperty(
        this.repeaterField.alias
      ) &&
        this.$store.getters.getCalcStore[this.repeaterField.alias].hidden ===
          true
        ? { display: 'none' }
        : {};
    },

    getDefaultGroupedElements() {
      return this.defaultGroupedElements;
    },
  },

  created() {
    this.repeaterField = this.parseComponentData();
    if (this.repeaterField.groupElements?.length) {
      this.setGroupedFields();
      this.setGroupedElements();

      this.showRepeater = true;
    }
  },

  methods: {
    clone(data) {
      return JSON.parse(JSON.stringify(data));
    },

    cancelUpdate(alias) {
      let fieldName = alias.replace(/\_field_id.*/, '');
      const fields = ['range', 'checkbox', 'checkbox_with_img', 'toggle'];
      return fields.includes(fieldName);
    },

    addRepeater() {
      if (this.groupedElements.length <= this.getLimit) {
        this.groupedElements.push(this.clone(this.defaultGroupedElements));
        this.groupedFields.push(this.clone(this.defaultGroupedFields));
        this.collapsedIdx[this.groupedElements.length - 1] = false;
        this.$emit('add-repeater');
      }
    },

    removeRepeater(idx) {
      if (confirm('Are you sure to delete the repeated group of elements?')) {
        delete this.collapsedIdx[idx];

        this.groupedElements.splice(idx, 1);
        this.groupedFields.splice(idx, 1);

        const collapseValues = Object.values(this.collapsedIdx);
        const newCollapsed = {};

        this.groupedElements.forEach((field, index) => {
          newCollapsed[index] = collapseValues[index];
          if (newCollapsed[index]) {
            this.customFadeOut(index);
          }
        });

        this.collapsedIdx = newCollapsed;

        this.initFields();
        this.updateKey++;

        this.$emit(
          'change',
          this.repeaterValue,
          this.repeaterField.alias,
          undefined,
          this.localCalcStore
        );
        this.$emit('delete-repeater');
      }
    },

    rtlClass(siteLang) {
      let rtlLanguages = ['ar', 'ary', 'azb', 'fa_AF', 'skr', 'ur'];

      return rtlLanguages.includes(siteLang);
    },

    change(value, alias, label, index) {
      const fields = this.groupedFields[index];
      if (!fields || !fields[alias]) return;

      fields[alias]['checked'] = true;

      if (alias.includes('date')) {
        fields[alias].value = value.value;
        fields[alias].viewValue = value.viewValue;
      } else if (alias.includes('timePicker')) {
        fields[alias].value = value;
        fields[alias].viewValue = value;
      } else if (alias.includes('file_upload')) {
        fields[alias].value = value.price;
        fields[alias].files = value.files;
      } else {
        fields[alias].value = value;
        if (typeof label !== 'undefined') fields[alias].extraLabel = label;
      }

      this.initFields();

      this.$emit(
        'change',
        this.repeaterValue,
        this.repeaterField.alias,
        undefined,
        this.localCalcStore
      );
    },

    renderCondition() {},

    setGroupedFields() {
      const fields = {};
      this.defaultGroupedFields = {};

      for (const field of this.repeaterField.groupElements) {
        fields[field.alias] = this.initField(field);
      }

      this.defaultGroupedFields = this.clone(fields);
      this.groupedFields.push(this.clone(this.defaultGroupedFields));
    },

    setGroupedElements() {
      this.defaultGroupedElements = this.clone(
        this.repeaterField.groupElements
      );
      this.groupedElements.push(this.clone(this.defaultGroupedElements));
      this.collapsedIdx[this.groupedElements.length - 1] = false;
    },

    initFields() {
      this.localCalcStore = [];
      this.groupedFields.forEach((f, idx) => {
        const fields = Object.values(f);
        const calcStore = {};
        for (const field of fields) {
          const data = this.getFieldData(
            field,
            Object.values(this.groupedElements[idx])
          );
          calcStore[field.alias] = this.clone(data);
        }

        this.localCalcStore[idx] = calcStore;
      });
    },

    collapse(idx) {
      if (typeof this.collapsedIdx[idx] === 'undefined') {
        this.collapsedIdx[idx] = false;
      }

      this.collapsedIdx[idx] = !this.collapsedIdx[idx];

      $(`.ccb-repeater-field[data-index="${idx}"] span`)?.toggleClass(
        'ccb-collapsed'
      );

      $(`.calc-repeater-fields[data-index="${idx}"]`)?.fadeToggle();
    },

    customFadeOut(idx) {
      $(`.ccb-repeater-field[data-index="${idx}"] span`)?.addClass(
        'ccb-collapsed'
      );

      $(`.calc-repeater-fields[data-index="${idx}"]`)?.fadeOut();
    },

    customFadeIn(idx) {
      $(`.ccb-repeater-field[data-index="${idx}"] span`)?.removeClass(
        'ccb-collapsed'
      );

      $(`.calc-repeater-fields[data-index="${idx}"]`)?.fadeIn();
    },
  },

  filters: {
    'to-short': (value) => {
      if (value.length >= 30) {
        return value.substring(0, 27) + '...';
      }
      return value;
    },
  },
};
