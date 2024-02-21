import costProFeatures from './partials/pro-features';
import calcNotice from './partials/calc-notice';
import thankYouPage from './partials/thank-you-page/index';
import invoice from './partials/invoice';
import WooLinks from '../../utils/woo-links';
import Condition from '../../utils/condition';
import Customize from '../../utils/customize';
import Helpers from '../../utils/helpers';
import ToolTip from '../../utils/toolTip';
import fieldsMixin from '../../mixins/fields.mixin';
import totalSummary from './partials/total-summary';
import $ from 'jquery';

String.prototype.replaceAll = function (search, replace) {
  return this.split(search).join(replace);
};

export default {
  mixins: [fieldsMixin],
  props: {
    id: null,
    template: {
      default: '',
    },
    content: {
      default: {},
    },
    custom: 0,
  },

  data() {
    return {
      accordionHeight: '100%',
      currentAccordionHeight: '100%',
      notice: {},
      fields: {},
      formula: '',
      settings: {},
      calc_data: [],
      customs: {},
      calcStore: {},
      conditions: {},
      formulaConst: [],
      demoBoxStyle: false,
      preview_loader: false,
      repeaterFields: [],

      $calc: null,
      tempVal: {},
      valuesStore: {},
    };
  },

  components: {
    'cost-pro-features': costProFeatures,
    'calc-notices': calcNotice,
    'calc-thank-you-page': thankYouPage,
    'calc-invoice': invoice,
    'calc-total-summary': totalSummary,
  },

  computed: {
    getRepeaterTotals() {
      return Object.values(this.calcStore).filter(
        (f) =>
          f.alias.includes('repeater') && (f.enableFormula || f.sumAllAvailable)
      );
    },

    showDemoBoxStyle() {
      let demoSiteUrl = 'https://stylemixthemes.com/cost-calculator/';

      return location.href.indexOf(demoSiteUrl) !== -1;
    },

    hideThankYouPage() {
      if (this.getStep === 'finish') {
        const settings = this.getSettings;
        const type = settings.thankYouPage?.type;
        if (['modal', 'same_page'].includes(type)) {
          if (type === 'modal') {
            this.$store.commit('setThankYouModalOpen', true);
            this.$store.commit('setThankYouModalHide', false);
          }
          return true;
        }

        if (type === 'separate_page' && settings.thankYouPage.page_url) {
          let link = settings.thankYouPage.page_url;
          link =
            link.indexOf('?') !== -1
              ? `${link}&order_id=${this.$store.getters.getOrderId}`
              : `${link}?order_id=${this.$store.getters.getOrderId}`;

          localStorage.setItem('ccb_previous_page', window.location.href);
          this.resetCalc();
          window.location.replace(link);
        }

        if (type === 'custom_page' && settings.thankYouPage.custom_page_link) {
          this.resetCalc();
          window.open(settings.thankYouPage.custom_page_link, '_blank');
        }
      }
      return false;
    },

    hideCalculator() {
      const settings = this.getSettings;
      if (this.getStep === 'finish') {
        return settings.thankYouPage?.type !== 'same_page';
      }
      return true;
    },

    getStep: {
      get() {
        return this.$store.getters.getStep;
      },

      set(value) {
        this.$store.commit('updateStep', value);
      },
    },

    getWooProductName: {
      get() {
        return this.$store.getters.getProductName;
      },

      set(value) {
        this.$store.commit('setProductName', value);
      },
    },

    noticeData: {
      get() {
        return this.$store.getters.getNotices;
      },

      set(noticeData) {
        const { getters } = this.$store;
        if (noticeData)
          noticeData.image =
            noticeData.type === 'error'
              ? getters.getErrorImg
              : getters.getSuccessImg;
        this.$store.commit('setNotices', noticeData);
      },
    },

    appearance() {
      return this.$store.getters.getAppearance;
    },

    boxStyle() {
      const layout = this.getElementAppearanceStyleByPath(
        this.appearance,
        'desktop.layout.data'
      );
      return this.demoBoxStyle
        ? this.demoBoxStyle
        : layout?.box_style || 'vertical';
    },

    getSticky() {
      return this.getSettings.general.sticky;
    },

    getTotalStickyId() {
      if (
        this.boxStyle === 'horizontal' ||
        +window.ajax_window.pro_active !== 1 ||
        this.getSticky === false
      ) {
        if (window.$ccbSticky) window.$ccbSticky.destroy();

        return '';
      }

      if (window.$ccbSticky) window.$ccbSticky.initialize();

      return 'ccb_summary_sticky_' + this.id;
    },

    getSettings() {
      return this.$store.getters.getSettings;
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
        return this.$store.getters.getMainLoader;
      },

      set(val) {
        this.$store.commit('updateMainLoader', val);
      },
    },

    getTotalSummaryFields() {
      const calcStore = Object.assign({}, this.calcStore);
      const { hide_empty } = this.getSettings.general;

      let fields = Object.values(calcStore).filter(
        (field) =>
          !['html', 'line'].includes(field.alias.replace(/\_field_id.*/, ''))
      );

      /** remove zero value fields **/
      if (!hide_empty) {
        fields = fields.filter(
          (field) =>
            field.value !== 0 ||
            (field.hasOwnProperty('summary_value') &&
              field.summary_value !== 0 &&
              field.summary_value.length > 0) ||
            field.alias.includes('repeater')
        );
      }

      let result = fields.filter((f) => f.addToSummary);

      if (this.showUnitInSummary) {
        return this.summaryWithUnits(result);
      } else {
        return result;
      }
    },

    getRepeaterFields() {
      const { hide_empty } = this.getSettings.general;
      return (resultGrouped) => {
        const fields = Object.values(resultGrouped);
        if (!hide_empty) {
          return fields.filter((field) => {
            if (field.alias.includes('timePicker')) {
              return field.converted || field.converted?.length;
            } else {
              return field.value || field.value?.length;
            }
          });
        }

        return fields;
      };
    },

    translations() {
      return this.$store.getters.getTranslations;
    },
  },

  mounted() {
    /** set language **/
    if (this.content.hasOwnProperty('language')) {
      this.$store.commit('setLanguage', this.content.language);
    }

    /** set date format **/
    if (this.content.hasOwnProperty('dateFormat')) {
      this.$store.commit('setDateFormat', this.content.dateFormat);
    }

    /** set translations **/
    if (this.content.hasOwnProperty('translations')) {
      this.$store.commit('setTranslations', this.content.translations);
    }

    /** set default image for drop-down-with-image **/
    if (this.content.hasOwnProperty('default_img')) {
      this.$store.commit('setDefaultImg', this.content.default_img);
    }

    /** set default image for drop-down-with-image **/
    if (this.content.hasOwnProperty('error_img')) {
      this.$store.commit('setErrorImg', this.content.error_img);
    }

    /** set default image for drop-down-with-image **/
    if (this.content.hasOwnProperty('success_img')) {
      this.$store.commit('setSuccessImg', this.content.success_img);
    }

    /** set pro version status **/
    if (this.content.hasOwnProperty('pro_active')) {
      this.$store.commit('setProActive', this.content.pro_active);
    }

    /** set last order data **/
    if (this.content.hasOwnProperty('order_data')) {
      this.$store.commit('setOrderId', this.content.order_data.id);
      this.$store.commit('setLastOrder', this.content.order_data);
      this.getStep = 'finish';
      const settings = JSON.parse(
        JSON.stringify(this.$store.getters.getSettings || {})
      );
      if (settings.thankYouPage) {
        settings.thankYouPage.type = 'same_page';
        this.$store.commit('updateSettings', settings);
      }
    } else {
      localStorage.removeItem('ccb_previous_page');
    }

    if (window.ajax_window.hasOwnProperty('pro_active'))
      this.$store.commit('setProActive', window.ajax_window.pro_active);

    this.init();
    this.initEffects();
    this.initListeners();
    this.initLinks();
  },

  methods: {
    initRepeaters() {
      const fields = this.calc_data.fields;
      for (const field of fields) {
        if (field.alias?.includes('repeater')) {
          if (field.hasOwnProperty('groupElements')) {
            const elementsAlias = field.groupElements.map((f) => f.alias);
            this.repeaterFields.push(...elementsAlias);
          }
        }
      }
    },

    deleteRepeater() {
      if (window.$ccbSticky) {
        window.$ccbSticky.updateSticky();
      }
    },

    parseUnitByCurrency(unit, value, settings) {
      let result;
      if (
        settings.currencyPosition === 'left' ||
        settings.currencyPosition === 'left_with_space'
      ) {
        result = unit + ' x ' + settings.currency + value;
      }

      if (
        settings.currencyPosition === 'right' ||
        settings.currencyPosition === 'right_with_space'
      ) {
        result = unit + ' x ' + value + settings.currency;
      }

      return result;
    },

    summaryWithUnits(fields) {
      return fields.map((item) => {
        let field = item;
        const fieldName = field.alias.replace(/\_field_id.*/, '');

        if (['quantity'].includes(fieldName)) {
          field.break_all = true;
        } else if (['range'].includes(fieldName)) {
          field.break_all = true;
        } else if (['multi_range'].includes(fieldName)) {
          field.break_all = true;
        } else if (
          [
            'radio',
            'dropDown',
            'dropDown_with_img',
            'radio_with_img',
            '',
          ].includes(fieldName)
        ) {
          if (field.summary_view === 'show_value') {
            field.option_unit = field.extraView;
          }
        } else if (['file_upload'].includes(fieldName)) {
          if (field.options.value.length) {
            if (field.allowPrice && field.calculatePerEach) {
              let price = field.price;

              if (field.allowCurrency) {
                price = this.currencyFormat(
                  field.price,
                  { currency: true },
                  {
                    ...this.currencySettings,
                  }
                );
              }
              field.option_unit = `${field.options.value.length} ${this.translations.files} x ${price}`;
            } else {
              field.option_unit = `${field.options.value.length} ${this.translations.files}`;
            }
          }
        }

        return field;
      });
    },

    parseTotalsForInvoice() {
      setTimeout(() => {
        let totalsWrapper = this.$refs.calcTotals;
        if (!totalsWrapper) return;

        let totals = totalsWrapper.querySelectorAll('.sub-list-item');
        let finalSummaryList = [];
        totals.forEach((item) => {
          let title = item.querySelector('.sub-item-title').innerHTML;
          let value = item.querySelector('.sub-item-value').innerHTML;
          let data = {
            title,
            value,
          };

          if (!item.getAttribute('style')) {
            finalSummaryList.push(data);
          } else if (
            item.getAttribute('style') &&
            !item.getAttribute('style').includes('display: none;')
          ) {
            finalSummaryList.push(data);
          }
        });

        this.$store.commit('setFinalSummaryList', finalSummaryList);
      }, 600);
    },

    getInvoice() {
      if (this.$refs.invoice) {
        this.$refs.invoice.generateReport();
      }
    },

    showSendPdf() {
      if (this.$refs.invoice) {
        this.$refs.invoice.showSendEmailModal();
      }
    },

    changeBoxStyle(key) {
      this.demoBoxStyle = key;
    },

    resetCalc() {
      this.getStep = '';
      window.ccbResetOrderId = true;

      this.apply();
      this.triggerCondition();
      this.$store.commit('setFormFields', []);
    },

    toggleAccordion() {
      if (this.$refs.calcAccordion) {
        if (this.currentAccordionHeight === '0px') {
          this.currentAccordionHeight = '100%';
        } else {
          this.currentAccordionHeight = '0px';
        }
      }
    },

    initTotalSummaryAccordion() {
      if (this.$refs.calcAccordionToggle && this.$refs.calcAccordion) {
        setTimeout(
          () =>
            (this.accordionHeight =
              this.$refs.calcAccordion.scrollHeight + 'px'),
          0
        );
      }
    },

    init() {
      const custom = !!parseInt(this.custom);
      this.initTotalSummaryAccordion(true);

      if (this.$refs.calc && !custom) {
        this.calc_data = window['calc_data_' + this.$refs.calc.dataset.calcId];
      } else {
        this.calc_data = this.content;
      }

      let fields = [];
      this.calc_data.fields.forEach((el) => {
        if (el.alias && el.alias.includes('group') && el.groupElements) {
          fields.push(el);
          let innerFields = el.groupElements.map((field) => {
            if (!field.alias.includes('total_field')) {
              field.group_id = el.alias;
            }

            field.hidden = el.hidden;

            return field;
          });

          fields = [...fields, ...innerFields];
        } else {
          fields.push(el);
        }
      });

      this.calc_data.fields = fields;

      this.$store.commit('updateCalcId', this.id);

      if (
        typeof this.calc_data !== 'undefined' &&
        this.calc_data &&
        this.calc_data.hasOwnProperty('fields')
      ) {
        if (
          this.calc_data.hasOwnProperty('appearance') &&
          this.calc_data.appearance
        ) {
          this.$store.commit('setAppearance', this.calc_data.appearance);
        }

        if (
          this.calc_data.hasOwnProperty('formula') &&
          this.calc_data.formula
        ) {
          this.formulaConst = this.calc_data.formula;
        }

        if (this.calc_data.conditions) {
          this.conditions = this.calc_data.conditions;
        }

        if (this.calc_data.settings) {
          this.settings = this.calc_data.settings;
          this.$store.commit('updateSettings', this.settings);
          this.currentAccordionHeight = !this.settings.general
            ?.show_details_accordion
            ? '0px'
            : this.currentAccordionHeight;
        }

        this.initRepeaters();
        this.initCalcField();
        this.apply();
      }

      if (this.$refs.calc) {
        this.$store.dispatch('updateCurrentAction', this.$refs.calc);
      }
    },

    initCalcField() {
      if (Array.isArray(this.calc_data.fields)) {
        let isFormOrPaymentEnabled = this.checkIsPaymentOrFormEnabled(
          this.settings
        );

        /** make not required if no submit button */
        if (false === isFormOrPaymentEnabled) {
          this.calc_data.fields = this.calc_data.fields.map((field) => {
            field.required = false;
            return { ...field };
          });
        }

        this.calc_data.fields
          .filter((field) => field.alias)
          .forEach((field) => {
            this.fields[field.alias] = this.initField(field);
          });
      }
    },

    /**
     * Fields with hidden option enabled
     * add to condition blocked to calculate
     * correct total value
     */
    addToBlockedHiddenFields() {
      Object.values(this.calcStore).forEach((calc) => {
        if (this.fields[calc.alias].hidden === true) {
          this.$store.commit('addConditionBlocked', calc);
        }
      });
    },

    apply() {
      this.initFields();
      this.initializeFormula();
      this.readyAvailable();
      this.clearFormula();
      this.calculate();

      this.addToBlockedHiddenFields();

      this.$store.commit('updateFormula', this.formula);
      this.$store.commit('updateSubtotal', Object.values(this.calcStore));
      this.$store.dispatch('updateOpenAction', false);

      /** nullify payment and form values **/
      this.$store.commit('setShowMessage', false);
      this.$store.commit('setShowPayments', false);
      this.$store.dispatch('updateMethodAction', '');
      this.$store.commit('setGlobalFields', this.fields);

      setTimeout(() => {
        this.ccbInitSticky();
        this.loader = false;
        window.ccbLoaded = true;
      }, 1000);
    },

    /** common change for all fields **/
    change(value, alias, label, fields) {
      if (!this.fields[alias]) return;

      this.parseTotalsForInvoice();

      /** update wc quantity value, if field have meta link on quantity*/
      if (
        'quantity' === this.fields[alias]['wcProductMetaLink'] &&
        this.settings.woo_products?.enable &&
        this.settings.woo_products?.is_product_page
      ) {
        const stock = this.settings.woo_products.current_product.stock_quantity;
        if (
          null !== stock &&
          (parseFloat(value) > parseFloat(stock) || value < 1)
        ) {
          value = parseFloat(value) > parseFloat(stock) ? parseFloat(stock) : 1;
        }

        this.setWoocommerceQuantity(
          value,
          this.settings.woo_products.current_product
        );
      }

      this.fields[alias]['checked'] = true;
      this.initTotalSummaryAccordion();
      if (alias.includes('date')) {
        this.fields[alias].value = value.value;
        this.fields[alias].viewValue = value.viewValue;
      } else if (alias.includes('timePicker')) {
        this.fields[alias].value = value;
        this.fields[alias].viewValue = value;
      } else if (alias.includes('file_upload')) {
        this.fields[alias].value = value.price;
        this.fields[alias].files = value.files;
      } else if (alias.includes('repeater') || alias.includes('group')) {
        this.fields[alias].value = value;
        this.fields[alias].resultGrouped = fields;
      } else {
        this.fields[alias].value = value;
        if (typeof label !== 'undefined') this.fields[alias].extraLabel = label;
      }

      this.apply();
    },

    ccbInitSticky() {
      const $selector = `#ccb_summary_sticky_${this.id}`;
      const $sticky = document.querySelector($selector);
      if (
        $sticky &&
        !window.$ccbStickyRendered &&
        +window.ajax_window.pro_active === 1
      ) {
        window.$ccbStickyRendered = true;
        window.$ccbSticky = new window.StickySidebar($selector, {
          topSpacing: 20,
          bottomSpacing: 20,
          containerSelector: '.calc-container',
          innerWrapperSelector: '.calc-subtotal-wrapper',
        });
      }
    },

    readyAvailable() {
      if (this.formula && this.formula.length) {
        this.formula = Object.assign(
          [],
          this.parseFormula(this.formula, Object.values(this.calcStore))
        );
        this.formula.sort((a, b) => a.id - b.id);
      }
    },

    initializeFormula() {
      this.formula = JSON.parse(JSON.stringify(this.formulaConst));
      this.formula.forEach((item) => {
        item.formula = item.formula.replace(/\r?\n|\r/g, ' ').trim();
        this.formula.forEach((itemInner) => {
          if (
            item.formula.indexOf(itemInner.alias) !== -1 &&
            itemInner.alias.indexOf('total') === -1
          ) {
            let replacer = new RegExp('\\b' + itemInner.alias + '\\b', 'g');
            item.formula = item.formula.replace(replacer, itemInner.formula);
          }
        });
      });
    },

    parseFormula(formula, fields) {
      formula.forEach((item) => {
        fields.forEach((field) => {
          const replacer = new RegExp('\\b' + field.alias + '\\b', 'g');
          let value = field.value;

          if (field?.originalHidden || field.hidden) {
            value = 0;
          }

          if (field?.alias && field.alias.includes('repeater')) {
            if (field.enableFormula || field.sumAllAvailable) {
              item.formula = item.formula.replace(replacer, value);
            } else {
              item.formula = item.formula.replace(replacer, 0);
            }
          } else if (field.alias.indexOf('total') === -1) {
            item.formula = item.formula.replace(replacer, value);
          }
        });
      });
      return formula;
    },

    clone(data) {
      return JSON.parse(JSON.stringify(data));
    },

    clearFormula() {
      const totals = {};
      const totalWithTotals = [];

      this.formula.map((element) => {
        /** if have correct formula data ( no total field in formula ) **/
        if (element.formula.includes('total_field_id_') === false) {
          /** get all totals without totals inside **/
          totals[element.alias] = { value: element.formula };
        } else {
          /** get all totals with total fields inside **/
          totalWithTotals.push(element.alias);
        }
      });

      /** set correct data for totals formula which have total fields inside **/
      totalWithTotals.forEach((totalElementAliasWithTotalInside) => {
        let totalElementWithTotalInside = this.formula.find(
          (formulaItem) =>
            formulaItem.alias === totalElementAliasWithTotalInside
        );
        let newFormula = totalElementWithTotalInside.formula;

        /** replace totals which have just fields data inside **/
        Object.keys(totals).forEach((totalAliasWithFullFormula) => {
          if (newFormula.includes('(' + totalAliasWithFullFormula + ')')) {
            newFormula = newFormula
              .split(totalAliasWithFullFormula)
              .join(eval(totals[totalAliasWithFullFormula].value));
          }
        });
        /** replace totals which have fields and total data inside **/
        if (newFormula.includes('total_field_id_')) {
          let totalElementAliases = newFormula.match(/total_field_id_(\d+)/gi);
          totalElementAliases.forEach((totalToReplaceAlias) => {
            let totalToReplace = this.formula.find(
              (formulaItem) => formulaItem.alias === totalToReplaceAlias
            );
            if (totalToReplace && eval(totalToReplace.formula) === undefined)
              totalToReplace.formula = 0;
            if (totalToReplace)
              newFormula = newFormula
                .split(totalToReplaceAlias)
                .join(eval(totalToReplace.formula));
          });
        }
        totalElementWithTotalInside.formula = newFormula;
      });
    },

    calculate() {
      this.formula.forEach((element) => {
        let summary = eval(element.formula);
        if (summary === undefined) summary = 0;
        element.total = summary !== summary || !isFinite(summary) ? 0 : summary;

        const { totalSymbol, totalSymbolSign } = element;
        if (totalSymbol && typeof totalSymbolSign !== 'undefined') {
          element.converted = this.currencyFormat(
            element.total,
            { currency: true },
            {
              ...this.currencySettings,
              currency: totalSymbolSign,
            }
          );
        } else {
          element.converted = this.currencyFormat(
            element.total,
            { currency: true },
            this.currencySettings
          );
        }
      });

      this.formulaConst.forEach((item) => {
        const element = this.formula.find((f) => f.alias === item.alias);
        if (element && item.alias === element.alias) {
          item.hidden =
            typeof this.fields[item.alias] !== 'undefined'
              ? this.fields[item.alias].hidden
              : false;
          item.data = {
            alias: element.alias,
            total: element.total,
            converted: element.converted,
            label: element.label,
            hidden: element.hidden,
            additionalStyles: element.additionalStyles,
          };
          item.total = element.total;
        }
      });
    },

    /** get additional classes for total fiels **/
    getCustomTotalCls(fieldAlias) {
      let cls = '';
      if (this.fields.hasOwnProperty(fieldAlias)) {
        cls = this.fields[fieldAlias].additionalStyles;
      }
      return cls;
    },

    initFields() {
      const fields = Object.values(this.fields);
      for (const field of fields) {
        const data = this.getFieldData(field, this.calc_data.fields);
        this.$set(this.calcStore, field.alias, data);
      }
      this.$store.commit('setCalcStore', this.calcStore);
    },

    toggleRepeater(idx) {
      $(`.calc-repeater-subtotal-header[data-index="${idx}"]`)?.toggleClass(
        'ccb-collapsed'
      );
      $(`.calc-repeater-subtotal-fields[data-index="${idx}"]`)?.fadeToggle();
    },

    customFadeIn() {},

    customFadeOut() {},

    ...ToolTip,
    ...Helpers,
    ...Condition,
    ...Customize,
    ...WooLinks,
  },

  filters: {
    dots: (value, price, style) => {
      const strLen = (value + price).length;
      const count = style === 'vertical' ? 16 : 80;
      const labelLen = style === 'vertical' ? 26 : 50;
      const len = labelLen - strLen < 0 ? 0 : labelLen - strLen;

      return strLen > labelLen
        ? '.'.repeat(count)
        : '.'.repeat(parseInt(count + len));
    },

    to_short(value, container, len = 40) {
      value = value || '';
      if (container === 'vertical' && value.length >= len) {
        return value.substring(0, len) + '...';
      }
      return value;
    },
  },
};
