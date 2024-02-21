<?php
$export_link = esc_url( get_site_url() ) . '/wp-admin/admin-ajax.php?action=cost-calculator-custom-export-run&ccb_nonce=' . esc_attr( wp_create_nonce( 'ccb_export_nonce' ) );
?>

<div class="ccb-table-body" style="height: calc(100vh - 145px)" v-if="preloader">
	<loader></loader>
</div>
<div class="ccb-table-body" style="height: calc(100vh - 145px)" v-else>
	<div class="ccb-table-body--card" v-if="getExisting?.length > 0 || calculatorsList.page > 1">
		<div class="table-display" style="z-index: 2">
			<div class="table-display--left">
				<div class="ccb-bulk-actions">
					<div class="ccb-select-wrapper">
						<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
						<select name="actionType" id="actionType" class="ccb-select">
							<option value="-1"><?php esc_html_e( 'Bulk actions', 'cost-calculator-builder' ); ?></option>
							<option value="duplicate" class="hide-if-no-js"><?php esc_html_e( 'Duplicate', 'cost-calculator-builder' ); ?></option>
							<option value="delete"><?php esc_html_e( 'Delete', 'cost-calculator-builder' ); ?></option>
						</select>
					</div>
					<button class="ccb-button default" @click.prevent="bulkAction"><?php esc_html_e( 'Apply', 'cost-calculator-builder' ); ?></button>
				</div>
			</div>
			<div class="table-display--right">
				<div class="ccb-bulk-actions">
					<button class="ccb-button default" @click="openDemoImport">
						<i class="ccb-icon-Path-34581" style="margin-right: 3px"></i>
						<?php esc_html_e( 'Import', 'cost-calculator-builder' ); ?>
					</button>
					<label class="ccb-btn-dropdown ccb-btn-export" style="padding: 0; margin: 0">
						<span class="ccb-button default ccb-btn-dropdown-btn" style="height: 100%">
							<i class="ccb-icon-Path-3458" style="margin-right: 3px"></i>
							<?php esc_html_e( 'Export', 'cost-calculator-builder' ); ?>
						</span>
						<input type="checkbox" class="ccb-btn-dropdown-input">
						<ul class="ccb-btn-dropdown-list">
							<li class="ccb-export-list ccb-default-title ccb-bold" :class="{'ccb-list-disabled': checkedCalculatorIds.length === 0}">
								<a class="ccb-export-link" :href="'<?php echo esc_url( $export_link ); ?>&calculator_ids=' + checkedCalculatorIds.join(',')" v-if="checkedCalculatorIds.length">
									<?php esc_html_e( 'Selected', 'cost-calculator-builder' ); ?> <span class="ccb-ids-selected">{{ checkedCalculatorIds.length }}</span>
								</a>
								<a href="#" class="ccb-export-link" v-else>
									<?php esc_html_e( 'Selected', 'cost-calculator-builder' ); ?> <span class="ccb-ids-selected">{{ checkedCalculatorIds.length }}</span>
								</a>
							</li>
							<li class="ccb-export-list ccb-default-title ccb-bold">
								<a class="ccb-export-link" href="<?php echo esc_url( $export_link ); ?>">
									<?php esc_html_e( 'All', 'cost-calculator-builder' ); ?>
								</a>
							</li>
						</ul>
					</label>

					<button class="ccb-button success" @click.prevent="openTemplates">
						<i class="ccb-icon-Path-3453" style="margin-right: 3px"></i>
						<?php esc_html_e( 'Create new', 'cost-calculator-builder' ); ?>
					</button>
				</div>
			</div>
		</div>
		<div class="table-concept ccb-custom-scrollbar" style="z-index: 1">
			<div class="list-item calculators-header calculators">
				<div class="list-title check">
					<input type="checkbox" class="ccb-pure-checkbox" v-model="allChecked" @click="checkAllCalculatorsAction">
				</div>
				<div class="list-title sortable id" :class="isActiveSort('id')" @click="setSort('id')">
					<span class="ccb-default-title"><?php esc_html_e( 'ID', 'cost-calculator-builder' ); ?></span>
				</div>
				<div class="list-title sortable title" :class="isActiveSort('post_title')" @click="setSort('post_title')">
					<span class="ccb-default-title"><?php esc_html_e( 'Calculator Name', 'cost-calculator-builder' ); ?></span>
				</div>
				<div class="list-title actions <?php echo esc_attr( 'actions' ); ?>" style="text-align: right">
					<span class="ccb-default-title"><?php esc_html_e( 'Actions', 'cost-calculator-builder' ); ?></span>
				</div>
			</div>
			<div class="list-item calculators" v-for="(calc, idx) in getExisting" :key="idx">
				<div class="list-title check">
					<input type="checkbox" class="ccb-pure-checkbox" :checked="checkedCalculatorIds.includes(calc.id)" :value="calc.id" @click="checkCalculatorAction(calc.id)">
				</div>
				<div class="list-title id">
					<span class="ccb-default-title">{{ calc.id }}</span>
				</div>
				<div class="list-title title">
					<span class="ccb-title">
						<span class="ccb-default-title" style="cursor: pointer" @click="editCalc(calc.id)">{{ calc.project_name | to-short }}</span>
					</span>
				</div>
				<div class="list-title actions" style="display: flex; justify-content: flex-end">
					<div class="ccb-action copy" @click="embedCalc(calc.id)">
						<i class="ccb-icon-html"></i>
						<span><?php echo esc_html__( 'Embed', 'cost-calculator-builder' ); ?></span>
					</div>
					<div class="ccb-action copy" @click="duplicateCalc(calc.id)">
						<i class="ccb-icon-Path-3505"></i>
						<span><?php echo esc_html__( 'Duplicate', 'cost-calculator-builder' ); ?></span>
					</div>
					<div class="ccb-action delete" @click="deleteCalc(calc.id)">
						<i class="ccb-icon-Path-3503"></i>
						<span><?php echo esc_html__( 'Delete', 'cost-calculator-builder' ); ?></span>
					</div>
					<div class="ccb-action edit"  @click="editCalc(calc.id)">
						<i class="ccb-icon-Path-3483"></i>
						<span><?php echo esc_html__( 'Edit', 'cost-calculator-builder' ); ?></span>
					</div>
				</div>
			</div>
		</div>
		<div class="ccb-pagination">
			<div class="ccb-pages">
				<span class="ccb-page-item" @click="prevPage" v-if="calculatorsList.page != 1">
					<i class="ccb-icon-Path-3481 prev"></i>
				</span>
				<span class="ccb-page-item" v-for="n in totalPages" :key="n" :class="{active: n === calculatorsList.page}" @click="getPage(n)" :disabled="n == calculatorsList.page">{{ n }}</span>
				<span class="ccb-page-item" @click="nextPage" v-if="calculatorsList.page != totalPages">
					<i class="ccb-icon-Path-3481"></i>
				</span>
			</div>
			<div class="ccb-bulk-actions">
				<div class="ccb-select-wrapper">
					<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
					<select v-model="limit" @change="resetPage" class="ccb-select">
						<option value="5"><?php esc_html_e( '5 per page', 'cost-calculator-builder' ); ?></option>
						<option value="10" class="hide-if-no-js"><?php esc_html_e( '10 per page', 'cost-calculator-builder' ); ?></option>
						<option value="15" class="hide-if-no-js"><?php esc_html_e( '15 per page', 'cost-calculator-builder' ); ?></option>
						<option value="20"><?php esc_html_e( '20 per page', 'cost-calculator-builder' ); ?></option>
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="ccb-no-existing-calc ccb-demo-import-container" :class="ccbDragOverClasses"  @drop="handleDrop" @dragover="handleDragOver" @dragleave="handleDragLeave"  ref="ccbDragAreaParent" style="width: 100%" v-else>
		<div class="ccb-demo-import-content">
			<div class="ccb-demo-import-icon-wrap">
				<i class="ccb-icon-Union-32"></i>
			</div>
			<div class="ccb-demo-import-title">
				<span><?php esc_html_e( 'No calculators yet', 'cost-calculator-builder' ); ?></span>
			</div>
			<div class="ccb-demo-import-description">
				<span><?php esc_html_e( 'Create a new one from scratch or import prebuilt calculators.', 'cost-calculator-builder' ); ?></span>
			</div>
			<div class="ccb-demo-import-action">
				<button class="ccb-button default" @click="openDemoImport">
					<i class="ccb-icon-Path-34581" style="margin-right: 3px"></i>
					<?php esc_html_e( 'Import', 'cost-calculator-builder' ); ?>
				</button>
				<button class="ccb-button success" @click.prevent="openTemplates">
					<i class="ccb-icon-Path-3453" style="margin-right: 3px;"></i>
					<?php esc_html_e( 'Create', 'cost-calculator-builder' ); ?>
				</button>
			</div>
		</div>
		<div class="ccb-import-drag-area"   draggable="false" >
			<svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none" draggable="true">
				<g opacity="0.5">
					<mask id="mask0_7158_14649" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="19" height="18">
						<path d="M0.5 0H18.5V18H0.5V0Z" fill="white"/>
					</mask>
					<g mask="url(#mask0_7158_14649)">
						<path d="M2.75 3C2.94891 3 3.13968 2.92098 3.28033 2.78033C3.42098 2.63968 3.5 2.44891 3.5 2.25C3.5 2.05109 3.42098 1.86032 3.28033 1.71967C3.13968 1.57902 2.94891 1.5 2.75 1.5C2.55109 1.5 2.36032 1.57902 2.21967 1.71967C2.07902 1.86032 2 2.05109 2 2.25C2 2.44891 2.07902 2.63968 2.21967 2.78033C2.36032 2.92098 2.55109 3 2.75 3ZM3.5 5.25C3.5 5.44891 3.42098 5.63968 3.28033 5.78033C3.13968 5.92098 2.94891 6 2.75 6C2.55109 6 2.36032 5.92098 2.21967 5.78033C2.07902 5.63968 2 5.44891 2 5.25C2 5.05109 2.07902 4.86032 2.21967 4.71967C2.36032 4.57902 2.55109 4.5 2.75 4.5C2.94891 4.5 3.13968 4.57902 3.28033 4.71967C3.42098 4.86032 3.5 5.05109 3.5 5.25ZM8 8.25C8 8.05109 8.07902 7.86032 8.21967 7.71967C8.36032 7.57902 8.55109 7.5 8.75 7.5H14.75C14.9489 7.5 15.1397 7.57902 15.2803 7.71967C15.421 7.86032 15.5 8.05109 15.5 8.25V9C15.5 9.19891 15.579 9.38968 15.7197 9.53033C15.8603 9.67098 16.0511 9.75 16.25 9.75C16.4489 9.75 16.6397 9.67098 16.7803 9.53033C16.921 9.38968 17 9.19891 17 9V8.25C17 7.65326 16.7629 7.08097 16.341 6.65901C15.919 6.23705 15.3467 6 14.75 6H12.5V5.25C12.5 5.05109 12.421 4.86032 12.2803 4.71967C12.1397 4.57902 11.9489 4.5 11.75 4.5C11.5511 4.5 11.3603 4.57902 11.2197 4.71967C11.079 4.86032 11 5.05109 11 5.25V6H8.75C8.15326 6 7.58097 6.23705 7.15901 6.65901C6.73705 7.08097 6.5 7.65326 6.5 8.25V10.5H5.75C5.55109 10.5 5.36032 10.579 5.21967 10.7197C5.07902 10.8603 5 11.0511 5 11.25C5 11.4489 5.07902 11.6397 5.21967 11.7803C5.36032 11.921 5.55109 12 5.75 12H6.5V14.25C6.5 14.8467 6.73705 15.419 7.15901 15.841C7.58097 16.2629 8.15326 16.5 8.75 16.5H10.25C10.4489 16.5 10.6397 16.421 10.7803 16.2803C10.921 16.1397 11 15.9489 11 15.75C11 15.5511 10.921 15.3603 10.7803 15.2197C10.6397 15.079 10.4489 15 10.25 15H8.75C8.55109 15 8.36032 14.921 8.21967 14.7803C8.07902 14.6397 8 14.4489 8 14.25V8.25Z" fill="#001931"/>
						<path d="M13.067 10.08C13.0098 10.0466 12.9449 10.029 12.8787 10.0289C12.8125 10.0288 12.7475 10.0461 12.6902 10.0793C12.6329 10.1124 12.5854 10.1601 12.5526 10.2175C12.5197 10.275 12.5026 10.3401 12.503 10.4062L12.5225 14.7428C12.523 14.8309 12.5494 14.9169 12.5983 14.9902C12.6473 15.0635 12.7167 15.1208 12.7979 15.155C12.8792 15.1892 12.9687 15.1987 13.0553 15.1825C13.1419 15.1663 13.2219 15.125 13.2853 15.0637L14.1943 14.1847L15.413 16.2952C15.5132 16.4661 15.6768 16.5904 15.8683 16.641C16.0598 16.6917 16.2635 16.6645 16.435 16.5655C16.6065 16.4664 16.7319 16.3036 16.7838 16.1124C16.8357 15.9213 16.8099 15.7174 16.712 15.5452L15.4933 13.434L16.7083 13.0868C16.7932 13.0627 16.8693 13.0141 16.9269 12.9471C16.9844 12.8801 17.021 12.7977 17.0321 12.71C17.0431 12.6224 17.0281 12.5334 16.9889 12.4542C16.9497 12.375 16.8881 12.3091 16.8118 12.2648L13.067 10.0807V10.08ZM3.5 11.25C3.5 11.4489 3.42098 11.6397 3.28033 11.7803C3.13968 11.921 2.94891 12 2.75 12C2.55109 12 2.36032 11.921 2.21967 11.7803C2.07902 11.6397 2 11.4489 2 11.25C2 11.0511 2.07902 10.8603 2.21967 10.7197C2.36032 10.579 2.55109 10.5 2.75 10.5C2.94891 10.5 3.13968 10.579 3.28033 10.7197C3.42098 10.8603 3.5 11.0511 3.5 11.25ZM2.75 9C2.94891 9 3.13968 8.92098 3.28033 8.78033C3.42098 8.63968 3.5 8.44891 3.5 8.25C3.5 8.05109 3.42098 7.86032 3.28033 7.71967C3.13968 7.57902 2.94891 7.5 2.75 7.5C2.55109 7.5 2.36032 7.57902 2.21967 7.71967C2.07902 7.86032 2 8.05109 2 8.25C2 8.44891 2.07902 8.63968 2.21967 8.78033C2.36032 8.92098 2.55109 9 2.75 9ZM6.5 2.25C6.5 2.44891 6.42098 2.63968 6.28033 2.78033C6.13968 2.92098 5.94891 3 5.75 3C5.55109 3 5.36032 2.92098 5.21967 2.78033C5.07902 2.63968 5 2.44891 5 2.25C5 2.05109 5.07902 1.86032 5.21967 1.71967C5.36032 1.57902 5.55109 1.5 5.75 1.5C5.94891 1.5 6.13968 1.57902 6.28033 1.71967C6.42098 1.86032 6.5 2.05109 6.5 2.25ZM8.75 3C8.94891 3 9.13968 2.92098 9.28033 2.78033C9.42098 2.63968 9.5 2.44891 9.5 2.25C9.5 2.05109 9.42098 1.86032 9.28033 1.71967C9.13968 1.57902 8.94891 1.5 8.75 1.5C8.55109 1.5 8.36032 1.57902 8.21967 1.71967C8.07902 1.86032 8 2.05109 8 2.25C8 2.44891 8.07902 2.63968 8.21967 2.78033C8.36032 2.92098 8.55109 3 8.75 3ZM12.5 2.25C12.5 2.44891 12.421 2.63968 12.2803 2.78033C12.1397 2.92098 11.9489 3 11.75 3C11.5511 3 11.3603 2.92098 11.2197 2.78033C11.079 2.63968 11 2.44891 11 2.25C11 2.05109 11.079 1.86032 11.2197 1.71967C11.3603 1.57902 11.5511 1.5 11.75 1.5C11.9489 1.5 12.1397 1.57902 12.2803 1.71967C12.421 1.86032 12.5 2.05109 12.5 2.25Z" fill="#001931"/>
					</g>
				</g>
			</svg>
			<span class="import-drag-text" draggable="false">
				<?php esc_html_e( 'You can drag  file here', 'cost-calculator-builder' ); ?>
			</span>
			<span class="import-dragover-text" draggable="false">
				<?php esc_html_e( 'Drag file here', 'cost-calculator-builder' ); ?>
			</span>
		</div>

	</div>
</div>
