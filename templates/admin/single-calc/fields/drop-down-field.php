<div class="cbb-edit-field-container">
	<div class="ccb-edit-field-header">
		<span class="ccb-edit-field-title ccb-heading-3 ccb-bold"><?php esc_html_e( 'Dropdown list', 'cost-calculator-builder' ); ?></span>
		<div class="ccb-field-actions">
			<button class="ccb-button default" @click="$emit( 'cancel' )"><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></button>
			<button class="ccb-button success" @click.prevent="save(dropField, id, index, dropField.alias)"><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></button>
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
		</div>
		<div class="container" v-show="tab === 'main'">
			<div class="row ccb-p-t-15">
				<div class="col">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Name', 'cost-calculator-builder' ); ?></span>
						<input type="text" class="ccb-heading-5 ccb-light" v-model.trim="dropField.label" placeholder="<?php echo esc_attr( 'Enter field name' ); ?>">
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-12">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Description', 'cost-calculator-builder' ); ?></span>
						<input type="text" class="ccb-heading-5 ccb-light" v-model.trim="dropField.description" placeholder="<?php echo esc_attr( 'Enter field description' ); ?>">
					</div>
				</div>
			</div>

			<div class="row ccb-p-t-15">
				<div class="col-12">
					<div class="ccb-options-container radio">
						<div class="ccb-options-header">
							<span><?php esc_html_e( 'Label', 'cost-calculator-builder' ); ?></span>
							<span style="display: flex"><?php esc_html_e( 'Value', 'cost-calculator-builder' ); ?>
								<span class="ccb-options-tooltip">
									<i class="ccb-icon-circle-question"></i>
									<span class="ccb-options-tooltip__text"><?php esc_html_e( 'This value can be used for calculation purposes, Use numbers only' ); ?></span>
								</span>
							</span>
						</div>
						<draggable
							v-model="fieldOptions"
							class="ccb-options"
							draggable=".ccb-option"
							:animation="200"
							handle=".ccb-option-drag"
						>
							<div class="ccb-option" v-for="(option, index) in fieldOptions" :key="option">
								<div class="ccb-option-drag" :class="{disabled: fieldOptions.length === 1}">
									<i class="ccb-icon-drag-dots"></i>
								</div>
								<div class="ccb-option-delete" @click.prevent="removeOption(index, option.optionValue)" :class="{disabled: fieldOptions.length === 1}">
									<i class="ccb-icon-close"></i>
								</div>
								<div class="ccb-option-inner">
									<div class="ccb-input-wrapper">
										<input type="text" class="ccb-heading-5 ccb-light" v-model="option.optionText" placeholder="<?php echo esc_attr( 'Option label' ); ?>">
									</div>
								</div>
								<div class="ccb-option-inner">
									<div class="ccb-input-wrapper">
										<input type="text" class="ccb-heading-5 ccb-light" step="1" min="0" :name="'option_' + index" @keyup="checkRequired('errorOptionValue' + index)" v-model="option.optionValue" placeholder="<?php echo esc_attr( 'Option Value' ); ?>">
										<span @click="numberCounterActionForOption(index)" class="input-number-counter up"></span>
										<span @click="numberCounterActionForOption(index, '-')" class="input-number-counter down"></span>
									</div>
									<span :id="'errorOptionValue' + index"></span>
								</div>
							</div>
						</draggable>
						<div class="ccb-option-actions">
							<button class="ccb-button light" @click="addOption">
								<i class="ccb-icon-Path-3453"></i>
								<?php esc_html_e( 'Add new', 'cost-calculator-builder' ); ?>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-6">
					<div class="ccb-select-box">
						<span class="ccb-select-label"><?php esc_html_e( 'Default Value', 'cost-calculator-builder' ); ?></span>
						<div class="ccb-select-wrapper">
							<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
							<select class="ccb-select" v-model="dropField.default">
								<option value="" selected><?php esc_html_e( 'Not selected', 'cost-calculator-builder' ); ?></option>
								<option v-for="(value, index) in fieldOptions" :value="value.optionValue + '_' + index" :key="index" v-if="value.optionValue">{{ value.optionText }}</option>
							</select>
						</div>
					</div>
				</div>
				<div class="col-6">
					<div class="ccb-select-box">
						<span class="ccb-select-label"><?php esc_html_e( 'Type of Label in Total', 'cost-calculator-builder' ); ?></span>
						<div class="ccb-select-wrapper">
							<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
							<select class="ccb-select big" v-model="dropField.summary_view">
								<option value="show_value" selected><?php esc_html_e( 'Show Value', 'cost-calculator-builder' ); ?></option>
								<option value="show_label_not_calculable"><?php esc_html_e( 'Label Only (No Calculation)', 'cost-calculator-builder' ); ?></option>
								<option value="show_label_calculable"><?php esc_html_e( 'Label Only (Calculate Value)', 'cost-calculator-builder' ); ?></option>
							</select>
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
		</div>
		<div class="container" v-show="tab === 'options'">
			<div class="row ccb-p-t-15">
				<div class="col-6 ccb-p-t-10">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="dropField.allowCurrency"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Currency Sign', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
				<?php if ( ccb_pro_active() ) : ?>
					<div class="col-6 ccb-p-t-10">
						<div class="list-header">
							<div class="ccb-switch">
								<input type="checkbox" v-model="dropField.required"/>
								<label></label>
							</div>
							<h6 class="ccb-heading-5"><?php esc_html_e( 'Required', 'cost-calculator-builder' ); ?></h6>
						</div>
					</div>
				<?php endif; ?>
				<div class="col-6 ccb-p-t-10">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="dropField.allowRound"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Round Value', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
				<div class="col-6 ccb-p-t-10" v-if="!disableFieldHiddenByDefault(dropField)">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="dropField.hidden"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Hidden by Default', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
				<div class="col-6 ccb-p-t-10">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="dropField.addToSummary"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Show in Grand Total', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
				<div class="col-6 ccb-p-t-10">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="dropField.show_value_in_option"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Show value in element (form)', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-12">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Additional Classes', 'cost-calculator-builder' ); ?></span>
						<textarea class="ccb-heading-5 ccb-light" v-model="dropField.additionalStyles" placeholder="<?php echo esc_attr( 'Set Additional Classes' ); ?>"></textarea>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
