import parser from '@plugins/parser';
import formPayment from './form-payment';
import fieldsMixin from '../fields/fieldsMixin';
import Helpers from '../../../utils/helpers';
import PaymentHelper from '../../../utils/payments';

import $ from 'jquery';

export default {
  mixins: [fieldsMixin],
  components: {
    'form-payments': formPayment,
  },
  data: () => ({
    nonces: window.ccb_nonces,
    initOnce: true,
    close: false,
    allowSend: true,
    $current: null,
    stripe: false,
    redirectData: {},
    errorCaptcha: false,
    errorMessage: false,
    successMessage: false,
    checkTermsLabel: '',
  }),

  created() {
    this.cleanFormData();
    this.checkTermsLabel = this.randomID();
  },

  mounted() {
    window.calcForm = true;
    setTimeout(() => {
      this.$current = this.$store.getters.getCurrent;
      this.initCaptcha();
      this.$nextTick(() => {});
    }, 500);
  },

  computed: {
    getPaymentAfterFormulas() {
      return (type) => {
        const getters = this.$store.getters;
        const settings = this.getSettings;
        const formulaList = getters.getFormula;
        const hiddenFormulaAliases = Object.values(getters.getCalcStore)
          .filter((f) => f.alias.includes('total') && f.hidden)
          .map((f) => f.alias);

        const formFormulas = settings[type].formulas;
        let formulas = formulaList || [];

        const fieldFromStore = Object.values(getters.getCalcStore);
        const repeaterFields = fieldFromStore.filter((f) =>
          f.alias.includes('repeater')
        );

        formulas = [...formulas, ...repeaterFields];
        if (formulas?.length) {
          if (!formFormulas?.length) return [formulas[0]];

          const result = [];
          for (const ff of formFormulas) {
            const foundForm = formulas.find((f) => f.alias === ff.alias);
            if (foundForm && !hiddenFormulaAliases.includes(foundForm.alias)) {
              const cloned = JSON.parse(JSON.stringify(foundForm));
              if (cloned?.alias) {
                if (cloned.alias?.includes('repeater')) {
                  delete cloned.groupElements;
                }
                result.push(cloned);
              }
            }
          }

          if (result.length) return result;
          return [formulas[0]];
        }

        return [];
      };
    },

    formulas() {
      return this.formData?.formulas;
    },

    translations() {
      return this.$store.getters.getTranslations;
    },

    appearance() {
      return this.$store.getters.getAppearance;
    },

    btnStyles() {
      let result = {};
      if (Object.keys(this.appearance).length === 0) return result;

      const btnAppearance = this.getElementAppearanceStyleByPath(
        this.appearance,
        'elements.primary_button.data'
      );
      result['padding'] = [0, btnAppearance['field_side_indents']].join('px ');

      Object.keys(btnAppearance).forEach((key) => {
        if (key === 'background') {
          result = { ...result, ...btnAppearance[key] };
        } else if (key === 'shadow') {
          result['box-shadow'] = btnAppearance[key];
        } else {
          result[key] = btnAppearance[key];
        }
      });

      return result;
    },

    orderId: {
      get() {
        return this.$store.getters.getOrderId;
      },

      set(id) {
        this.$store.commit('setOrderId', id);
      },
    },

    getHideCalc: {
      get() {
        return this.$store.getters.getHideCalc;
      },

      set(val) {
        this.$store.commit('updateHideCalc', val);
      },
    },

    loader: {
      get() {
        return this.$store.getters.getLoader;
      },
      set(val) {
        this.$store.commit('setLoader', val);
      },
    },

    showPayments: {
      get() {
        return this.$store.getters.getShowPayments;
      },
      set(val) {
        this.$store.commit('setShowPayments', val);
      },
    },

    getSettings() {
      return this.$store.getters.getSettings;
    },

    getStripeSettings() {
      return this.getSettings
        ? this.getSettings?.payment_gateway?.cards?.card_payments?.stripe
        : {};
    },

    getTwoCheckoutSettings() {
      return this.getSettings
        ? this.getSettings?.payment_gateway?.cards?.card_payments?.twoCheckout
        : {};
    },

    getRazorpaySettings() {
      return this.getSettings
        ? this.getSettings?.payment_gateway?.cards?.card_payments?.razorpay
        : {};
    },

    formData() {
      return this.getSettings.formFields;
    },

    sendFields() {
      return Object.values(this.getSettings.sendFormFields);
    },

    requires() {
      return Object.values(this.getSettings.sendFormRequires);
    },

    open: {
      get() {
        const openStatus = this.$store.getters.getOpen;
        if (!openStatus) {
          this.getStep = '';
          this.noticeData = {};
        }

        return openStatus;
      },

      set(val) {
        this.$store.dispatch('updateOpenAction', val);
      },
    },
  },

  methods: {
    filterHiddenTotals() {
      return this.$store.getters.getFinalSummaryList;
    },

    parseSubtotal(fields, type) {
      const exceptions = ['total', 'html', 'line'];
      if (type === 'text') {
        let subtotal = '';
        Array.from(fields).forEach((element) => {
          const fieldName = element.alias.replace(/\_field_id.*/, '');

          if (!exceptions.includes(fieldName) && element.hidden !== true) {
            if (fieldName === 'file_upload' && !element.allowPrice) {
              const files = element.options?.value?.map((f) => f.name) || [
                element.option_unit,
              ];
              subtotal += `${element.label} ( ${files?.join(', ')} )`;
            } else {
              if (
                element.slideValue !== undefined &&
                element.unit !== undefined &&
                element.unit > 0 &&
                element.unit !== 1
              ) {
                subtotal += `${element.label} ( ${element.slideValue} x ${element.unit} )`;
              } else {
                subtotal += `${element.label}`;
              }

              if (element.extra) subtotal += ` ${element.extra}`;
              subtotal += ` ${element.converted}` + '\n';
            }
          }
        });

        return subtotal;
      } else if (type === 'array') {
        const result = [];
        fields.forEach((item) => {
          const fieldName = item.alias.replace(/\_field_id.*/, '');

          if (!exceptions.includes(fieldName) && item.hidden !== true) {
            const res = {
              alias: item.alias,
              title: item.label,
              value: item.converted,
            };

            if (fieldName === 'file_upload' && !item.allowPrice) {
              res.value = item.option_unit;
            } else {
              if (item.checked || fieldName === 'text') {
                if (fieldName === 'datePicker' && true === item.day_price) {
                  res.value = item.value;
                  res.day_price = item.day_price;
                  res.convertedPrice = item.convertedPrice;
                }

                if (item.hasOwnProperty('options') && item.options.length > 0) {
                  res.options = item.options.map((option) => ({
                    label: option.label,
                    value: option.value,
                    converted: option.converted,
                  }));
                }

                if (item.summary_view) {
                  res.summary_value = item.summary_view;
                  res.summary_view = item.summary_view;
                }

                if (item.option_unit) {
                  res.option_unit = item.option_unit;
                }

                result.push(res);
              }
            }
          }
        });
        return result;
      }
    },

    showDemoNotice(buttonObj) {
      const demoModeDiv = this.getDemoModeNotice();
      buttonObj.parentNode.parentNode.after(demoModeDiv);
    },

    async sendData(event) {
      /** IF demo or live site ( demonstration only ) **/
      if (this.$store.getters.getIsLiveDemoLocation) {
        const demoModeDiv = this.getDemoModeNotice();
        event.target.parentNode.parentNode.after(demoModeDiv);
        return;
      }
      /** END| IF demo or live site ( demonstration only ) **/

      const vm = this;
      const captcha = this.getSettings.recaptcha;
      let access = true;
      let ccb_recaptcha = '';
      let captcha_access = true;

      if (typeof window.grecaptcha !== 'undefined' && captcha.enable) {
        if (captcha.type === 'v2') {
          Array.prototype.forEach.call(
            document.querySelectorAll('.g-rec'),
            (element) => {
              const id = element.getAttribute('id');
              const widgetId = parseInt(element.getAttribute('data-widget_id'));
              if (id === this.getSettings['calc_id'])
                ccb_recaptcha = window.grecaptcha.getResponse(widgetId);

              window.grecaptcha.reset($(this).data('widget_id'));
            }
          );

          if (!ccb_recaptcha) {
            this.errorCaptcha = true;
            this.successMessage = false;
            return;
          }
        } else if (captcha.type === 'v3') {
          captcha_access = false;
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(captcha.v3.siteKey, { action: 'submit' })
              .then((token) => {
                captcha.token = token;
                captcha_access = true;
              });
          });
        }
      }

      this.formRequiredFields = [];
      const requiredFields =
        this.$store.getters.getSettings.texts?.form_fields || {};

      const sendFields = JSON.parse(JSON.stringify(vm.sendFields));
      vm.sendFields.forEach((element, index) => {
        const key = `${element.name}_field`;
        if (element.required && !(element.value.length > 0)) {
          vm.requires[index].required = true;
          access = false;

          const message = requiredFields[key];
          this.formRequiredFields.push({ key, message });
        } else {
          vm.requires[index].required = false;
        }
      });

      if (this.formData.accessTermsEmail) {
        if (!this.formData.terms_and_conditions.checkbox) {
          access = false;
          this.formRequiredFields.push({
            key: 'terms_and_conditions_field',
            message: requiredFields['terms_and_conditions_field'],
          });
        }
      }

      let idx;
      const email = vm.sendFields.find((f, i) => {
        if (f.name === 'email') {
          idx = i;
          return f;
        }
      });

      if (access && !this.isValidEmail(email.value)) {
        access = false;
        vm.sendFields[idx].required = true;
        this.formRequiredFields.push({
          key: 'email_field',
          message: requiredFields.email_format,
        });
      }

      if (access) {
        let interval = setInterval(() => {
          if (captcha_access) {
            if (
              !this.formData.adminEmailAddress ||
              !this.formData.emailSubject
            ) {
              this.getStep = 'notice';
              const link =
                'https://docs.stylemixthemes.com/cost-calculator-builder/pro-plugin-features/send-form';
              this.noticeData = {
                type: 'error',
                title: 'Error: settings missing!',
                description: `Please <a href="${link}" target="_blank">setup</a> <span style="font-weight: 700">Contact Form</span> in "${this.$store.getters.getSettings.title}"`,
              };
              clearInterval(interval);
              return false;
            }

            const getters = this.$store.getters;
            const mailDescriptions = getters.getSettings.general
              .hide_empty_for_orders_pdf_emails
              ? getters.getDescriptions('showZero')
              : getters.getDescriptions();

            let dataDescriptions = [];
            mailDescriptions.forEach((el) => {
              if (el.alias.includes('repeater') && el.groupElements.length) {
                let group = {
                  alias: el.alias,
                  groupTitle: el.label,
                  groupElements: el.groupElements,
                };

                dataDescriptions.push(group);
              } else {
                dataDescriptions.push(el);
              }
            });

            vm.loader = true;
            const totals = this.getFormTotals.map((t) => ({
              title: t.label,
              value: t.converted,
              total: t.total,
            }));

            let data = {
              mainInfo: '',
              descriptions: dataDescriptions,
              subject: this.formData.emailSubject,
              calcTotals: totals,
              action: 'calc_contact_form',
              sendFields: sendFields,
              clientEmail: sendFields[1].value,
              clientName: sendFields[2].value,
              userEmail: this.formData.adminEmailAddress,
              customEmails: this.formData.customEmailAddresses,
              calcId: this.$store.getters.getCalcId,
              showUnit:
                this.$store.getters.getSettings.general.show_option_unit,
              files: this.getAllOrderFiles(),
              nonce: this.nonces.ccb_contact_form,
            };

            this.$store.commit('setIssuedOn', vm.sendFields[0].value);
            if (captcha.enable && captcha.type === 'v3') {
              data.captchaSend = true;
              data.captcha = captcha;
            }

            const orderDescriptions = getters.getSettings.general
              .hide_empty_for_orders_pdf_emails
              ? getters.getDescriptions('showZero')
              : getters.getDescriptions();

            const orderDetails = {
              id: getters.getCalcId,
              calcName: getters.getSettings.title,
              totals: this.getFormTotals,
              converted: this.getConverted,
              total: this.getTotal,
              currency: getters.getSettings.currency.currency,
              orderDetails: this.parseOrderDetails(orderDescriptions),
              formDetails: {
                form: 'Default Contact Form',
                fields: vm.sendFields,
              },
              paymentMethod: 'no_payments', // by default - no_payments
              files: this.getAllOrderFiles(),
            };

            orderDetails.orderDetails =
              this.appendFileFieldsWithoutAddToSummary(orderDetails);

            /** if payment enabled and just one payment enabled, overwrite payment method **/
            if (
              getters.getSettings.formFields.payment &&
              this.formData.paymentMethods.length === 1
            ) {
              orderDetails.paymentMethod = this.formData.paymentMethods[0];
            }

            const invoiceFormFields = vm.sendFields.map((field) => {
              return {
                name: field.name,
                value: field.value,
              };
            });

            this.$store.commit('setFormFields', invoiceFormFields);

            this.$store.dispatch('addOrder', orderDetails).then((response) => {
              this.orderId = response.data.order_id;

              setTimeout(() => {
                vm.errorCaptcha = false;
                vm.errorMessage = false;
                vm.successMessage = true;

                let enabledAll = false;
                const payment_gateway =
                  this.$store.getters.getSettings.payment_gateway;
                for (const payment of this.formData.paymentMethods) {
                  if (payment_gateway[payment]?.enable) {
                    enabledAll = true;
                  } else if (
                    ['stripe', 'razorpay'].includes(payment) &&
                    payment_gateway?.cards?.card_payments[payment].enable
                  ) {
                    enabledAll = true;
                  }
                }

                /** if payment enabled and just one payment enabled, overwrite payment method **/
                if (
                  this.$store.getters.getSettings.formFields.payment &&
                  this.formData.paymentMethods.length > 0 &&
                  enabledAll
                ) {
                  if (
                    this.formData.paymentMethods.length === 1 &&
                    !['stripe', 'razorpay', 'cash_payment'].includes(
                      this.formData.paymentMethods[0]
                    )
                  ) {
                    this.renderPaymentAfterSubmit(
                      this.formData.paymentMethods[0]
                    );
                  } else if (
                    this.formData.paymentMethods.length > 1 ||
                    (this.formData.paymentMethods.length === 1 &&
                      ['stripe', 'razorpay', 'cash_payment'].includes(
                        this.formData.paymentMethods[0]
                      ))
                  ) {
                    this.showPayments = true;
                    vm.loader = false;
                  }
                } else {
                  this.getStep = 'finish';
                  this.$store.commit(
                    'setPaymentType',
                    this.translations.form_no_payment
                  );
                  vm.loader = false;
                }
                data.orderId = this.orderId;

                const response = this.$store.dispatch('sendForm', data);
                response.then((result) => {
                  vm.resetFields();
                  if (!result && !result.success) {
                    this.getStep = 'notice';
                    this.noticeData = {
                      type: 'error',
                      title: result.message
                        ? result.message
                        : 'Something went wrong',
                    };

                    setTimeout(() => {
                      vm.errorCaptcha = true;
                      vm.errorMessage = true;
                      vm.successMessage = false;
                      vm.loader = false;
                    }, 500);
                  }
                });
              }, 500);
            });
            clearInterval(interval);
          }
        });
      } else {
        vm.errorMessage = true;
        vm.errorCaptcha = false;
        vm.successMessage = false;
      }
    },

    /**
     * Add file fields to "orderDetails"
     * if "Show in Grand Total" option is disabled but
     * file/s was loaded in form
     */
    appendFileFieldsWithoutAddToSummary(orderDetails) {
      let descriptions = this.$store.getters.getSettings.general.hide_empty
        ? this.$store.getters.getDescriptions('showZero')
        : this.$store.getters.getDescriptions();

      for (let i in orderDetails.files) {
        let fieldData = descriptions.find((field) => {
          if (
            field.alias === orderDetails.files[i].alias &&
            !orderDetails.files[i].addToSummary
          ) {
            return true;
          }
        });
        let isExist = orderDetails.orderDetails.find((detailField) => {
          if (
            fieldData !== undefined &&
            detailField.alias === fieldData.alias
          ) {
            return true;
          }
        });
        if (
          !isExist &&
          fieldData !== undefined &&
          orderDetails.files[i].files.length > 0
        ) {
          orderDetails.orderDetails.push({
            alias: fieldData.alias,
            title: fieldData.label,
            value: fieldData.value,
            addToSummary: fieldData.addToSummary,
          });
        }
      }

      return orderDetails.orderDetails;
    },

    cleanFormData() {
      this.successMessage = false;
      this.errorMessage = false;
      this.$store.dispatch('updateOpenAction', false);
    },

    createOrder(event) {
      this.loader = true;
      const orderDescriptions = this.$store.getters.getSettings.general
        .hide_empty_for_orders_pdf_emails
        ? this.$store.getters.getDescriptions('showZero')
        : this.$store.getters.getDescriptions();

      const orderDetails = {
        id: this.$store.getters.getCalcId,
        calcName: this.$store.getters.getSettings.title,
        totals: this.getFormTotals,
        converted: this.getConverted,
        currency: this.$store.getters.getSettings.currency.currency,
        orderDetails: this.parseOrderDetails(orderDescriptions),
        total: this.getTotal,
        formDetails: {
          form: 'Contact Form 7',
          fields: event.detail.inputs,
        },
        files: this.getAllOrderFiles(),
      };

      orderDetails.paymentMethod = 'no_payments';
      orderDetails.orderDetails =
        this.appendFileFieldsWithoutAddToSummary(orderDetails);

      /** if payment enabled and just one payment enabled, overwrite payment method **/
      if (
        this.$store.getters.getSettings.formFields.payment &&
        this.formData.paymentMethods.length === 1
      )
        orderDetails.paymentMethod = this.formData.paymentMethods[0];

      this.$store.dispatch('addOrder', orderDetails).then((response) => {
        this.$store.commit('setOrderId', response.data.order_id);

        /** if payment enabled and just one payment enabled, overwrite payment method **/
        if (
          this.$store.getters.getSettings.formFields.payment &&
          this.formData.paymentMethods.length > 0
        ) {
          if (
            this.formData.paymentMethods.length === 1 &&
            !['stripe', 'twoCheckout', 'razorpay'].includes(
              this.formData.paymentMethods[0]
            )
          ) {
            this.renderPaymentAfterSubmit(
              this.formData.paymentMethods[0],
              true
            );
          } else if (
            this.formData.paymentMethods.length > 1 ||
            (this.formData.paymentMethods.length === 1 &&
              ['stripe', 'twoCheckout', 'razorpay'].includes(
                this.formData.paymentMethods[0]
              ))
          ) {
            this.showPayments = true;
            this.loader = false;
            this.hideContactForm();
          }
        } else {
          this.getStep = 'finish';
        }
      });
    },

    /**
     * If send form is - contact form
     * hide form data except message
     * ps: bad pracitce
     */
    hideContactForm() {
      const cf7 = this.$el.getElementsByClassName('ccb-contact-form7');
      if (cf7.length <= 0 && cf7[0].getElementsByTagName('form').length <= 0)
        return;

      const form = cf7[0].getElementsByTagName('form')[0];
      const formRows = [...form.getElementsByTagName('p')];
      formRows.forEach((cfRow) => {
        if (cfRow.style.display !== 'none') {
          cfRow.classList.add('ccb-hidden');
          cfRow.style.display = 'none';
        }
      });
    },

    /**
     * show form data
     * ps: bad pracitce
     */
    showContactForm() {
      if (this.$el.getElementsByClassName('ccb-contact-form7').length <= 0) {
        return;
      }
      if (
        this.$el
          .getElementsByClassName('ccb-contact-form7')[0]
          .getElementsByTagName('form').length <= 0
      ) {
        return;
      }

      let form = this.$el
        .getElementsByClassName('ccb-contact-form7')[0]
        .getElementsByTagName('form')[0];
      let formRows = [...form.getElementsByTagName('p')];
      formRows.forEach((cfRow) => {
        if (cfRow.classList.contains('ccb-hidden')) {
          cfRow.classList.remove('ccb-hidden');
          cfRow.style.display = 'block';
        }
      });

      /** clean message **/
      if (form.getElementsByClassName('wpcf7-response-output').length > 0) {
        form.getElementsByClassName('wpcf7-response-output')[0].innerHtml = '';
        form.getElementsByClassName('wpcf7-response-output')[0].innerText = '';
      }
    },

    toggleOpen() {
      this.getStep = '';
      this.noticeData = {};

      if (this.$store.getters.hasUnusedFields) {
        const [first] = this.$store.getters.getUnusedFields;
        if (first?.alias) this.scrollIntoRequired(first.alias);
        return;
      }

      this.cleanFormData();
      this.showContactForm();
      this.loader = false;

      document.removeEventListener(
        'wpcf7mailsent',
        (event) => {
          if (this.allowSend) {
            this.createOrder(event);
            this.allowSend = false;

            if (event.detail && event.detail.status === 'mail_sent') {
              const { apiResponse } = event.detail;
              this.getStep = 'notice';
              this.noticeData = {
                type: 'success',
                title: apiResponse.message,
              };
            }
          }
        },
        false
      );

      this.open = true;
      this.allowSend = true;

      if (this.formData.contactFormId) {
        let subtotal = this.parseSubtotal(
          this.$store.getters.getDescriptions(),
          'text'
        );
        let text = this.formData.body;

        if (text.indexOf('[ccb-subtotal]') !== -1) {
          let regex = '[ccb-subtotal]';
          text = text.replaceAll(regex, subtotal);
        }

        const formFormulas = this.getSettings.formFields.formulas;
        const formulas = this.$store.getters.getFormula?.filter((f) =>
          formFormulas.map((innerF) => innerF.alias).includes(f.alias)
        );

        let totalText = '';
        formulas.forEach(
          (element) => (totalText += `\n${element.label}: ${element.converted}`)
        );

        const regexPattern = /\[ccb-total(?:-\d+)?\]/g;
        text = text.replaceAll(regexPattern, `${totalText}\n`);

        const $form = this.$current.querySelector('.wpcf7-form');
        let $textarea = $form.querySelector('textarea');

        if ($textarea) $textarea.value = parser(text);
        if (typeof window.wpcf7 !== 'undefined' && this.initOnce) {
          this.initOnce = false;
          if (typeof window.wpcf7?.init === 'function') {
            const forms = document.querySelectorAll('.wpcf7 > form');
            forms.forEach((form) => window.wpcf7.init(form));
          } else {
            $('div.wpcf7 > form').each(function () {
              let $form = $(this);
              window.wpcf7.initForm($form);
              if (window.wpcf7.cached) {
                window.wpcf7.refill($form);
              }
            });
          }
        }
      }

      /** IF demo or live site ( demonstration only ) **/
      if (
        this.$store.getters.getIsLiveDemoLocation &&
        document.querySelector('.wpcf7-submit') !== null
      ) {
        const submitFormBtn = document.querySelector('.wpcf7-submit');
        submitFormBtn.type = 'button';
        submitFormBtn.onclick = () => this.showDemoNotice(submitFormBtn);
        return true;
      }
      /** END| IF demo or live site ( demonstration only ) **/

      setTimeout(() => {
        document.addEventListener(
          'wpcf7mailsent',
          (event) => {
            if (this.allowSend) {
              this.createOrder(event);
              this.allowSend = false;
              if (event.detail && event.detail.status === 'mail_sent') {
                const invoiceForm = {
                  type: 'cf7',
                  fields: event.detail.inputs.map((input) => {
                    return {
                      name: input.name,
                      value: input.value,
                    };
                  }),
                };

                this.$store.commit('setFormFields', invoiceForm);

                if (!this.$store.getters.getSettings.formFields.payment) {
                  this.$store.commit(
                    'setPaymentType',
                    this.translations.form_no_payment
                  );
                }
              }
            }
          },
          false
        );
      }, 2000);
    },

    resetFields() {
      let vm = this;
      vm.sendFields.forEach(function (element) {
        element.value = '';
      });
    },

    initCaptcha() {
      const captcha = this.getSettings.recaptcha || {};
      if (captcha.enable && captcha.v2 && captcha.v3) {
        const selected_captcha = captcha[captcha.type];
        this.renderCaptchaFunc(selected_captcha, captcha.type);
        this.renderCaptchaScript(selected_captcha, captcha.type);
      }
    },

    renderCaptchaFunc(captcha, type) {
      const g_res = this.$current.querySelectorAll('.g-rec');
      if (type === 'v2') {
        window.ccbCaptchaFnc = () => {
          g_res.forEach((element) => {
            let ccb_id = window.grecaptcha.render(element, {
              sitekey: captcha.siteKey,
            });
            element.setAttribute('data-widget_id', ccb_id);
          });
        };
      }
    },

    async renderCaptchaScript(captcha, type) {
      const src_store = {
        v2: 'https://www.google.com/recaptcha/api.js?onload=ccbCaptchaFnc&render=explicit',
        v3: `https://www.google.com/recaptcha/api.js?render=${captcha.siteKey}`,
      };
      const script = document.createElement('script');
      script.src = src_store[type];
      script.setAttribute('defer', '');
      script.setAttribute('async', '');
      const firstScriptTag = document.querySelectorAll('script')[0];
      firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
    },

    renderPaymentAfterSubmit(type, isCForm7 = false) {
      const vm = this;
      const descriptions = this.$store.getters.getDescriptions();
      const data = {
        calcId: this.getSettings.calc_id,
        action: 'ccb_payment',
        method: type,
        invoice: this.orderId,
        order_id: this.orderId,
        calcTotals: this.getFormTotals,
        descriptions: descriptions,
        thousands_separator: this.getSettings.currency.thousands_separator,
        nonce: this.nonces.ccb_payment,
      };

      switch (type) {
        case 'woo_checkout': {
          const descriptions = this.$store.getters.getDescriptions('woo');
          const files = this.getAllOrderFiles(descriptions);
          const params = {
            post_id: window.ajax_window.the_id,
            totals: this.getPaymentAfterFormulas(type),
            files,
            callback: () => {},
          };
          vm.$store.dispatch('applyWoo', params);

          if (!isCForm7) {
            setTimeout(() => {
              this.cleanFormData();
            }, 2000);
          }
          break;
        }
        case 'paypal': {
          data.method = 'paypal';
          this.$store.commit('updateMethodCommit', 'paypal');
          this.$store.dispatch('fetchPayment', data);

          if (!isCForm7) {
            setTimeout(() => {
              this.cleanFormData();
            }, 2000);
          }

          break;
        }
        case 'stripe': {
          if (isCForm7) {
            this.$store.dispatch('updateStripeAction', true);
          }

          vm.loader = false;
          this.stripe = true;

          setTimeout(() => {
            vm.successMessage = false;
          }, 2000);

          break;
        }
        case 'razorpay': {
          data.method = 'razorpay';
          this.activatedRazorpay(data);
          break;
        }
        case 'twoCheckout':
        case 'cash_payment':
        default: {
          data.method = type;
          vm.loader = false;
          break;
        }
      }
    },

    ...Helpers,
    ...PaymentHelper,
  },
};
