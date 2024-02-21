<div class="cbb-edit-field-container" v-if="open">
	<div class="ccb-edit-field-header">
		<span class="ccb-edit-field-title ccb-heading-3 ccb-bold"><?php esc_html_e( 'Formula', 'cost-calculator-builder' ); ?></span>
		<div class="ccb-field-actions">
			<button class="ccb-button default" @click="$emit( 'cancel' )"><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></button>
			<button class="ccb-button success" @click.prevent="save"><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></button>
		</div>
	</div>
	<div class="ccb-grid-box">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<div class="ccb-edit-field-switch">
						<div class="ccb-edit-field-switch-item ccb-default-title" :class="{active: tab === 'element'}" @click="tab = 'element'">
							<?php esc_html_e( 'Element', 'cost-calculator-builder' ); ?>
						</div>
						<div class="ccb-edit-field-switch-item ccb-default-title" :class="{active: tab === 'settings'}" @click="tab = 'settings'">
							<?php esc_html_e( 'Settings', 'cost-calculator-builder' ); ?>
							<span class="ccb-fields-required" v-if="errorsCount > 0">{{ errorsCount }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container" v-show="tab === 'element'">
			<div class="row ccb-p-t-20">
				<div class="col-12">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Title', 'cost-calculator-builder' ); ?></span>
						<input type="text" class="ccb-heading-5 ccb-light" v-model.trim="totalField.label" placeholder="<?php esc_attr_e( 'Enter field name', 'cost-calculator-builder' ); ?>">
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15" v-if="errorMessage.length > 0">
				<div class="col-12">
					<div class="ccb-formula-message-errors">
						<p class="ccb-formula-error-message" v-for="(item) in errorMessage">
							{{ item.message }}
						</p>
					</div>	
				</div>
			</div>
			<div class="row ccb-p-t-15" v-show="totalField.formulaView">
				<div class="col-12">
					<formula-view @change="changeLegacy" v-model="totalField.legacyFormula" @error="setErrors" :id="totalField._id" :available_fields="available_fields"/>
				</div>
			</div>
			<div class="row ccb-p-t-10" v-show="!totalField.formulaView">
				<div class="col-12">
					<formula-field @change="change" @error="setErrors" :id="totalField._id" v-model="totalField.costCalcFormula" :available_fields="available_fields" :formula_view="totalField.formulaView"/>
				</div>
			</div>

			<div class="row ccb-p-t-15">
				<div class="col-12">
					<a class="ccb-documentation-link" href="https://docs.stylemixthemes.com/cost-calculator-builder/calculator-elements/total" target=”_blank”>
						<?php esc_html_e( 'How does it work?', 'cost-calculator-builder' ); ?>
					</a>
				</div>
			</div>
		</div>
		<div class="container" v-show="tab === 'settings'">
			<div class="row ccb-p-t-20">
				<div class="col-6">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="totalField.totalSymbol"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Show Alternative Symbol', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
				<div class="col-6">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="totalField.formulaView" />
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Show the legacy formula view ', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
				<div class="col-6 ccb-p-t-15" v-if="!disableFieldHiddenByDefault(totalField)">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="totalField.hidden"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Hidden by Default', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15" v-if="totalField.totalSymbol">
				<div class="col-12">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Alternative Symbol', 'cost-calculator-builder' ); ?></span>
						<input type="text" class="ccb-heading-5 ccb-light" v-model="totalField.totalSymbolSign" placeholder="<?php esc_attr_e( 'Set Alternative Symbol...', 'cost-calculator-builder' ); ?>">
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-12">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Additional Classes', 'cost-calculator-builder' ); ?></span>
						<textarea class="ccb-heading-5 ccb-light" v-model="totalField.additionalStyles" placeholder="<?php esc_attr_e( 'Set Additional Classes', 'cost-calculator-builder' ); ?>"></textarea>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
