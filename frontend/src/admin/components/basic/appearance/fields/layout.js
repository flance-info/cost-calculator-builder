export default {
  props: {
    element: {
      type: Object,
      default: {},
    },
    name: '',
    preset_key: '',
  },

  data: () => ({
    value: '',
    ready: false,
    options: [],
    show_two_columns: false,
  }),

  created() {
    this.setData();
  },

  computed: {
    presets: {
      get() {
        return this.$store.getters.getPresets;
      },

      set(value) {
        this.$store.commit('setPresets', value);
      },
    },
  },

  methods: {
    setData() {
      this.options = this.element.data.options;
      this.value = this.element.value;
      this.maybeScroll(false);
      this.ready = true;
    },

    clone(data) {
      if (data) {
        return JSON.parse(JSON.stringify(data));
      }
      return data;
    },

    setKey(key) {
      this.value = key;
      this.element.value = key;
      let presets = this.clone(this.presets);
      presets = presets.map((p) => {
        if (p.key === this.preset_key) {
          p.box_style = key;
        }
        return p;
      });

      this.presets = presets;
      this.$emit('change');
    },

    maybeScroll(value) {
      if (typeof value !== 'undefined') {
        this.show_two_columns = this.value === 'two_column';
      } else {
        this.show_two_columns = !this.show_two_columns;
      }
    },
  },

  template: `
        <div class="ccb-layout-field">
          <div class="ccb-layout-field__container">
            <div class="ccb-layout-field__wrapper" :class="{'show_two_columns': show_two_columns}">
              <div class="ccb-layout-item" :class="{'ccb-layout-selected': value === key}" v-for="(option, key) in options" @click="() => setKey(key)">
                <i class="ccb-layout-item-icon" :class="option.icon"></i>
                <span class="ccb-layout-item-text">{{ option.label }}</span>
              </div>
            </div>
          </div>
          <span class="ccb-layout-field__arrow" :class="{'show_two_columns': show_two_columns}" @click="() => maybeScroll()">
              <i class="ccb-icon-Path-3485"></i>
          </span>
        </div>
    `,
};
