import VueHtml2pdf from 'vue-html2pdf';
import moment from 'moment';
import groupFieldsMixin from '../../../mixins/group-fields.mixin';

export default {
  data() {
    return {
      formFields: this.$store.getters.getFormFields,
      download: false,
    };
  },
  mixins: [groupFieldsMixin],
  props: ['order', 'invoiceDetail', 'invoiceTexts'],

  components: {
    'vue-html2pdf': VueHtml2pdf,
  },

  methods: {
    async beforeDownload({ html2pdf, options, pdfContent }) {
      let conf = options;
      conf.enableLinks = true;
      await html2pdf()
        .set(conf)
        .from(pdfContent)
        .toPdf()
        .get('pdf')
        .output('datauristring')
        .then((pdfAsString) => {
          this.$store.commit('pdfString', pdfAsString.split(',')[1]);
        });
    },
    generateReport(download) {
      this.download = download;
      setTimeout(() => {
        this.$refs.html2Pdf.generatePdf();
      }, 100);
    },
  },

  computed: {
    getText() {
      return JSON.parse(this.invoiceTexts);
    },
    fileFields() {
      return this.order.order_details.filter(
        (field) => field.alias.replace(/\_field_id.*/, '') === 'file_upload'
      );
    },
    invoiceSettings() {
      return JSON.parse(this.invoiceDetail);
    },
    orderMethod() {
      return this.order.paymentMethod === 'no_payments'
        ? 'No Payments'
        : this.order.paymentMethod;
    },
    orderDetails() {
      const list = [];
      const withOptions = ['dropDown', 'radio', 'checkbox', 'toggle', 'range'];
      if (this.order && this.order.order_details.length > 0) {
        this.order.order_details.forEach((detail, index) => {
          const inOption = withOptions.find(
            (wO) => detail.alias.indexOf(wO) !== -1
          );

          if (
            !detail.alias.includes('repeater') &&
            !detail.alias.includes('group')
          ) {
            let obj = {
              alias: detail.alias,
              label: detail.title,
              value: detail.value,
              options: inOption ? detail.options : null,
            };

            if (detail.alias.includes('datePicker_field')) {
              obj.value = detail.options[0].label;
            }

            if (detail.option_unit) {
              obj.option_unit = detail.option_unit;
            }

            if (index === this.order.order_details.length - 1) {
              obj.lastChild = true;
            }

            list.push(obj);
          }

          if (detail.alias.includes('repeater')) {
            let obj = {
              alias: detail.alias,
              groupTitle: detail.groupTitle,
              groupElements: [],
            };

            detail.groupElements.forEach((child, key) => {
              let data = child;
              if (child.alias.includes('datePicker_field')) {
                data.value = child.options[0].label;
              }

              if (child.option_unit) {
                data.option_unit = child.option_unit;
              }

              if (key === detail.groupElements.length - 1) {
                data.lastChild = true;
              }

              obj.groupElements.push(data);
            });

            list.push(obj);
          }
        });
      }

      return list;
    },
    getCurrentDate() {
      return moment().format(this.invoiceSettings.dateFormat);
    },
    orderId() {
      return this.order.id;
    },
    orderTotal() {
      return {
        total: this.order.total,
        currency: this.order.paymentCurrency,
      };
    },
    forFields() {
      if (this.order.form_details.form !== 'Contact Form 7') {
        return this.order.form_details.fields.map((field) => {
          return {
            name: this.getText.contact_form[field.name],
            value: field.value,
          };
        });
      }
      return this.order.form_details.fields;
    },
  },

  template: `
 
    <template>
        <div>
            <vue-html2pdf
            :show-layout="false"
            :float-layout="true"
            :enable-download="download"
            :preview-modal="false"
            filename="order-pdf"
            :pdf-quality="2"
            :manual-pagination="true"
            pdf-format="a4"
            pdf-orientation="portrait"
            pdf-content-width="800px"
            @beforeDownload="beforeDownload($event)"
            ref="html2Pdf"
            >
                <section slot="pdf-content">
                    <div class="ccb-invoice">
                        <div class="ccb-invoice-container">
                            <div class="ccb-invoice-header">
                                <div class="ccb-invoice-logo">
                                    <span v-if="!this.invoiceSettings.companyLogo">{{ this.invoiceSettings.companyName }}</span>
                                    <img v-if="this.invoiceSettings.companyLogo" :src="this.invoiceSettings.companyLogo" alt="Invoice logo">
                                </div>
                                <div class="ccb-invoice-date">
                                    <span>{{ this.getCurrentDate }}</span>
                                </div>
                            </div>
                            <div class="ccb-invoice-company">
                                <span>
                                    {{ this.invoiceSettings.companyInfo }}
                                </span>
                            </div>
                            <div class="ccb-invoice-table">
                                <div class="ccb-invoice-table__header">
                                    <span>{{ getText.Order }} № </span>
                                    <span>{{ orderId }}</span>
                                </div>
                                <div class="ccb-invoice-table__body">
                                    <div class="ccb-invoice-table__summary">
                                        <span class="ccb-invoice-table__title">{{ getText.total_title }}</span>
                                        <div class="calc-subtotal-list-header" style="margin-top: 10px;">
                                            <span class="calc-subtotal-list-header__name">{{ getText.total_header.name }}</span>
                                            <span class="calc-subtotal-list-header__value">Total</span>
                                        </div>
                                        <ul>
                                          <template v-for="item in orderDetails" >
                                            <template v-if="!item.alias.includes('repeater')">
                                              <li :class="{ 'break-border': item.lastChild }">
                                                <span class="ccb-invoice-row" :class="{ 'break': item.options || item.option_unit }">
                                                    <span class="ccb-invoice-row-label">{{ item.label }}</span>
                                                    <span class="ccb-invoice-row-value">{{ item.value }}</span>
                                                </span>

                                                <span class="ccb-invoice-row ccb-invoice-sub-item" v-if="item.option_unit">
                                                    <span class="ccb-invoice-row-unit">{{ item.option_unit }}</span>
                                                </span>

                                                <span v-for="(subItem, index) in item.options" class="ccb-invoice-row ccb-invoice-sub-item" :class="{ 'break-border' : item.options.length - 1 === index }">
                                                    <span class="ccb-invoice-sub-item-label">{{ subItem.label }}</span>
                                                    <span class="ccb-invoice-sub-value">{{ subItem.converted ? subItem.converted : subItem.value }}</span>
                                                </span>
                                              </li>
                                            </template>
                                            <template v-if="item.alias.includes('repeater')">
                                              <template>
                                                <span class="ccb-invoice-group-title">{{ item.groupTitle }}</span>
                                                <li v-for="(innerField) in item.groupElements" :class="{ 'break-border': item.lastChild }">
                                                    <div class="ccb-invoice-group-wrapper">
                                                        <span class="ccb-invoice-row" :class="{ 'break': innerField.options || innerField.option_unit }">
                                                            <span class="ccb-invoice-row-label">{{ innerField.title }}</span>
                                                            <span class="ccb-invoice-row-value">{{ innerField.value }}</span>
                                                        </span>

                                                        <span class="ccb-invoice-row ccb-invoice-sub-item" v-if="innerField.option_unit">
                                                            <span class="ccb-invoice-row-unit">{{ innerField.option_unit }}</span>
                                                        </span>

                                                        <span v-for="(childSubItem, key) in innerField.options" class="ccb-invoice-row ccb-invoice-sub-item break-border" v-if="['checkbox', 'checkbox_with_img', 'toggle'].includes(innerField.alias.replace(/\\_field_id.*/,''))" :class="{ 'break-border' : innerField.options.length -1 == key }">
                                                            <span class="ccb-invoice-sub-item-label">{{ childSubItem.label }}</span>
                                                            <span class="ccb-invoice-sub-value">{{ childSubItem.converted ? childSubItem.converted : childSubItem.value }}</span>
                                                        </span>
                                                    </div>
                                                </li>
                                              </template>
                                            </template>
                                          </template>
                                           
                                        </ul>
                                        <ul class="ccb-invoice-files">
                                            <li v-for="fileField in fileFields">
                                                <span class="ccb-invoice-file" v-if="file.hasOwnProperty('file') && file.file.length > 0" v-for="file in fileField.options">
                                                    <a :href="file.url" :download="file.file.split('/').pop()">
                                                        <i class="ccb-icon-Path-3494"></i>
                                                        <span class="ccb-invoice-title">{{ file.file.split('/').pop() }}</span>
                                                    </a>
                                                </span>
                                            </li>
                                        </ul>
                                        <span class="ccb-invoice-table__total">
                                            <span>{{ getText.total }}: </span>
                                            <span>{{ orderTotal.currency }} {{ orderTotal.total }}</span>
                                        </span>
                                        <span class="ccb-invoice-table__payment">
                                            <span>{{ getText.payment_method }}:</span>
                                            <span>{{ orderMethod }}</span>
                                        </span>
                                    </div>
                                    <div class="ccb-invoice-table__contact">
                                        <span class="ccb-invoice-table__title">{{ getText.contact_title }}</span>
                                        <ul>
                                           <li v-for="formItem in forFields">
                                                <span>{{ formItem.name }}</span>
                                                <span>{{ formItem.value }}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </vue-html2pdf>
        </div>
    </template>

    `,
};
