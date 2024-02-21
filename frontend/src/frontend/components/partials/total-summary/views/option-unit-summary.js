import summaryMixin from '../mixins/summary-mixin';
export default {
  mixins: [summaryMixin],
  template: `
      <div :class="classes" class="inner">
        <div class="sub-inner" :style="[style, {flexDirection: 'column', marginBottom: '5px !important'}]">
          <span class="sub-item-unit" v-if="field.option_unit_info">{{ field.option_unit_info }}</span>
          <span class="sub-item-unit" :class="{'break-all': field.break_all}">{{ field.option_unit }}</span>
        </div>
      </div>
    `,
};
