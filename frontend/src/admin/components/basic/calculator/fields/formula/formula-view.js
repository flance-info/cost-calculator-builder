import formulaMixin from './formula.mixin';

export default {
  mixins: [formulaMixin],
  props: ['available_fields', 'available', 'id', 'value'],

  data: () => ({
    innerValue: '',
  }),

  mounted() {
    this.innerValue = this.value || '';
  },

  methods: {
    updateLegacy() {
      this.$emit('change', this.innerValue);
    },
  },

  template: `
    <div class="ccb-edit-field-formula">
      <div class="ccb-formula-content">
        <div class="ccb-input-wrapper">
          <textarea class="ccb-heading-5 ccb-light" @change="updateLegacy" v-model="innerValue" :id="'ccb-formula-' + id" :ref="'ccb-formula-' + id" placeholder="Enter your formula"></textarea>
        </div>
      </div>
      <div class="ccb-formula-tools">
         <span class="ccb-formula-tool" title="Addition (+)" @click="insertAtCursor('+')">
           <span class="plus">+</span>
         </span>
         <span class="ccb-formula-tool" title="Subtraction (-)" @click="insertAtCursor('-')">-</span>
         <span class="ccb-formula-tool" title="Division (/)" @click="insertAtCursor('/')">/</span>
         <span class="ccb-formula-tool" title="Remainder (%)" @click="insertAtCursor('%')">%</span>
         <span class="ccb-formula-tool" title="Multiplication (*)" @click="insertAtCursor('*')">
           <span class="multiple">*</span>
         </span>
         <span class="ccb-formula-tool" title="Math.pow(x, y) returns the value of x to the power of y:" @click="insertAtCursor('Math.pow(')">pow</span>
         <span class="ccb-formula-tool" title="Math.sqrt(x) returns the square root of x:" @click="insertAtCursor('Math.sqrt(')">sqrt</span>
         <span class="ccb-formula-tool" title="Math.abs(x)" @click="insertAtCursor('Math.abs(')">abs</span>
         <span class="ccb-formula-tool" title="Math.round(x) returns the value of x rounded to its nearest integer:" @click="insertAtCursor('Math.round(')">round</span>
         <span class="ccb-formula-tool" title="Math.ceil(x) returns the value of x rounded up to its nearest integer:" @click="insertAtCursor('Math.ceil(')">ceil</span>
         <span class="ccb-formula-tool" title="Math.floor(x) returns the value of x rounded down to its nearest integer:" @click="insertAtCursor('Math.floor(')">floor</span>
      </div>
      <div class="ccb-edit-field-aliases">
        <template v-if="available_fields.length">
          <div class="ccb-edit-field-alias" v-for="item in available_fields" @click="insertAtCursor(item.type === 'Total' ? '(' + item.alias + ')' : item.alias)" v-if="item.alias !== 'total'">
              {{ item.alias }}
          </div>
        </template>
        <template v-else>
          <p>No Available fields yet!</p>
        </template>
      </div>
    </div>
  `,
};
