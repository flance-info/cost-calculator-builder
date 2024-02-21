import calcModal from '../../modal/index';
import defaultWrapper from './default-wrapper';

export default {
  props: ['settings'],
  components: {
    'calc-modal': calcModal,
    'default-wrapper': defaultWrapper,
  },

  mounted() {},

  template: `
      <calc-modal>
        <default-wrapper :settings="settings" style="width: 495px;">
          <slot></slot>
        </default-wrapper>
      </calc-modal>
    `,
};
