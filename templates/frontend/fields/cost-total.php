<?php
/**
 * @file
 * Cost-total component's template
 */
?>


<div :class="[totalField.additionalStyles, 'sub-list-item total']" :id="field.alias" v-show="!field.hidden">
	<span class="sub-item-title">{{ field.label === 'Total' ? '<?php esc_html_e( 'Total', 'cost-calculator-builder' ); ?>' : field.label }}</span>
	<span class="sub-item-value" style="white-space: nowrap">{{ field.converted }}</span>
</div>
