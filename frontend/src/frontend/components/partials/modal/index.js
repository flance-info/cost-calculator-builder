export default {
  computed: {
    isOpen() {
      return this.$store.getters.getThankYouModalOpen;
    },
    hide() {
      return this.$store.getters.getThankYouModalHide;
    },
  },

  template: `
      <div class="ccb-modal-wrapper" :class="{open: isOpen, hide: hide}">
          <div class="ccb-modal-overlay">
              <div class="ccb-modal-window">
                  <div class="ccb-modal-window-content">
                      <slot></slot>
                  </div>
              </div>
          </div>
      </div>
    `,
};
