<?php
/**
 * @file
 * Cost-quantity component's template
 */
?>

<div :style="additionalCss" class="calc-item ccb-field ccb-field-quantity" :class="{required: ( $store.getters.isUnused(quantityField) || Object.keys(errors).length > 0), [quantityField.additionalStyles]: quantityField.additionalStyles}" :data-id="quantityField.alias">
	<div class="calc-item__title">
		<span> {{ quantityField.label }} </span>
		<span class="ccb-required-mark" v-if="quantityField.required">*</span>
	</div>

	<div class="calc-item__description before">
		<span v-html="quantityField.description"></span>
	</div>

	<div :class="['calc-input-wrapper ccb-field', 'calc_' + quantityField.alias, {'calc-field-disabled': getStep === 'finish'}]">
		<input @focusout="parseField" @keypress="intValueFilter($event)" name="quantityField" type="number" v-model="quantityValue" :placeholder="quantityField.placeholder" class="calc-input number ccb-field ccb-appearance-field">
		<span @click="increment" class="input-number-counter up">
			<i class="ccb-icon-Path-3486"></i>
		</span>
		<span @click="decrement" class="input-number-counter down">
			<i class="ccb-icon-Path-3485"></i>
		</span>
		<span v-if="quantityField.required" :class="{active: ( $store.getters.isUnused(quantityField) && Object.keys(errors).length === 0 )}" class="ccb-error-tip front default">{{ $store.getters.getSettings.texts.required_msg }}</span>
		<span v-if="Object.keys(errors).length > 0" class="ccb-error-tip front default active">
			<span v-if="errors.hasOwnProperty('max')"><?php esc_html_e( 'Value can\'t be greater than ', 'cost-calculator-builder' ); ?> {{ quantityField.max }}</span>
			<span v-if="errors.hasOwnProperty('min')"><?php esc_html_e( 'Value can\'t be less than ', 'cost-calculator-builder' ); ?> {{ quantityField.min }}</span>
			<span v-if="errors.hasOwnProperty('min_max')"><?php esc_html_e( 'Value must be between ', 'cost-calculator-builder' ); ?>{{ quantityField.min }} - {{ quantityField.max }}</span>
		</span>
	</div>
	<div v-if="quantityField.hasOwnProperty('min') || quantityField.hasOwnProperty('max')" class="calc-item__description after">
		<span v-if="quantityField.hasOwnProperty('min') && quantityField.min.length > 0">
			<?php esc_html_e( 'Min', 'cost-calculator-builder' ); ?>: {{ quantityField.min }}
		</span>
		<span v-if="( quantityField.hasOwnProperty('min') && quantityField.min.length > 0 ) && ( quantityField.hasOwnProperty('max') && quantityField.max.length > 0)"> - </span>
		<span v-if="quantityField.hasOwnProperty('max') && quantityField.max.length > 0">
			<?php esc_html_e( 'Max', 'cost-calculator-builder' ); ?>: {{ quantityField.max }}
		</span>
	</div>

	<div class="calc-item__description after">
		<span v-html="quantityField.description"></span>
	</div>
</div>
