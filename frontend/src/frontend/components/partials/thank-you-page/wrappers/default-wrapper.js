export default {
  props: ['settings'],

  computed: {
    calcId() {
      return this.settings.calcId || this.$store.getters.getId;
    },

    getClass() {
      return `calc-thank-you-page-container ccb-thank-you-${this.calcId} ${this.settings.boxStyle}`;
    },
  },

  template: `
        <div :class="getClass">
            <slot></slot>
        </div>
    `,
};
