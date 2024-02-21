export default {
  data: () => {
    return {
      show: false,
    };
  },
  props: ['status', 'field', 'cancel', 'del'],
  methods: {
    closePopup(status) {
      this.$emit('close-confirm', status, this.field);
    },
  },

  watch: {
    status: {
      immediate: true,
      deep: true,
      handler(newValue) {
        setTimeout(() => {
          this.show = newValue;
        }, 100);
      },
    },
  },

  template: `
        <div class="ccb-confirm-popup">
            <div class="ccb-confirm-popup__overlay">
                <div class="ccb-confirm-popup__window" :class="{'active': show}">
                    <div class="ccb-confirm-popup__description">
                        <slot name="description"></slot>
                    </div>
                    <div class="ccb-confirm-popup__actions">
                        <button class="ccb-button default" @click="closePopup(false)">{{ cancel }}</button>
                        <button class="ccb-button delete" @click="closePopup(true)">{{ del }}</button>
                    </div>
                    <div class="ccb-confirm-popup__close" @click="closePopup(false)">
                        <i class="ccb-icon-close-x"></i>
                    </div>
                </div>
            </div>
        </div>
    `,
};
