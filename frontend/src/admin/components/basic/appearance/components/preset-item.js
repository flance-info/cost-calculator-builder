export default {
  props: ['preset', 'is_selected'],

  data: () => ({
    edit_title: false,
    preset_title: '',
    keys: ['default', 'orange', 'sky', 'black', 'dark_blue'],
  }),

  mounted() {
    this.preset_title = this.preset.title;

    document.addEventListener('click', (e) => {
      const $target = e.target;
      if (
        !$target.classList.contains('ccb-preset-title-input') &&
        this.edit_title
      ) {
        this.edit_title = false;
        this.updateValue();
      }

      if (
        $target.classList.contains('ccb-preset-title') &&
        $target.classList.contains(this.preset.key) &&
        !this.keys.includes(this.preset.key)
      ) {
        this.edit_title = true;
      }
    });
  },

  methods: {
    selected(key) {
      this.$emit('selected', key);
    },

    focusOut() {
      this.edit_title = false;
      this.updateValue();
    },

    updateValue() {
      if (this.preset_title && this.preset.title !== this.preset_title) {
        this.$emit('title-change', this.preset_title);
      }
    },

    editable() {
      if (this.keys.includes(this.preset.key)) return;

      this.edit_title = true;
      if (this.$refs[this.preset.key]) {
        setTimeout(() => {
          this.$refs[this.preset.key].focus();
        });
      }
    },
  },

  computed: {
    appearance() {
      return this.$store.getters.getAppearance;
    },

    getTitleClass() {
      return `${this.preset.key}`;
    },
  },

  filters: {
    'to-short': (value) => {
      if (value.length >= 12) {
        return value.substring(0, 9) + '...';
      }
      return value;
    },
  },

  template: `
        <div class="ccb-appearance-presets-item-wrapper" :class="{'ccb-preset-selected': is_selected}" v-if="preset" @click="() => selected(preset.key)">
            <div class="ccb-appearance-presets-item">
                <img :src="preset.image[preset?.box_style]" alt="theme">
            </div>
            <div class="ccb-appearance-presets-item-label">
                <span class="ccb-options-tooltip ccb-preset-title" v-show="!edit_title || !is_selected">
                    <span class="ccb-default-title ccb-preset-title" :class="getTitleClass" @click="editable">{{ preset.title | to-short }}</span>
                    <span class="ccb-options-tooltip__text">{{ preset.title }}</span>
                </span>
                <input type="text" class="ccb-preset-title-input" v-model="preset_title" @keyup.enter="focusOut" @focusout="focusOut" :ref="preset.key" v-show="edit_title && is_selected">
            </div>
        </div>
    
    `,
};
