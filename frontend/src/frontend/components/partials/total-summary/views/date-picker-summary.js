import summaryMixin from '../mixins/summary-mixin';
export default {
  mixins: [summaryMixin],
  template: `
        <div :break-border="breakBorder(field)" :class="classes" :style="style">
          <span class="sub-item-title">{{ field.label }} </span>
          <span class="sub-item-space"></span>
          <span class="sub-item-value" v-if="!field.summary_view || field.summary_view === 'show_value'"> {{ field.convertedPrice }} </span>
          <span class="sub-item-value" v-if="field.summary_view !== 'show_value' && field.extraView"> {{ field.extraView }} </span>
      </div>
    `,
};
