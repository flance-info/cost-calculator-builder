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
    groupField: null,
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

    additionalCss() {
      return this.$store.getters.getCalcStore.hasOwnProperty(
        this.groupField.alias
      ) &&
        this.$store.getters.getCalcStore[this.groupField.alias].hidden === true
        ? { display: 'none' }
        : {};
    },
  },

  created() {
    this.groupField = this.parseComponentData();
    if (this.groupField.groupElements?.length) {
      this.setGroupedElements();
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
        this.groupField.alias,
        undefined,
        this.localCalcStore
      );
    },

    setGroupedElements() {
      this.defaultGroupedElements = this.clone(this.groupField.groupElements);
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
      if (this.groupField.collapsible) {
        if (typeof this.collapsedIdx[idx] === 'undefined') {
          this.collapsedIdx[idx] = false;
        }

        this.collapsedIdx[idx] = !this.collapsedIdx[idx];

        $(`.ccb-group-field[data-index="${idx}"] span`)?.toggleClass(
          'ccb-collapsed'
        );

        $(`.calc-group-fields[data-index="${idx}"]`)?.fadeToggle();
      }
    },

    customFadeOut(idx) {
      $(`.ccb-group-field[data-index="${idx}"] span`)?.addClass(
        'ccb-collapsed'
      );

      $(`.calc-group-fields[data-index="${idx}"]`)?.fadeOut();
    },

    customFadeIn(idx) {
      $(`.ccb-group-field[data-index="${idx}"] span`)?.removeClass(
        'ccb-collapsed'
      );

      $(`.calc-group-fields[data-index="${idx}"]`)?.fadeIn();
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
