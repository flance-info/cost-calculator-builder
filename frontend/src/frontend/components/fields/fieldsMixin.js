import $ from 'jquery';

export default {
  data: () => ({
    formRequiredFields: [],
  }),

  methods: {
    calcToggleAccordion() {},

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
          });
        }
      }

      return orderDetails.orderDetails;
    },

    scrollIntoRequired(alias) {
      const calcId = this.settingsField.calc_id || this.$store.getters.getId;
      const query = `.ccb-wrapper-${calcId} div[data-id="${alias}"]`;
      const offsetTop = $(query).offset().top;

      const offset = offsetTop - $(window).scrollTop();
      if (offset > window.innerHeight || offset < 20) {
        $([document.documentElement, document.body]).animate(
          { scrollTop: offsetTop - 50 },
          500
        );
      }
    },

    clearRequired(key) {
      this.formRequiredFields = this.formRequiredFields.filter(
        (f) => f.key !== key
      );
    },

    isValidEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/;
      return emailRegex.test(email);
    },

    async sendWooData() {
      this.loader = true;
      const orderDetails = this.getOrderDetails;
      orderDetails.paymentMethod = 'no_payments';
      orderDetails.orderDetails =
        this.appendFileFieldsWithoutAddToSummary(orderDetails);

      orderDetails.status = 'pending';

      const response = await this.$store.dispatch('addOrder', orderDetails);
      if (response?.success) {
        this.$store.commit('setOrderId', response.data.order_id);
      }

      this.loader = false;
      return response;
    },
  },

  computed: {
    getOrderDetails() {
      const descriptions = this.$store.getters.getSettings.general
        .hide_empty_for_orders_pdf_emails
        ? this.$store.getters.getDescriptions('showZero')
        : this.$store.getters.getDescriptions();

      return {
        id: this.$store.getters.getCalcId,
        orderId: this.$store.getters.getOrderId,
        calcName: this.$store.getters.getSettings.title,
        total: this.getTotal,
        totals: this.getFormTotals,
        converted: this.getConverted,
        currency: this.$store.getters.getSettings.currency.currency,
        orderDetails: this.parseOrderDetails(descriptions),
        paymentMethod: this.getMethod,
        formDetails: {
          form: 'Default Contact Form',
          fields: this.paymentForm?.sendFields || [],
        },
        files: this.getAllOrderFiles(
          this.$store.getters.getDescriptions('showZero')
        ),
      };
    },

    getConverted() {
      return this.currencyFormat(
        this.getTotal,
        { currency: true },
        this.currencySettings
      );
    },

    getTotal() {
      return this.getFormTotals
        .map((t) => {
          if (!t.total && t.value) {
            return t.value;
          }
          return t.total;
        })
        .reduce((acc, value) => acc + value, 0);
    },

    getRequiredMessage() {
      return (key) => {
        const found = this.formRequiredFields.find((f) => f.key === key);
        if (found) return found.message;
        return false;
      };
    },

    getPaymentFormulas() {
      const formulas = this.formulas;
      const settings = this.settingsField;

      if (typeof formulas === 'undefined') {
        return settings?.woo_checkout?.formulas || [];
      }

      return formulas;
    },

    getFormTotals() {
      const getters = this.$store.getters;
      const formulaList = getters.getFormula;
      const hiddenFormulaAliases = Object.values(getters.getCalcStore)
        .filter((f) => f.alias.includes('total') && f.hidden)
        .map((f) => f.alias);

      const formFormulas = this.getPaymentFormulas || [];
      let formulas = formulaList || [];

      const fieldFromStore = Object.values(getters.getCalcStore);
      const repeaterFields = fieldFromStore.filter((f) =>
        f.alias.includes('repeater')
      );

      formulas = [...formulas, ...repeaterFields].map((f) => {
        if (f.value) f.value = +f.value.toFixed(2);
        if (f.total) f.total = +f.total.toFixed(2);
        return f;
      });

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
    },

    wooProductPrice() {
      const settings = this.settingsField;
      if (settings.woo_products) {
        const wooLinks = settings.woo_products?.meta_links || [];
        const linkList = wooLinks.map((l) => l.calc_field);

        return linkList.includes(this.field.alias)
          ? this.$store.getters.getWooProductPrice
          : null;
      }

      return null;
    },

    currencySettings() {
      return this.settingsField.currency;
    },

    settingsField() {
      return this.$store.getters.getSettings;
    },

    getProStatus() {
      return this.$store.getters.getProActive;
    },

    getPreloaderIdx() {
      const othersData = this.getElementAppearanceStyleByPath(
        this.appearance,
        'desktop.others.data'
      );

      return othersData.calc_preloader || 0;
    },

    calcStore() {
      return this.$store.getters.getCalcStore;
    },

    getAccentColor() {
      const desktopColors = this.getElementAppearanceStyleByPath(
        this.appearance,
        'desktop.colors.data'
      );

      return desktopColors.accent_color || '#00b163';
    },

    appearance() {
      return this.$store.getters.getAppearance;
    },

    fieldsView() {
      return this.getElementAppearanceStyleByPath(
        this.appearance,
        'desktop.others.data'
      );
    },

    checkboxView() {
      const view = this.fieldsView.checkbox_horizontal_view;
      return view === true ? 'ccb-horizontal' : '';
    },

    radioView() {
      const view = this.fieldsView.radio_horizontal_view;
      return view === true ? 'ccb-horizontal' : '';
    },

    toggleView() {
      const view = this.fieldsView.toggle_horizontal_view;
      return view === true ? 'ccb-horizontal' : '';
    },

    getStep: {
      get() {
        return this.$store.getters.getStep;
      },

      set(value) {
        if (value === '') {
          this.open = false;
        }

        if (value === 'finish' && typeof this.resetFields === 'function') {
          this.resetFields();
        }

        this.$store.commit('updateStep', value);
      },
    },

    noticeData: {
      get() {
        return this.$store.getters.getNotices;
      },

      set(noticeData) {
        const getters = this.$store.getters;
        if (noticeData)
          noticeData.image =
            noticeData.type === 'error'
              ? getters.getErrorImg
              : getters.getSuccessImg;
        this.$store.commit('setNotices', noticeData);
      },
    },
  },

  filters: {
    'to-short': (value) => {
      if (value && value.length >= 17) {
        return value.substring(0, 14) + '...';
      }
      return value || '';
    },
  },
};
