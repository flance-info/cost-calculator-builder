<div class="cbb-edit-field-container">
	<div class="ccb-edit-field-header">
		<span class="ccb-edit-field-title ccb-heading-3 ccb-bold"><?php esc_html_e( 'Basic slider', 'cost-calculator-builder' ); ?></span>
		<div class="ccb-field-actions">
			<button class="ccb-button default" @click="$emit( 'cancel' )"><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></button>
			<button class="ccb-button success" @click.prevent="save(rangeField, id, index, rangeField.alias)"><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></button>
		</div>
	</div>
	<div class="ccb-grid-box">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<div class="ccb-edit-field-switch">
						<div class="ccb-edit-field-switch-item ccb-default-title" :class="{active: tab === 'main'}" @click="tab = 'main'">
							<?php esc_html_e( 'Element', 'cost-calculator-builder' ); ?>
							<span class="ccb-fields-required" v-if="errorsCount > 0">{{ errorsCount }}</span>
						</div>
						<div class="ccb-edit-field-switch-item ccb-default-title" :class="{active: tab === 'options'}" @click="tab = 'options'">
							<?php esc_html_e( 'Settings', 'cost-calculator-builder' ); ?>
						</div>
					</div>
				</div>
			</div>
			<template v-if="tab === 'main'">
				<div class="row ccb-p-t-15">
					<div class="col-12">
						<div class="ccb-input-wrapper">
							<span class="ccb-input-label"><?php esc_html_e( 'Name', 'cost-calculator-builder' ); ?></span>
							<input type="text" class="ccb-heading-5 ccb-light" v-model.trim="rangeField.label" placeholder="<?php esc_attr_e( 'Enter field name', 'cost-calculator-builder' ); ?>">
						</div>
					</div>
				</div>
				<div class="row ccb-p-t-15">
					<div class="col-12">
						<div class="ccb-input-wrapper">
							<span class="ccb-input-label"><?php esc_html_e( 'Description', 'cost-calculator-builder' ); ?></span>
							<input type="text" class="ccb-heading-5 ccb-light" v-model.trim="rangeField.description" placeholder="<?php esc_attr_e( 'Enter field description', 'cost-calculator-builder' ); ?>">
						</div>
					</div>
				</div>
				<div class="row ccb-p-t-15">
					<div class="col-6">
						<div class="ccb-input-wrapper number">
							<span class="ccb-input-label"><?php esc_html_e( 'Minimum Range Value', 'cost-calculator-builder' ); ?></span>
							<div class="ccb-input-box">
								<input type="text" class="ccb-heading-5 ccb-light" :class="{'ccb-input-required': isObjectHasPath(errors, ['minValue'] ) && errors.minValue}" name="minValue" min="0" step="1" @input="() => fixErrorByKey('minValue')" v-model="rangeField.minValue" placeholder="<?php esc_attr_e( 'Enter min range', 'cost-calculator-builder' ); ?>">
								<span @click="numberCounterAction('minValue')" class="input-number-counter up"></span>
								<span @click="numberCounterAction('minValue', '-')" class="input-number-counter down"></span>
							</div>
							<span class="ccb-error-tip default" v-if="isObjectHasPath(errors, ['minValue'] ) && errors.minValue" v-html="errors.minValue"></span>
						</div>
					</div>
					<div class="col-6">
						<div class="ccb-input-wrapper number">
							<span class="ccb-input-label"><?php esc_html_e( 'Maximum Range Value', 'cost-calculator-builder' ); ?></span>
							<div class="ccb-input-box">
								<input type="text" class="ccb-heading-5 ccb-light" :class="{'ccb-input-required': isObjectHasPath(errors, ['maxValue'] ) && errors.maxValue}" name="maxValue" min="0"  step="1" @input="() => fixErrorByKey('maxValue')" v-model="rangeField.maxValue" placeholder="<?php esc_attr_e( 'Enter max range', 'cost-calculator-builder' ); ?>">
								<span @click="numberCounterAction('maxValue')" class="input-number-counter up"></span>
								<span @click="numberCounterAction('maxValue', '-')" class="input-number-counter down"></span>
							</div>
							<span class="ccb-error-tip default" v-if="isObjectHasPath(errors, ['maxValue'] ) && errors.maxValue" v-html="errors.maxValue"></span>
						</div>
					</div>
				</div>
				<div class="row ccb-p-t-15">
					<div class="col-6">
						<div class="ccb-input-wrapper number">
							<span class="ccb-input-label"><?php esc_html_e( 'Range Step', 'cost-calculator-builder' ); ?></span>
							<div class="ccb-input-box">
								<input type="text" class="ccb-heading-5 ccb-light" :class="{'ccb-input-required': isObjectHasPath(errors, ['step'] ) && errors.step}" name="step" min="0" step="1" @input="() => fixErrorByKey('step')" v-model="rangeField.step" placeholder="<?php esc_attr_e( 'Enter step', 'cost-calculator-builder' ); ?>">
								<span @click="numberCounterAction('step')" class="input-number-counter up"></span>
								<span @click="numberCounterAction('step', '-')" class="input-number-counter down"></span>
							</div>
							<span class="ccb-error-tip default" v-if="isObjectHasPath(errors, ['step'] ) && errors.step" v-html="errors.step"></span>
						</div>
					</div>
					<div class="col-6">
						<div class="ccb-input-wrapper number">
							<span class="ccb-input-label"><?php esc_html_e( 'Range Default Value', 'cost-calculator-builder' ); ?></span>
							<div class="ccb-input-box">
								<input type="text" class="ccb-heading-5 ccb-light" name="default" min="0" step="1" @input="errors.default=false" v-model="rangeField.default" placeholder="<?php esc_attr_e( 'Enter default value', 'cost-calculator-builder' ); ?>">
								<span @click="numberCounterAction('default')" class="input-number-counter up"></span>
								<span @click="numberCounterAction('default', '-')" class="input-number-counter down"></span>
							</div>
							<span class="ccb-error-tip default" v-if="isObjectHasPath(errors, ['default'] ) && errors.default" v-html="errors.default"></span>
						</div>
					</div>
				</div>
				<div class="row ccb-p-t-15">
					<div class="col-6">
						<div class="ccb-input-wrapper" :class="{ 'disabled': !rangeField.multiply && rangeField.allowCurrency }">
							<span class="ccb-input-label"><?php esc_html_e( 'Name of value (kg, gr, pcs)', 'cost-calculator-builder' ); ?></span>
							<input type="text" maxlength="18" class="ccb-heading-5 ccb-light" v-model.trim="rangeField.sign" placeholder="<?php esc_attr_e( 'Enter unit symbol', 'cost-calculator-builder' ); ?>">
						</div>
					</div>
					<div class="col-6">
						<div class="ccb-disable-msg" v-if="!rangeField.multiply && rangeField.allowCurrency">
							<span><?php esc_html_e( 'Currency sign is ON', 'cost-calculator-builder' ); ?></span>
						</div>
						<div class="ccb-select-box" style="padding-top: 27px;" v-else>
							<div class="ccb-select-wrapper">
								<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
								<select class="ccb-select" v-model="rangeField.unitPosition">
									<option value="right" selected><?php esc_html_e( 'On the right', 'cost-calculator-builder' ); ?></option>
									<option value="left"><?php esc_html_e( 'On the left', 'cost-calculator-builder' ); ?></option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div class="row ccb-p-t-15">
					<div class="col-6">
						<div class="list-header">
							<div class="ccb-switch">
								<input type="checkbox" v-model="rangeField.multiply"/>
								<label></label>
							</div>
							<h6 class="ccb-heading-5"><?php esc_html_e( 'Multiply (cost per value)', 'cost-calculator-builder' ); ?></h6>
						</div>
					</div>
				</div>
				<div class="row ccb-p-t-15" v-if="rangeField.multiply">
					<div class="col-12">
						<div class="list-header">
							<div class="ccb-multiply">
								<span class="ccb-multiply__bg">=</span>
								<span class="ccb-multiply__bg"><?php esc_html_e( 'Selected value', 'cost-calculator-builder' ); ?></span>
								<span class="ccb-multiply__icon"><i class="ccb-icon-close"></i></span>
								<div class="ccb-input-wrapper number">
									<div class="ccb-input-box">
										<input type="text" class="ccb-heading-5 ccb-light" name="unit" min="1" step="1" @keypress="unitMinValue" v-model="rangeField.unit" placeholder="<?php esc_attr_e( 'Enter unit', 'cost-calculator-builder' ); ?>">
										<span @click="numberCounterAction('unit')" class="input-number-counter up"></span>
										<span @click="numberCounterAction('unit', '-')" class="input-number-counter down"></span>
									</div>
									<span class="ccb-error-tip default" v-if="isObjectHasPath(errors, ['unit'] ) && errors.unit" v-html="errors.unit"></span>
								</div>
								<div class="ccb-input-wrapper" style="margin-left: 10px; width: 160px;" v-if="!rangeField.allowCurrency">
									<input type="text" maxlength="5" class="ccb-heading-5 ccb-light" v-model.trim="rangeField.unitSymbol" placeholder="<?php esc_attr_e( 'Unit (kg, cm,...)', 'cost-calculator-builder' ); ?>">
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row ccb-p-t-15" v-if="errorsCount > 0">
					<div class="col-12">
						<div class="ccb-notice ccb-error">
							<span class="ccb-notice-title"><?php esc_html_e( 'Not Saved!', 'cost-calculator-builder' ); ?></span>
							<span class="ccn-notice-description"><?php esc_html_e( 'Options tab contains errors, check the fields!', 'cost-calculator-builder' ); ?></span>
						</div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="row ccb-p-t-15">
					<div class="col-6 ccb-p-t-10">
						<div class="list-header">
							<div class="ccb-switch">
								<input type="checkbox" v-model="rangeField.allowCurrency"/>
								<label></label>
							</div>
							<h6 class="ccb-heading-5"><?php esc_html_e( 'Currency Sign', 'cost-calculator-builder' ); ?></h6>
						</div>
					</div>
					<div class="col-6 ccb-p-t-10">
						<div class="list-header">
							<div class="ccb-switch">
								<input type="checkbox" v-model="rangeField.allowRound"/>
								<label></label>
							</div>
							<h6 class="ccb-heading-5"><?php esc_html_e( 'Round Value', 'cost-calculator-builder' ); ?></h6>
						</div>
					</div>
					<div class="col-6 ccb-p-t-10" v-if="!disableFieldHiddenByDefault(rangeField)">
						<div class="list-header">
							<div class="ccb-switch">
								<input type="checkbox" v-model="rangeField.hidden"/>
								<label></label>
							</div>
							<h6 class="ccb-heading-5"><?php esc_html_e( 'Hidden by Default', 'cost-calculator-builder' ); ?></h6>
						</div>
					</div>
					<div class="col-6 ccb-p-t-10">
						<div class="list-header">
							<div class="ccb-switch">
								<input type="checkbox" v-model="rangeField.addToSummary"/>
								<label></label>
							</div>
							<h6 class="ccb-heading-5"><?php esc_html_e( 'Show in Grand Total', 'cost-calculator-builder' ); ?></h6>
						</div>
					</div>
					<?php if ( ccb_pro_active() ) : ?>
						<div class="col-6 ccb-p-t-10">
							<div class="list-header">
								<div class="ccb-switch">
									<input type="checkbox" v-model="rangeField.required"/>
									<label></label>
								</div>
								<h6 class="ccb-heading-5"><?php esc_html_e( 'Required', 'cost-calculator-builder' ); ?></h6>
							</div>
						</div>
					<?php endif; ?>
				</div>
				<div class="row ccb-p-t-15">
					<div class="col-12">
						<div class="ccb-input-wrapper">
							<span class="ccb-input-label"><?php esc_html_e( 'Additional Classes', 'cost-calculator-builder' ); ?></span>
							<textarea class="ccb-heading-5 ccb-light" v-model="rangeField.additionalStyles" placeholder="<?php esc_attr_e( 'Set Additional Classes', 'cost-calculator-builder' ); ?>"></textarea>
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</div>
