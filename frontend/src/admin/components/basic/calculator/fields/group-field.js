import availableMixin from './formula/available.mixin';
import fieldMixin from './mixins/field-mixin';

export default {
  mixins: [availableMixin, fieldMixin],
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
    openFormula: false,
    available: [],
    groupField: {},
    available_fields: [],
    errorsCount: 0,
    errorMessage: [],
    costCalcLetterFormula: '',
    alias: '',
  }),

  mounted() {
    this.field = this.field.hasOwnProperty('_id') ? this.field : {};
    this.groupField = { ...this.resetValue(), ...this.field };

    if (this.groupField._id === null) {
      this.groupField._id = this.order;
      this.groupField.alias = this.groupField.alias + this.groupField._id;
    }

    this.alias = this.groupField.alias;
  },

  methods: {
    resetValue() {
      return {
        label: 'Group',
        _id: null,
        _event: '',
        type: 'Group',
        _tag: 'cost-group',
        icon: 'ccb-icon-group-element',
        alias: 'group_field_id_',
        collapsible: true,
        hidden: false,
        showTitle: true,
        groupElements: [],
        nextTickCount: 0,
        hasNextTick: true,
      };
    },

    save() {
      this.saveWithValidation(
        this.groupField,
        this.id,
        this.index,
        this.groupField.alias
      );
    },
  },
};
