export default {
  props: {
    element: {
      type: Object,
      default: {},
    },
    name: '',
  },

  data: () => ({
    options: {},
    showLabel: false,
    value: null,
  }),

  created() {
    this.setData();
  },

  methods: {
    setData() {
      this.value = this.element.value;

      if (this.isObjectHasPath(this.element, ['data', 'options']))
        this.options = this.element.data.options;

      if (this.element.hasOwnProperty('showLabel'))
        this.showLabel = this.element.showLabel;
    },

    updateField: function () {
      this.element.value = this.value;
      this.$emit('change');
    },
  },

  computed: {
    getStyle() {
      if (this.element.name === 'total_field_font_weight') {
        return {
          padding: '5px 15px 5px 5px !important',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        };
      }

      return {};
    },
  },

  template: `
        <div class="ccb-select-box">
            <div class="ccb-select-wrapper">
                <i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
                <select class="ccb-select" v-model="value" @change="updateField" :style="getStyle">
                    <option v-for="(option, option_key) in options" :key="option_key" :value="option_key">
                        {{ option }}
                    </option>
                </select>
            </div>
        </div>
        `,
};
