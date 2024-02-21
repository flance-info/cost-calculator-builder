<div :style="additionalCss" class="calc-item ccb-field" :class="{required: $store.getters.isUnused(dropDownField), [dropDownField.additionalStyles]: dropDownField.additionalStyles}" :data-id="dropDownField.alias">
	<div class="calc-item__title">
		<span>{{ dropDownField.label }}</span>
		<span class="ccb-required-mark" v-if="dropDownField.required">*</span>
	</div>

	<div class="calc-item__description before">
		<span v-html="dropDownField.description"></span>
	</div>

	<div :class="['ccb-drop-down', 'calc_' + dropDownField.alias, {'calc-field-disabled': getStep === 'finish'}]">
		<div class="calc-drop-down">
			<div class="calc-drop-down-wrapper">
				<span :class="['calc-drop-down-with-image-current calc-dd-toggle ccb-appearance-field', {'calc-dd-selected': openList}]" @click="openListHandler" :data-alias="dropDownField.alias">
					<span v-if='selectValue == 0' class="calc-dd-with-option-label calc-dd-toggle">
						<?php esc_html_e( 'Select value', 'cost-calculator-builder' ); ?>
					</span>
					<span v-else class="calc-dd-with-option-label calc-dd-toggle">
						{{ getLabel ? getLabel : '<?php esc_html_e( 'Select value', 'cost-calculator-builder' ); ?>' }}
					</span>
					<i :class="['ccb-icon-Path-3485 ccb-select-arrow calc-dd-toggle', {'ccb-arrow-down': !openList}]"></i>
					<span v-if="dropDownField.required" :class="{active: $store.getters.isUnused(dropDownField)}" class="ccb-error-tip front default">
						{{ $store.getters.getSettings.texts.required_msg }}
					</span>
				</span>
				<div :class="[{'calc-list-open': openList}, 'calc-drop-down-list']">
					<ul class="calc-drop-down-list-items">
						<li @click="selectOption(null)" :value="getEmptyValue">
							<span class="calc-list-wrapper">
								<span class="calc-list-title"><?php esc_html_e( 'Select value', 'cost-calculator-builder' ); ?></span>
							</span>
						</li>
						<li v-for="element in getOptions" :key="element.value" :value="element.value" @click="selectOption(element)">
							<span class="calc-list-wrapper">
								<span class="calc-list-title">{{ element.label | to-short-label }}</span>
								<span class="calc-list-price" v-if="dropDownField.show_value_in_option">
									<?php esc_html_e( 'Price', 'cost-calculator-builder' ); ?>: {{ element.converted }}
								</span>
							</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="calc-item__description after">
		<span v-html="dropDownField.description"></span>
	</div>

</div>
