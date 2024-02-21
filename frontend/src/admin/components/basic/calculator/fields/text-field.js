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
    textField: {},
    tab: 'main',
  }),

  computed: {
    getDescOptions() {
      return this.$store.getters.getDescOptions;
    },
  },

  mounted() {
    this.field = this.field.hasOwnProperty('_id') ? this.field : {};
    this.textField = { ...this.resetValue(), ...this.field };
    if (this.textField._id === null) {
      this.textField._id = this.order;
      this.textField.alias = this.textField.alias + this.textField._id;
    }
  },

  methods: {
    resetValue() {
      return {
        label: '',
        _event: '',
        _id: null,
        description: '',
        placeholder: '',
        _tag: 'cost-text',
        type: 'Text Area',
        additionalCss: '',
        additionalStyles: '',
        icon: 'ccb-icon-Subtraction-7',
        desc_option: 'after',
        alias: 'text_field_id_',
      };
    },
    numberCounterAction(modelKey, action = '+') {
      let input = document.querySelector('input[name=' + modelKey + ']');
      let step = 1;
      let value = this.textField[modelKey];

      if (!this.textField.hasOwnProperty(modelKey) || input === null) {
        return;
      }

      value =
        action === '-'
          ? parseInt(value) - parseInt(step)
          : parseInt(value) + parseInt(step);

      if (input.min.length !== 0 && value < input.min) {
        return;
      }

      value = value.toFixed();

      this.textField[modelKey] = value;
    },
  },
  watch: {
    'textField.numberOfCharacters': function (value) {
      let newValue = value.toString();
      newValue = newValue.replace(/[^\d\.]/g, '').replace(/\./g, '');
      this.textField.numberOfCharacters = newValue;
    },
  },
};
