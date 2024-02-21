import formulaField from './formula/formula-field';
import formulaViewComponent from './formula/formula-view';
import availableMixin from './formula/available.mixin';
import fieldMixin from './mixins/field-mixin';

export default {
  mixins: [availableMixin, fieldMixin],
  props: {
    available: {
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

    field: {},
  },

  components: {
    'formula-field': formulaField,
    'formula-view': formulaViewComponent,
  },

  data: () => ({
    totalField: {},
    available_fields: [],
    tab: 'element',
    errorsCount: 0,
    costCalcLetterFormula: '',
    alias: '',
    open: false,
  }),

  mounted() {
    // eslint-disable-next-line no-prototype-builtins
    this.field = this.field.hasOwnProperty('_id') ? this.field : {};
    this.totalField = { ...this.resetValue(), ...this.field };

    if (this.totalField._id === null) {
      this.totalField._id = this.order;
      this.totalField.alias = this.totalField.alias + this.totalField._id;
    }

    this.alias = this.totalField.alias;

    this.totalField.icon = this.resetValue().icon;
    if (!this.totalField.default) this.totalField.default = '';

    const totalId = this.totalField.alias.replace(/[^0-9]/g, '');
    this.available_fields = this.prepareAvailable(this.available, totalId);

    this.change(this.totalField.costCalcFormula);
    this.open = true;
  },

  methods: {
    change(value) {
      this.costCalcLetterFormula = value;
    },

    changeLegacy(value) {
      this.totalField.legacyFormula = value;
    },

    save() {
      if (this.totalField.formulaView) {
        this.$emit(
          'save',
          this.totalField,
          this.id,
          this.index,
          this.totalField.alias
        );
      } else {
        this.saveWithValidation(
          this.totalField,
          this.id,
          this.index,
          this.totalField.alias
        );
      }
    },

    setErrors(errors) {
      this.errorMessage = errors;
    },

    resetValue() {
      return {
        _id: null,
        currency: '$',
        type: 'Total',
        additionalCss: '',
        _tag: 'cost-total',
        costCalcFormula: '',
        additionalStyles: '',
        alias: 'total_field_id_',
        icon: 'ccb-icon-Path-3516',
        label: '',
        totalSymbol: '',
        totalSymbolSign: '',
        formulaFieldView: false,
        letter: '',
        formulaView: false,
        legacyFormula: '',
      };
    },
  },
};
