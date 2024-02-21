import summaryMixin from '../mixins/summary-mixin';

export default {
  mixins: [summaryMixin],
  template: `
    <div :class="classes" :style="style">
      <span class="sub-item-title">{{ field.label }}</span>
      <span class="sub-item-space" :class="[{'text-empty-field': field.value == 0}]"></span>
      <span class="sub-item-value" v-if="field.value != 0"> {{ field.converted }} </span>
    </div>
    `,
};
