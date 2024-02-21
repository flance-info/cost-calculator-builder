import defaultSummary from './views/default-summary';
import datePickerSummary from './views/date-picker-summary';
import optionUnitSummary from './views/option-unit-summary';
import multiOptionSummary from './views/multi-option-summary';
import textSummary from './views/text-summary';
import fileUploadSummary from './views/file-upload-summary';

export default {
  props: ['field', 'unit', 'multi'],

  components: {
    'default-summary': defaultSummary,
    'date-picker-summary': datePickerSummary,
    'option-unit-summary': optionUnitSummary,
    'multi-option-summary': multiOptionSummary,
    'text-summary': textSummary,
    'file-upload-summary': fileUploadSummary,
  },

  computed: {
    getComponent() {
      if (this.field.alias.includes('date') && !this.unit) {
        return 'date-picker-summary';
      } else if (this.field.alias.includes('text')) {
        return 'text-summary';
      } else if (this.field.alias.includes('file') && !this.field.allowPrice) {
        return 'file-upload-summary';
      } else if (this.unit) {
        return 'option-unit-summary';
      } else if (this.multi) {
        return 'multi-option-summary';
      }
      return 'default-summary';
    },

    isMultiOption() {
      const fieldName = this.field.alias.replace(/\_field_id.*/, '');
      return (
        ['checkbox', 'toggle', 'checkbox_with_img'].includes(fieldName) &&
        this.field.options?.length
      );
    },

    getClassAttr() {
      return [this.field.alias, 'sub-list-item'];
    },

    getStyleAttr() {
      return { display: this.field.hidden ? 'none' : 'flex' };
    },
  },

  template: `
    <template>
      <component :data-type="getComponent" :is="getComponent" :classes="getClassAttr" :style="getStyleAttr" :field="field"/>      
    </template>
    `,
};
