<?php
$modal_types = array(
	'preview'   => array(
		'type' => 'preview',
		'path' => CALC_PATH . '/templates/admin/single-calc/modals/modal-preview.php',
	),
	'condition' => array(
		'type' => 'condition',
		'path' => CALC_PATH . '/templates/admin/single-calc/modals/condition.php',
	),
	'history'   => array(
		'type' => 'history',
		'path' => CALC_PATH . '/templates/admin/single-calc/modals/history.php',
	),
);
?>

<div class="ccb-create-calc ccb-condition-container calc-quick-tour-conditions">
	<template v-if="$store.getters.getQuickTourStep !== 'done' && $store.getters.getQuickTourStep !== '.calc-quick-tour-title-box'">
		<div class="ccb-condition-content ccb-custom-scrollbar large" style="overflow: scroll">
			<flow-chart v-if="open" @update="change" :scene.sync="scene" @linkEdit="linkEdit" :height="height"/>
		</div>
		<div class="ccb-conditions-elements-wrapper" :style="{transform: collapse ? 'translateX(100%)' : ''}">
			<div class="ccb-condition-toggle" @click="collapseCondition">
				<i class="ccb-icon-Path-3398" :style="{transform: collapse ? 'rotate(0)' : ''}"></i>
			</div>
			<div class="ccb-condition-elements ccb-custom-scrollbar">
				<div class="ccb-sidebar-header">
					<span class="ccb-default-title large ccb-bold" v-if="getElements.length"><?php esc_html_e( 'Add elements', 'cost-calculator-builder' ); ?></span>
					<span class="ccb-condition-elements-empty" v-else>
						<span class="ccb-default-title large ccb-bold" style="color: #878787"><?php esc_html_e( 'As per current', 'cost-calculator-builder' ); ?></span>
						<span class="ccb-default-title large ccb-bold" style="color: #878787"><?php esc_html_e( 'Nothing will be changed', 'cost-calculator-builder' ); ?></span>
					</span>
				</div>
				<div class="ccb-conditions-items">
					<template v-for="( field, index ) in getElements">
						<div class="ccb-conditions-item" @click.prevent="newNode(field)">
							<span class="ccb-conditions-item-icon">
								<i :class="field.icon"></i>
							</span>
							<span class="ccb-conditions-item-box">
								<span class="ccb-default-title ccb-bold" v-if="field.label && field.label.length">{{ field.label | to-short }}</span>
								<span class="ccb-default-description">{{ field.alias | to-format }}</span>
							</span>
							<span class="ccb-icon-Path-3493 ccb-conditions-item-add" @click.prevent="newNode(field)"></span>
						</div>
					</template>
					<div class="ccb-sidebar-item-empty"></div>
				</div>
			</div>
		</div>
	</template>
	<template v-else>
		<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
		<div class="flowchart-container is-pro-part" style="display: flex; justify-content: center; align-items: center" v-if="$store.getters.getQuickTourStep === 'done' || $store.getters.getQuickTourStep === '.calc-quick-tour-title-box'">
			<single-pro-banner
				link="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=conditions"
				img="<?php echo esc_attr( esc_url( CALC_URL . '/frontend/dist/img/condition-nopro.png' ) ); ?>"
				height="355px"
				video="https://youtu.be/xUwxooRP9Mg"
			/>
		</div>
		<?php else : ?>
			<?php do_action( 'render-condition' ); //phpcs:ignore ?>
		<?php endif; ?>
		<ccb-modal-window>
			<template v-slot:content>
				<?php foreach ( $modal_types as $m_type ) : ?>
					<template v-if="$store.getters.getModalType === '<?php echo esc_attr( $m_type['type'] ); ?>'">
						<?php require $m_type['path']; ?>
					</template>
				<?php endforeach; ?>
			</template>
		</ccb-modal-window>
	</template>
</div>
