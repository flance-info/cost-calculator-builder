import formulaField from './formula/formula-field';
import formulaView from './formula/formula-view';
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
    repeaterField: {},
    available_fields: [],
    errorsCount: 0,
    errorMessage: [],
    costCalcLetterFormula: '',
    alias: '',
  }),

  components: {
    'formula-field': formulaField,
    'formula-view': formulaView,
  },

  mounted() {
    this.field = this.field.hasOwnProperty('_id') ? this.field : {};
    this.repeaterField = { ...this.resetValue(), ...this.field };

    if (this.repeaterField._id === null) {
      this.repeaterField._id = this.order;
      this.repeaterField.alias =
        this.repeaterField.alias + this.repeaterField._id;

      if (this.$store.getters.getQuickTourStep === 'done') {
        this.save();
      }
    }

    this.alias = this.repeaterField.alias;

    this.available_fields = this.prepareAvailable(
      this.repeaterField.groupElements
    );
    this.change(this.repeaterField.costCalcFormula);
    this.openFormula = true;
  },

  methods: {
    repeatMinValue(event) {
      let keyCode = event.keyCode ? event.keyCode : event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault();
      }
    },

    toggleHandler(key) {
      if (key === 'sumAllAvailable' && this.repeaterField[key]) {
        this.repeaterField.enableFormula = false;
      }

      if (key === 'enableFormula' && this.repeaterField[key]) {
        this.repeaterField.sumAllAvailable = false;
      }
    },

    change(value) {
      value = value || '';
      this.costCalcLetterFormula = value;
    },

    save() {
      let requiredField = this.repeaterField.groupElements.find(
        (f) => f.required
      );

      if (requiredField) this.repeaterField.required = true;

      this.saveWithValidation(
        this.repeaterField,
        this.id,
        this.index,
        this.repeaterField.alias
      );
    },

    setErrors(errors) {
      this.errorMessage = errors;
    },

    numberCounterAction(modelKey, action = '+') {
      let input = document.querySelector('input[name=' + modelKey + ']');
      let step = 1;
      let toFixedCount = 2;

      if (!this.repeaterField.hasOwnProperty(modelKey) || input === null) {
        return;
      }

      if (input.step.length !== 0) {
        step = input.step;
      }

      let value = this.repeaterField[modelKey];

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

      if (value) {
        this.repeaterField[modelKey] = value;
      }
    },

    resetValue() {
      return {
        label: 'Repeater',
        addButtonLabel: 'Add another',
        removeButtonLabel: 'Remove',
        _id: null,
        _event: '',
        type: 'Repeater',
        _tag: 'cost-repeater',
        repeatCount: '3',
        icon: 'ccb-icon-Path-3517',
        alias: 'repeater_field_id_',
        letter: '',
        formulaView: false,
        enableFormula: false,
        costCalcFormula: '',
        groupElements: [],
        required: false,
        nextTickCount: 0,
        hasNextTick: true,
        sumAllAvailable: true,
      };
    },
  },

  watch: {
    repeaterField: {
      handler(value) {
        if (!value.repeatCount) {
          value.repeatCount = 1;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
