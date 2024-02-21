jQuery(document).ready(function ($) {

	var modal = $('#WelcomeModal');
	var modalBtn = $('#WelcomeModalBtn');
	modalBtn.on('click', openModal);
	$('#welcome_new_form').on('click', useTemplate);
	$(window).on('click', outsideClick);

	function useTemplate() {
		$.ajax({
			url: window.ajaxurl,
			method: 'GET',
			data: {
				action: 'calc_create_id',
				nonce: window.ccb_nonces.ccb_create_id
			},
			success: function (data) {
				document.location = document.location.href + "&action=edit&id=" + data.id;
			},
			error: function (xhr, status, error) {
				console.log(error);
			}
		});
	}

	function openModal() {
		modal.css('display', 'block');
	}

	function outsideClick(e) {
		if ($(e.target).is(modal)) {
			modal.css('display', 'none');
		}
	}
});