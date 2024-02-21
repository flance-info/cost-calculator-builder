export default {
  props: ['selected'],

  methods: {
    exportPdf() {
      this.$emit('export-pdf', this.selected);
    },
    clearDetails() {
      this.$emit('clear-details', null);
    },

    showModalSendEmail() {
      this.$emit('show-modal-pdf', this.selected);
    },
  },

  computed: {
    getSummaryList() {
      const list = [];
      const withOptions = ['dropDown', 'radio', 'checkbox', 'toggle', 'range'];

      if (this.selected && this.selected.order_details.length > 0) {
        this.selected.order_details.forEach((detail) => {
          if (
            !(detail.hasOwnProperty('addToSummary') && !detail.addToSummary)
          ) {
            const inOption = withOptions.find(
              (wO) => detail.alias.indexOf(wO) !== -1
            );
            const alias = detail.alias.replace(/\_field_id.*/, '');
            if (
              !detail.alias.includes('repeater') &&
              !detail.alias.includes('group')
            ) {
              const l = {
                alias: detail.alias,
                label: detail.title,
                value: detail.value,
                options: inOption ? detail.options : null,
              };

              if (detail.option_unit) {
                l.option_unit = detail.option_unit;
              }

              if (
                alias === 'datePicker' &&
                1 === parseInt(detail.day_price) &&
                detail.options.length > 0
              ) {
                l.option_unit_info = detail.options[0].label;
              }

              if (detail.summary_value && +detail.value === 0) {
                l.value = detail.summary_value;
              }

              const rules = [
                'show_label_not_calculable',
                'show_label_calculable',
              ];
              if (
                detail.summary_value &&
                (detail.summary_value === detail.summary_view ||
                  rules.includes(detail.summary_view)) &&
                detail.options?.length > 0
              ) {
                l.value = detail.options[0].label;
              }

              if (
                alias === 'datePicker' &&
                detail.options.length > 0 &&
                1 !== parseInt(detail.day_price)
              ) {
                l.value = detail.options[0].label;
              }

              list.push(l);
            }

            if (detail.alias.includes('repeater')) {
              let group = {
                alias: detail.alias,
                groupTitle: detail.groupTitle,
                groupElements: [],
              };
              detail.groupElements.forEach((child) => {
                const hasOpstions = withOptions.find(
                  (wO) => child.alias.indexOf(wO) !== -1
                );

                const childAlias = child.alias.replace(/\_field_id.*/, '');

                const l = {
                  alias: child.alias,
                  label: child.title,
                  value: child.value,
                  options: hasOpstions ? child.options : null,
                };

                if (child.option_unit) {
                  l.option_unit = child.option_unit;
                }

                if (
                  childAlias === 'datePicker' &&
                  1 === parseInt(child.day_price) &&
                  child.options.length > 0
                ) {
                  l.option_unit_info = child.options[0].label;
                }

                if (child.summary_value && +child.value === 0) {
                  l.value = child.summary_value;
                }

                if (
                  child.summary_value &&
                  child.summary_value === child.summary_view &&
                  child.options?.length > 0
                ) {
                  l.value = child.options[0].label;
                }

                if (
                  childAlias === 'datePicker' &&
                  child.options.length > 0 &&
                  1 !== parseInt(child.day_price)
                ) {
                  l.value = child.options[0].label;
                }
                group.groupElements.push(l);
              });

              list.push(group);
            }
          }
        });
      }

      return list;
    },

    paymentMethod() {
      const pm = this.selected.paymentMethod;
      const rm = this.renderPaymentMethod;

      const methods = {
        no_payments: 'No payment',
        cash_payment: 'Cash payment',
        razorpay: 'Razorpay',
      };
      return methods[pm] ? methods[pm] : rm;
    },

    renderPaymentMethod() {
      return this.selected.paymentMethod;
    },

    fileFields() {
      return this.selected.order_details.filter(
        (field) => field.alias.replace(/\_field_id.*/, '') === 'file_upload'
      );
    },

    formatTotal() {
      let decimalCount = this.selected.num_after_integer
        ? this.selected.num_after_integer
        : 2;
      let decimal = this.selected.decimal_separator
        ? this.selected.decimal_separator
        : '.';
      let thousands = this.selected.thousands_separator
        ? this.selected.thousands_separator
        : ',';

      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = this.selected.total < 0 ? '-' : '';
      let total = parseFloat(this.selected.total);

      let i = parseInt(
        (total = Math.abs(Number(total) || 0).toFixed(decimalCount))
      ).toString();
      let j = i.length > 3 ? i.length % 3 : 0;

      total =
        negativeSign +
        (j ? i.substr(0, j) + thousands : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(total - i)
              .toFixed(decimalCount)
              .slice(2)
          : '');
      return total;
    },

    formFields() {
      const result = this.order.form_details.fields.map((item) => {
        return {
          name: item.name.replace('-', ' '),
          value: item.value,
        };
      });

      return result;
    },

    getTotals() {
      return this.selected?.totals || [];
    },
  },

  filters: {
    'to-short': (value) => {
      if (value.length >= 33) {
        return value.substring(0, 30) + '...';
      }
      return value;
    },
  },

  template: `
		<div class="ccb-table-body--content ccb-custom-scrollbar ccb-allowed" :class="{'no-content': !selected}">
			<div class="ccb-edit-no-content" v-if="!selected">
				<span class="ccb-edit-no-content--label">Nothing to show</span>
				<span class="ccb-edit-no-content--description">Click an order to see the details and edit them.</span>
			</div>
			<div class="ccb-edit-info ccb-allowed" v-else>
				<div class="ccb-edit-header ccb-allowed">
					<span class="ccb-edit-title ccb-allowed">Order № {{ selected.id }}</span>
					<span class="ccb-edit-close" @click.prevent="clearDetails">
						<i class="ccb-icon-close"></i>
					</span>
				</div>
				<div class="calc-subtotal-list-header">
					<span class="calc-subtotal-list-header__name">Name</span>
					<span class="calc-subtotal-list-header__value">Total</span>
				</div>
				<div :class="['ccb-edit-summary ccb-allowed', summary.options || summary.option_unit ? 'options' : '', idx === getSummaryList.length - 1 ? 'break-border' : '']" v-for="(summary, idx) in getSummaryList">
					<template v-if="!summary.alias.includes('repeater')">
                        <div class="ccb-edit-summary-parent ccb-allowed">
                          <span class="ccb-edit-summary-label ccb-allowed">{{ summary.label }}</span>
                          <span class="ccb-edit-summary-value ccb-allowed">{{ summary.value }}</span>
                        </div>
                        <div class="ccb-edit-summary-options ccb-allowed" v-if="summary.option_unit_info">
                          <span class="ccb-options-row ccb-allowed">
                              <span class="ccb-edit-summary-unit ccb-allowed">{{ summary.option_unit_info }}</span>
                          </span>
                        </div>
                        <div class="ccb-edit-summary-options ccb-allowed" v-if="summary.option_unit">
                          <span class="ccb-options-row ccb-allowed">
                              <span class="ccb-edit-summary-unit ccb-allowed">{{ summary.option_unit }}</span>
                          </span>
                        </div>

                        <div class="ccb-edit-summary-options ccb-allowed" v-if="summary.options && summary.options.length && ['checkbox', 'checkbox_with_img', 'toggle'].includes(summary.alias.replace(/\\_field_id.*/,''))">
                          <span class="ccb-options-row ccb-allowed" v-for="(inner, idx) in summary.options" :key="idx">
                              <span class="ccb-edit-summary-label ccb-allowed">{{ inner.label }}</span>
                              <span class="ccb-edit-summary-value ccb-allowed">{{ inner.converted ? inner.converted : inner.value }}</span>
                          </span>
                        </div>
                      
                    </template>
                    <template v-if="summary.alias.includes('repeater')">
                        <div class="ccb-edit-summary-group">
                          <div class="ccb-edit-summary-group__title">{{summary.groupTitle}}</div>
                          <div class="ccb-edit-summary-group__elements" v-for="childElement in summary.groupElements">
                            <div class="ccb-edit-summary-parent ccb-allowed">
                              <span class="ccb-edit-summary-label ccb-allowed">{{ childElement.label }}</span>
                              <span class="ccb-edit-summary-value ccb-allowed">{{ childElement.value }}</span>
                            </div>
                            <div class="ccb-edit-summary-options ccb-allowed" v-if="childElement.option_unit_info">
                              <span class="ccb-options-row ccb-allowed">
                                  <span class="ccb-edit-summary-unit ccb-allowed">{{ childElement.option_unit_info }}</span>
                              </span>
                            </div>
                            <div class="ccb-edit-summary-options ccb-allowed" v-if="childElement.option_unit">
                              <span class="ccb-options-row ccb-allowed">
                                  <span class="ccb-edit-summary-unit ccb-allowed">{{ childElement.option_unit }}</span>
                              </span>
                            </div>
                            <div class="ccb-edit-summary-options ccb-allowed" v-if="childElement.options && childElement.options.length && ['checkbox', 'checkbox_with_img', 'toggle'].includes(childElement.alias.replace(/\\_field_id.*/,''))">
                              <span class="ccb-options-row ccb-allowed" v-for="(inner, idx) in childElement.options" :key="idx">
                                  <span class="ccb-edit-summary-label ccb-allowed">{{ inner.label }}</span>
                                  <span class="ccb-edit-summary-value ccb-allowed">{{ inner.converted ? inner.converted : inner.value }}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      
                    </template>
				</div>
                <div class="ccb-edit-total ccb-allowed" v-if="getTotals.length" v-for="total in getTotals">
					<div class="ccb-edit-total__wrapper">
						<span class="ccb-edit-total-label ccb-allowed">{{ total.label }}</span>
						<span class="ccb-edit-total-value ccb-allowed">{{ total.converted }} </span>
					</div>
				</div>
                <div class="ccb-edit-total ccb-allowed" v-else>
                  <div class="ccb-edit-total__wrapper">
                    <span class="ccb-edit-total-label ccb-allowed">Total</span>
                    <span class="ccb-edit-total-value ccb-allowed">{{ selected.paymentCurrency }} {{ formatTotal }}</span>
                  </div>
                </div>
				<div class="ccb-edit-payment-method ccb-allowed" style="display: flex; flex-direction: column; row-gap: 5px">
					<span class="ccb-edit-payment-method-label ccb-allowed">
						Payment Method: <span class="ccb-edit-pm-type ccb-allowed 1" v-html="selected.paymentMethodType"></span>
					</span>
					<span class="ccb-edit-payment-method-label ccb-allowed">
						Date: <span>{{ selected.date_formatted }}</span>
					</span>
				</div>
				<div class="ccb-edit-file-upload ccb-allowed" v-if="fileFields.length > 0">
					<template v-for="fileField in fileFields">
						<div class="ccb-edit-file-upload-item ccb-allowed" v-if="file.hasOwnProperty('file') && file.file.length > 0" v-for="file in fileField.options">
							<span class="ccb-edit-fl-left ccb-allowed">
								<i class="ccb-icon-Path-3494 ccb-allowed"></i>
								<span class="ccb-edit-fl-left-text-wrapper ccb-allowed">
									<span class="ccb-fl-label ccb-allowed">{{ fileField.title | to-short }}</span>
									<span class="ccb-fl-name ccb-allowed">{{ file.file.split('/').pop() | to-short }}</span>
								</span>
							</span>
							<span class="ccb-edit-fl-right ccb-allowed">
								<a :href="file.url" :download="file.file.split('/').pop()" class="ccb-button ccb-href default ccb-allowed" style="padding: 10px 20px">Download</button>
							</span>
						</div>
					</template>
				</div>
				<div class="ccb-edit-form ccb-allowed">
					<span class="ccb-edit-title ccb-allowed">Contact Information</span>
					<span class="ccb-edit-form-fields ccb-allowed" v-for="field in selected.form_details.fields">
						<span :class="['ccb-edit-form-label ccb-allowed', field.name]">{{ field.name }}:</span>
						<span :class="['ccb-edit-form-value ccb-allowed', field.name]">{{ field.value }}</span>
					</span>
				</div>
				<div class="ccb-edit-pdf-buttons ccb-allowed">
					<div class="ccb-edit-pdf ccb-allowed" @click="exportPdf">
						<i class="ccb-icon-pdf ccb-allowed"></i>
						<span>Export to PDF</span>
					</div>
					<div class="ccb-edit-pdf ccb-allowed" @click="showModalSendEmail">
						<i class="ccb-icon-mail ccb-allowed"></i>
						<span>Email Quote</span>
					</div>
				</div>
			</div>
		</div>`,
};
