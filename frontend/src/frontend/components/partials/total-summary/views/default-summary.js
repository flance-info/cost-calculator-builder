import summaryMixin from '../mixins/summary-mixin';
export default {
  mixins: [summaryMixin],
  template: `
    <div :break-border="breakBorder(field)" :style="style" :class="classes">
      <span class="sub-item-title">{{ field.label }}</span>
      <span class="sub-item-space"></span>
      <span class="sub-item-value" v-if="!field.summary_view || field.summary_view === 'show_value'"> {{ field.converted }} </span>
      <span class="sub-item-value" v-if="field.summary_view !== 'show_value' && field.extraView"> {{ field.extraView }} </span>
    </div>
    `,
};
