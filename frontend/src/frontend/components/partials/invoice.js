import moment from 'moment';
import sendPdf from './send-pdf';
import groupFieldsMixin from '../../../mixins/group-fields.mixin';

export default {
  data() {
    return {
      formFields: this.$store.getters.getFormFields,
    };
  },
  mixins: [groupFieldsMixin],

  props: [
    'companyName',
    'companyInfo',
    'companyLogo',
    'dateFormat',
    'staticTexts',
    'sendEmailTexts',
    'summaryFields',
    'showAfterPayment',
    'sendPdfFromname',
    'siteLang',
  ],

  components: {
    'send-pdf': sendPdf,
  },

  methods: {
    async sendInvoice(options) {
      const formData = new FormData();
      let data = options;
      data.title = this.pdfName;
      data.html = this.pdfHTML();
      data.calc_id = this.$store.getters.getSettings.calc_id;

      formData.append('action', 'ccb_send_invoice');
      formData.append('nonce', window.ccb_nonces.ccb_send_invoice);
      formData.append('data', JSON.stringify(data));

      const result = await fetch(window.ajax_window.ajax_url, {
        method: 'POST',
        body: formData,
      });

      return await result.json();
    },

    async getInvoice() {
      const invoice = await this.fetchInvoice({
        title: this.pdfName,
        html: this.pdfHTML(),
      });

      this.showInvoice(invoice.base64PDF);
    },

    async fetchInvoice(args) {
      const formData = new FormData();
      let data = {
        html: args.html,
      };

      formData.append('action', 'ccb_get_invoice');
      formData.append('nonce', window.ccb_nonces.ccb_get_invoice);
      formData.append('data', JSON.stringify(data));

      const result = await fetch(window.ajax_window.ajax_url, {
        method: 'POST',
        body: formData,
      });

      return await result.json();
    },

    showInvoice(pdf) {
      let base64 = pdf;
      const blob = this.base64ToBlob(base64, 'application/pdf');
      const url = URL.createObjectURL(blob);
      window.open(url);
    },

    base64ToBlob(base64, type = 'application/octet-stream') {
      const binStr = atob(base64);
      const len = binStr.length;
      const arr = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
      }
      return new Blob([arr], { type: type });
    },

    showSendEmailModal() {
      this.$refs.sendPdf.showModal();
    },

    generateReport() {
      this.getInvoice();
    },

    pdfHTML() {
      let html = this.pdfInvoiceCss;
      html += this.$refs.invoice.outerHTML;
      return html;
    },
  },
  computed: {
    totalSummary() {
      return this.$store.getters.getFinalSummaryList;
    },

    getCorrectFontFamily() {
      let langMap = {
        'en-US': 'Roboto',
        'zh-CN': 'droidsansfallback',
        'zh-TW': 'droidsansfallback',
        'zh-HK': 'droidsansfallback',
        'ko-KR': 'droidsansfallback',
        ary: 'Noto Naskh Arabic',
        ar: 'Noto Naskh Arabic',
      };

      return langMap.hasOwnProperty(this.siteLang)
        ? langMap[this.siteLang]
        : 'Roboto';
    },

    showPayment() {
      if (this.$store.getters.getPaymentType) {
        return (
          this.$store.getters.getPaymentType !==
          this.$store.getters.getTranslations.form_no_payment
        );
      }

      return false;
    },

    pdfInvoiceCss() {
      return `
                <style>
                    .ccb-invoice-company, .ccb-invoice-date, .ccb-invoice-table__header, .ccb-invoice-table__payment span, .ccb-invoice-table__summary ul li .ccb-invoice-row, .ccb-invoice-table__title {
                      letter-spacing: normal;
                      font-weight: 500;
                      font-style: normal;
                    }
                    
                    .ccb-invoice {
                      display: block !important;
                      background: #fff;
                      font-family: ${this.getCorrectFontFamily}, sans-serif;
                      min-width: 700px;
                    }
                    
                    .calc-subtotal-list-header {
                        display: none;
                    }


                    .show-unit .calc-subtotal-list-header {
                      display: flex;
                      padding: 2px 10px;
                      background-color: #999999;
                      width: 94%;
                      justify-content: space-between;
                      color: #fff;
                      margin-left: 10px;
                      margin-bottom: 10px;
                    }
                    
                    .show-unit .ccb-invoice-row__label,
                    .show-unit .ccb-invoice-row__value {
                        font-style: normal !important;
                        font-weight: 700 !important;
                        font-size: 14px !important;
                        line-height: 18px !important;
                    }
                    
                    .show-unit .ccb-invoice-row__sub-label,
                    .show-unit .ccb-invoice-row__sub-value {
                        font-style: normal !important;
                        font-weight: 500 !important;
                        font-size: 12px !important;
                        line-height: 15px !important;
                        color: #000 !important;
                        opacity: 0.7 !important;
                        margin-right: -4px;
                    }
                    .show-unit .ccb-invoice-row__label {
                        width: 49% !important;
                    }
                    
                    .show-unit .ccb-invoice-row__value {
                        width: 49% !important;
                    }
                    
                    
                    .show-unit .ccb-invoice-row__unit {
                        display: inline-block;
                        color: #000 !important;
                        opacity: 0.7 !important;
                        text-align: left;
                        width: auto !important;
                        margin-bottom: 5px;
                    }
                    
                    .show-unit .ccb-invoice-table__summary ul li {
                        border-bottom: 1px dashed #ccc;
                        margin-bottom: 10px;
                    }
                    
                    .show-unit .ccb-invoice-table__summary ul li:last-child {
                        border: none !important;
                    }
                    
                    .show-unit .ccb-invoice-row {
                        margin: 0px !important;
                    }
                    
                    .show-unit .ccb-invoice-sub-item {
                        margin-left: 20px !important;
                    }
                    
                    .show-unit .ccb-invoice-row__sub-label, 
                    .show-unit .ccb-invoice-row__sub-value {
                        width: auto !important;
                        margin-right: 10px !important;
                    }
                    
                    .show-unit .ccb-invoice-table__total {
                        padding-top: 8px;
                        border-top: 1px solid #ccc;
                    }

                    
                    .calc-subtotal-list-header__name,
                    .calc-subtotal-list-header__unit, 
                    .calc-subtotal-list-header__value {
                        font-style: normal;
                        font-weight: 700;
                        font-size: 14px;
                        line-height: 18px;
                        color: #fff;
                    }
                    
                    .calc-subtotal-list-header__name {
                        width: 49%;
                        display: inline-block;
                    }
                    
                    .calc-subtotal-list-header__unit {
                        width: 49%
                    } 
                    .calc-subtotal-list-header__value {
                        width: 50%;
                        display: inline-block;
                        margin: 0;
                        padding: 0;
                    }
                    
                    .calc-subtotal-list-header__value {
                        text-align: right;
                        width: 50%;
                    }
                    
                    .contact .show-unit .calc-subtotal-list-header {
                        width: 98% !important;
                    }
                    
                    .contact .show-unit .calc-subtotal-list-header__name {
                        width: 48% !important;
                    }
                    
                    .contact .show-unit .ccb-invoice-row__label {
                        width: 50% !important;
                    }
                    
                    .ccb-invoice-header {
                        margin-bottom: 20px !important;
                    }
                    
                    .ccb-invoice-company {
                      width: 100%;
                      color: #000;
                      font-size: 14px;
                      font-weight: 500;
                      line-height: 21px;
                      margin-bottom: 30px !important;
                    }
                    
                    .ccb-invoice-logo {
                        width: 50%;
                        display: inline-block;
                    }
                    
                    .ccb-invoice-logo span {
                        font-weight: 500;
                        font-style: normal;
                    }
    
                    .ccb-invoice-logo img {
                      max-width: 50%;
                      max-height: 150px;
                    }
                    
                    .ccb-invoice-date {
                      font-size: 14px;
                      font-weight: 700;
                      width: 49%;
                      display: inline-block;
                      text-align: right;
                    }
                    .ccb-invoice-date span:first-child {
                      margin-right: 10px;
                    }
                    
                    .ccb-invoice-table__header {
                      color: #000;
                      font-size: 20px;
                      font-weight: 700;
                      display: flex;
                      padding: 10px 20px !important;
                      border: 1px solid #000;
                    }
                    .ccb-invoice-table__body {
                      border: 1px solid transparent;
                      border-left-color: #000;
                      border-right-color: #000;
                      border-bottom-color: #000;
                    }
                    
                    .ccb-invoice-table__body.hideForm .ccb-invoice-table__summary {
                      width: 100%;
                      border-right: none;
                    }
                    
                    .ccb-invoice-table__total {
                      font-size: 16px;
                      font-weight: 700;
                      font-style: normal;
                      width: 94%;
                      margin: 10px 20px !important;
                      display: block;
                    }
                    
                    .ccb-invoice-table__total span {
                        width: 50%;
                        display: inline-block;
                    }
                    
                    .ccb-invoice-table__total span:last-child {
                        text-align: right;
                        width: 48%;
                    }
                    
                    .ccb-invoice-table__payment {
                        display: block;
                        width: 94%;
                        margin: 0px 20px !important;
                        margin-bottom: 20px !important;
                    }
                    
                    .ccb-invoice-table__payment div {
                      font-size: 14px;
                      font-weight: 500;
                      width: 50%;
                      display: inline-block;
                    }
                    
                    .ccb-invoice-table__payment div:last-child {
                      width: 48%;
                      text-align: right;
                      font-weight: 700;
                    }
                    
                    .ccb-invoice-table__table span:last-child {
                      width: 49%;
                      text-align: right;
                    }
                    
                 
                    .ccb-invoice-table__title {
                      color: #000;
                      font-size: 20px;
                      font-weight: 700;
                      display: block;
                      margin: 25px 20px !important;
                      width: 90%;
                    }
                    
                    .ccb-invoice-table__summary {
                      width: 55%;
                      border: 1px solid transparent;
                      border-right-color: #000;
                      display: inline-block;
                      min-height: 350px;
                      padding-right: 30px !important;
                    }
    
                   .ccb-invoice-table__summary ul {
                      margin: 0 20px !important;
                      width: 95%;
                      padding: 0;
                      list-style: none;
                   }
                   
                   .ccb-invoice-table__summary ul li .ccb-invoice-row {
                      font-size: 14px;
                      font-weight: 500;
                      display: block;
                      margin-bottom: 10px;
                   }
                   .ccb-invoice-table__summary ul li .ccb-invoice-row span {
                      width: 50%;
                      display: inline-block;
                   }
                   
                   .ccb-invoice-table__summary ul li .ccb-invoice-row span:last-child {
                      width: 48%;
                      text-align: right;
                   }
                   
                    .ccb-invoice-table__summary ul li .ccb-invoice-row.ccb-invoice-sub-item {
                      font-size: 12px;
                      margin-left: 5%;
                      width: 95%;
                    }
                   
                    
                    .ccb-invoice-table__summary ul li:last-child {
                      margin-bottom: 22px !important;
                    }
                    
                    .ccb-invoice-table__summary ul li ul {
                      display: flex;
                      flex-direction: column;
                    }
                    
                    .ccb-invoice-table__contact {
                      width: 44%;
                      display: inline-block;
                      position: absolute;
                    }
                    
                    .ccb-invoice-table__contact ul {
                      padding: 0 !important;
                      list-style: none;
                      width: 273px;
                      margin-left: 20px !important;
                    }
                    
                    .ccb-invoice-table__contact ul li {
                      margin-bottom: 18px !important;
                    }
                    
                    .ccb-invoice-table__contact ul li span {
                      font-size: 12px;
                      font-weight: 700;
                      font-style: normal;
                      display: block;
                    }
                    
                    .ccb-invoice-table__contact ul li span:first-child {
                      text-transform: capitalize;
                    }
                    
                    .ccb-invoice-table__contact ul li span:last-child {
                      font-weight: 500;
                      font-size: 14px;
                    }
                
                </style>
            
            `;
    },
    pdfName() {
      return `${this.$store.getters.getSettings.title}`;
    },

    showUnit() {
      return this.$store.getters.getSettings.general.show_option_unit;
    },
    getText() {
      return JSON.parse(this.staticTexts);
    },
    getFormFields() {
      let data = this.$store.getters.getFormFields;
      if (data.type === 'cf7') {
        return data.fields;
      } else {
        return data.map((field) => {
          return {
            name: this.getText.contact_form[field.name],
            value: field.value,
          };
        });
      }
    },
    getCurrentDate() {
      return moment().format(this.dateFormat);
    },
    getOrderId() {
      return this.$store.getters.getOrderId;
    },
    getSummaryFields() {
      let data = this.$store.getters.getSettings.general
        .hide_empty_for_orders_pdf_emails
        ? this.$store.getters.getDescriptions('showZero')
        : this.$store.getters.getDescriptions();

      const clonedData = JSON.parse(JSON.stringify(data || []));
      return clonedData.map((field) => {
        if (field.alias.includes('file_upload') && !field.allowPrice) {
          field.converted = field.option_unit;
        }
        return field;
      });
    },
  },

  template: `
        <template>
            <div>
                <send-pdf
                    ref="sendPdf"
                    :calc-name="pdfName"
                    :static-texts="sendEmailTexts"
                    :from-name="sendPdfFromname"
                    @send-invoice-action="sendInvoice"
                />
                <div slot="pdf-content" ref="invoice" :class="{'contact': getFormFields.length}">
                    <div class="ccb-invoice" style="display: none" :class="{'show-unit': showUnit}">
                        <div class="ccb-invoice-container">
                            <div class="ccb-invoice-header">
                                <div class="ccb-invoice-logo">
                                    <span v-if="!companyLogo">{{ companyName }}</span>
                                    <img v-if="companyLogo" :src="companyLogo" alt="Invoice logo">
                                </div>
                                <div class="ccb-invoice-date">
                                    <span>{{ this.getCurrentDate }}</span>
                                </div>
                            </div>
                            <div class="ccb-invoice-company">
                                <span>
                                    {{ companyInfo }}
                                </span>
                            </div>
                            <div class="ccb-invoice-table">
                                <div class="ccb-invoice-table__header">
                                    <span>{{ getText.order }}: </span>
                                    <span v-if="getOrderId">{{ getOrderId }}</span>
                                </div>
                                <div class="ccb-invoice-table__body" :class="{hideForm: !getFormFields.length}">
                                    <div class="ccb-invoice-table__summary">
                                        <span class="ccb-invoice-table__title">{{ getText.total_title }}</span>
                                        <div class="calc-subtotal-list-header">
                                            <span class="calc-subtotal-list-header__name">{{ getText.total_header.name }}</span>
                                            <span class="calc-subtotal-list-header__value">{{ getText.total_header.total }}</span>
                                        </div>
                                        <ul>
                                          <template v-for="field in getSummaryFields">
                                            <template v-if="!field.hidden && !field.alias.includes('repeater') && !field.alias.includes('group')">
                                              <li>
                                                  <span class="ccb-invoice-row">
                                                      <span class="ccb-invoice-row__label">{{ field.label }}</span>
                                                      <span v-if="!field.summary_view || field.summary_view === 'show_value'" class="ccb-invoice-row__value">{{ field.converted }}</span>
                                                      <span v-if="field.summary_view !== 'show_value' && field.extraView" class="ccb-invoice-row__value"> {{ field.extraView }} </span>
                                                  </span>
                                                  <span class="ccb-invoice-row ccb-invoice-sub-item" v-if="field.option_unit">
                                                      <span v-if="showUnit" class="ccb-invoice-row__unit">{{ field.option_unit }}</span>
                                                  </span>
                                                  <span v-for="subItem in field.options" class="ccb-invoice-row ccb-invoice-sub-item" v-if="field.options && field.options.length && ['checkbox', 'toggle', 'checkbox_with_img'].includes(field.alias.replace(/\\_field_id.*/,''))">
                                                      <span class="ccb-invoice-row__sub-label">{{ subItem.label }}</span>
                                                      <span class="ccb-invoice-row__sub-value">{{ subItem.converted }}</span>
                                                  </span>
                                              </li>
                                            </template>
                                              
                                            <template v-if="field.alias.includes('repeater') && field.groupElements.length">
                                              <template>
                                                <span class="ccb-invoice-group-title">{{ field.label }}</span>
                                                <li v-for="(innerField) in field.groupElements" class="ccb-invoice-group-row" style="padding-left: 10px;">
                                                  <span class="ccb-invoice-row">
                                                      <span class="ccb-invoice-row__label">{{ innerField.label }}</span>
                                                      <span v-if="!innerField.summary_view || innerField.summary_view === 'show_value'" class="ccb-invoice-row__value">{{ innerField.converted }}</span>
                                                      <span v-if="innerField.summary_view !== 'show_value' && innerField.extraView" class="ccb-invoice-row__value"> {{ innerField.extraView }} </span>
                                                  </span>
                                                  <span class="ccb-invoice-row ccb-invoice-sub-item" v-if="innerField.option_unit">
                                                      <span v-if="showUnit" class="ccb-invoice-row__unit">{{ innerField.option_unit }}</span>
                                                  </span>
                                                  <span v-for="subItem in innerField.options" class="ccb-invoice-row ccb-invoice-sub-item" v-if="innerField.options && innerField.options.length && ['checkbox', 'toggle', 'checkbox_with_img'].includes(innerField.alias.replace(/\\_field_id.*/,''))">
                                                      <span class="ccb-invoice-row__sub-label">{{ subItem.label }}</span>
                                                      <span class="ccb-invoice-row__sub-value">{{ subItem.converted }}</span>
                                                  </span>
                                                </li>
                                              </template>
                                            </template>
                                        </ul>
                                        <span class="ccb-invoice-table__total" v-for="item in totalSummary">
                                            <span>{{ item.title }}: </span>
                                            <span>{{ item.value }}</span>
                                        </span>
                                        <div class="ccb-invoice-table__payment" v-if="showPayment">
                                            <div>{{ getText.payment_method }}</div>
                                            <div>{{ $store.getters.getPaymentType }}</div>
                                        </div>
                                    </div>
                                    <div class="ccb-invoice-table__contact" v-if="getFormFields.length">
                                        <span class="ccb-invoice-table__title">{{ getText.contact_title }}</span>
                                        <ul>
                                            <li v-for="field in getFormFields">
                                                <span>{{ field.name }}:</span>
                                                <span>{{ field.value }}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>
        </template>

    `,
};
