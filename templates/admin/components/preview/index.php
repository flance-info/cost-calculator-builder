<?php
$default_img = CALC_URL . '/frontend/dist/img/default.png';
?>
<preview inline-template :preview="preview_tab">
	<div class="modal-body preview ccb-custom-scrollbar">
		<div :id="getContainerId">
			<div class="calc-appearance-preview-wrapper">
				<div class="calc-preview-mobile ccb-custom-scrollbar" id="calc-preview-mobile" v-if="preview === 'mobile'">
					<div class="calc-preview-mobile__header">
						<div class="calc-preview-mobile__header-attrs">
							<div class="calc-attr-left">
								<span class="calc-attr-time">9:41</span>
							</div>
							<div class="calc-attr-center">
								<span class="calc-attr-camera">
									<img src="<?php echo esc_attr( CALC_URL . '/frontend/dist/img/preview/camera.png' ); ?>" alt="camera">
								</span>
							</div>
							<div class="calc-attr-right">
								<img src="<?php echo esc_attr( CALC_URL . '/frontend/dist/img/preview/battery.png' ); ?>" alt="battery">
								<img src="<?php echo esc_attr( CALC_URL . '/frontend/dist/img/preview/wifi.png' ); ?>" alt="wifi">
								<img src="<?php echo esc_attr( CALC_URL . '/frontend/dist/img/preview/connection.png' ); ?>" alt="connection">
							</div>
						</div>
						<div class="calc-preview-mobile__header-search">
							<span class="calc-attr-search-bar">
								<span>
									yourwebsite.com
								</span>
							</span>
						</div>
					</div>
					<?php require CALC_PATH . '/templates/admin/components/preview/preview-content.php'; ?>
				</div>
				<template v-else>
					<?php require CALC_PATH . '/templates/admin/components/preview/preview-content.php'; ?>
				</template>
			</div>
		</div>
	</div>
</preview>
