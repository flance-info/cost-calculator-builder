import summaryMixin from '../mixins/summary-mixin';
export default {
  mixins: [summaryMixin],
  template: `
      <div :class="classes" class="inner">
         <div class="sub-inner" v-for="option in field.options" :style="style">
            <span class="sub-item-title"> {{ option.label }} </span>
            <span class="sub-item-space"></span>
            <span class="sub-item-value"> {{ option.converted }} </span>
         </div>
      </div>
    `,
};
