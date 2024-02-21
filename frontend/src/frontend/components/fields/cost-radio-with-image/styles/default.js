import styleMixin from '../radio-with-image-field-mixin';

export default {
  mixins: [styleMixin],
  template: `
            <div>
                <div class="calc-item__title">
                    <span> {{ radioField.label }} </span>
                    <span class="ccb-required-mark" v-if="radioField.required">*</span>
                    <span v-if="radioField.required" class="calc-required-field">
                        <div class="ccb-field-required-tooltip">
                            <span class="ccb-field-required-tooltip-text" :class="{active: $store.getters.isUnused(radioField)}" style="display: none;">{{ $store.getters.getSettings.texts.required_msg }}</span>
                        </div>
                    </span>
                </div>
                
                <div class="calc-item__description before">
                    <span v-html="radioField.description"></span>
                </div>
                
                <div class="calc-radio-wrapper default calc-radio-image" :class="[boxStyle, {'calc-field-disabled': getStep === 'finish'}, 'calc_' + radioField.alias]">
                    <div class="calc-radio-image-wrapper" v-for="(element, index) in getOptions" :class="{'calc-radio-image-selected': index === selectedIdx}" @click="selectedRadio(element.value, index)">
                        <div class="calc-radio-image-box">
                            <img :src="element.src" alt="field-img"/>
                        </div>
                        <div class="calc-radio-info">
                            <div class="calc-radio-title-box">
                                <span class="calc-radio-label">{{ element.label }}</span>
                                <span class="calc-radio-price" v-if="radioField.show_value_in_option">{{ price + element.converted }}</span>
                            </div>
                        </div>
                        <label>
                            <input type="radio" :name="radioLabel" v-model="radioValue" :value="element.value" @change="() => selectedRadio(element.value, index)">
                        </label>
                    </div>
                </div>
                
                <div class="calc-item__description after">
                    <span v-html="radioField.description"></span>
                </div>
            </div>
        `,
};
