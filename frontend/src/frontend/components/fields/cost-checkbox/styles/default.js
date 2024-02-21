import styleMixin from '../checkbox-field-mixin'

export default {
    mixins: [styleMixin],
    template: `
            <div>
                <div class="calc-item__title">
                    <span> {{ checkboxField.label }} </span>
                    <span class="ccb-required-mark" v-if="checkboxField.required">*</span>
                    <span v-if="checkboxField.required" class="calc-required-field">
                        <div class="ccb-field-required-tooltip">
                            <span class="ccb-field-required-tooltip-text" :class="{active: $store.getters.isUnused(checkboxField)}" style="display: none;">{{ $store.getters.getSettings.texts.required_msg }}</span>
                        </div>
                    </span>
                </div>
            
                <div class="calc-item__description before">
                    <span v-html="checkboxField.description"></span>
                </div>
            
                <div :class="['calc-checkbox', boxStyle, 'default', 'calc_' + checkboxField.alias, checkboxView, {'calc-field-disabled': getStep === 'finish'}]" >
                    <div class="calc-checkbox-item" v-for="( element, index ) in getOptions">
                        <input :checked="element.isChecked" type="checkbox" :id="checkboxLabel + index" :value="element.value" @change="change(event, element.label)">
                        <label :for="checkboxLabel + index">
                            <span>
                                <span class="calc-checkbox-title">{{ element.label }}</span>
                                <span class="ccb-checkbox-hint" v-if="element.hint">
                                    <i class="ccb-icon-Path-3367"></i>
                                    <span class="ccb-checkbox-hint__content" v-html="element.hint"></span>
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
                <div class="calc-item__description after">
                    <span v-html="checkboxField.description"></span>
                </div>
            </div>
    `
}