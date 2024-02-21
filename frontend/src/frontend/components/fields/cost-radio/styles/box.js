import styleMixin from '../radio-field-mixin'

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

                    <div class="calc-radio-wrapper" :class="[radioView, boxStyle, 'boxed', {'calc-field-disabled': getStep === 'finish'}, 'calc_' + radioField.alias]">
                        <div class="calc-radio-item" v-for="(element, index) in getOptions">
                            <input type="radio" :name="radioLabel" v-model="radioValue" :value="element.value" :id="radioLabel + index">
                            <label :for="radioLabel + index">
                                <span class="calc-radio-label">{{ element.label }}</span>
                            </label>
                        </div>
                    </div>

                    <div class="calc-item__description after">
                        <span v-html="radioField.description"></span>
                    </div>
                </div>
    `
}