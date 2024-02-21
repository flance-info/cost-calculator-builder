export default {
  data: () => ({
    disableNextTip: false,
    calcQuickTour: null,
    settings_slug: 'total-summary',
    elements_style_data_for_quick_tour: {
      'radio-button': 3,
      checkbox: 5,
      toggle: 2,
      'radio-with-image': 2,
      'checkbox-with-image': 2,
    },
  }),

  methods: {
    applyCallback(calcQuickTour, callback) {
      if (!this.disableNextTip && typeof this[callback] === 'function') {
        this.disableNextTip = true;
        this[callback](calcQuickTour);
      }
    },

    calculatorNameNextTip(calcQuickTour) {
      this.$emit('edit-title', false);
      this.showElements = true;

      setTimeout(() => {
        if (calcQuickTour._chainNext && calcQuickTour._chainNext.target) {
          const body = document.querySelector('body');
          if (body && !body.classList.contains('ccb-border-wrap')) {
            body.classList.add('ccb-border-wrap');
          }

          this.getStep = calcQuickTour._chainNext.target;
          calcQuickTour.switchToChainNext();
          window.$calcGlobalTour = calcQuickTour._chainNext;
        }

        setTimeout(() => (this.disableNextTip = false), 500);
      }, 250);
    },

    dragAndDropNextTip(calcQuickTour) {
      this.showElements = false;
      let field =
        this.getFields.length > 0
          ? this.getFields[this.getFields.length - 1]
          : this.getters.getFields[0];
      if (field === undefined) {
        field =
          this.getFields.length > 0
            ? this.getFields.find((f) => f.type === 'Radio Button')
            : this.getters.getFields.find((f) => f.type === 'Radio Button');
      }
      this.editField(null, field.type, this.getFields.length - 1);
      this.removeBorderClassList();
      setTimeout(() => {
        if (calcQuickTour._chainNext && calcQuickTour._chainNext.target) {
          this.getStep = calcQuickTour._chainNext.target;
          calcQuickTour.switchToChainNext();
          window.$calcGlobalTour = calcQuickTour._chainNext;
        }

        setTimeout(() => (this.disableNextTip = false), 500);
      }, 250);
    },

    setupFieldsNextTip(calcQuickTour) {
      let field =
        this.getFields.length > 0
          ? this.getFields[this.getFields.length - 1]
          : this.getters.getFields[0];
      if (field === undefined || field._tag !== 'cost-radio') {
        field =
          this.getFields.length > 0
            ? this.getFields.find((f) => f.type === 'Radio Button')
            : this.getters.getFields.find((f) => f.type === 'Radio Button');
      }
      this.editField(null, field.type, this.getFields.length - 1);
      this.removeBorderClassList();

      setTimeout(() => {
        /** scroll to radio element to show all highlighted elements**/
        let radioItem = document.querySelector('.radio-button');
        document.querySelector('.calc-quick-tour-elements').scrollTop =
          parseInt(radioItem.offsetTop) - parseInt(radioItem.offsetHeight) * 2;

        /** switch to style tab**/
        document.querySelector('.ccb-edit-style-field-switch-item').click();

        if (calcQuickTour._chainNext && calcQuickTour._chainNext.target) {
          this.getStep = calcQuickTour._chainNext.target;
          calcQuickTour.switchToChainNext();
          window.$calcGlobalTour = calcQuickTour._chainNext;
        }

        setTimeout(() => (this.disableNextTip = false), 500);
      }, 250);
    },

    elementStylesNextTip(calcQuickTour) {
      setTimeout(() => {
        if (this.$store.getters.getEditFieldError === true) {
          return;
        }

        let conditions = this.generateBetaCondition(); //this.getQuickTourData;
        this.$store.commit('setConditions', conditions);
        this.setTab('conditions');

        setTimeout(() => {
          if (calcQuickTour._chainNext && calcQuickTour._chainNext.target) {
            this.getStep = calcQuickTour._chainNext.target;
            // this.$store.commit('setEditFieldError', false)
            calcQuickTour.switchToChainNext();
            window.$calcGlobalTour = calcQuickTour._chainNext;
          }
        }, 200);

        setTimeout(() => (this.disableNextTip = false), 500);
      }, 200);
    },

    conditionsNextTip(calcQuickTour) {
      this.setTab('settings');
      setTimeout(() => {
        if (calcQuickTour._chainNext && calcQuickTour._chainNext.target) {
          this.getStep = calcQuickTour._chainNext.target;
          calcQuickTour.switchToChainNext();
          window.$calcGlobalTour = calcQuickTour._chainNext;
        }
        const $settings_item = document.querySelectorAll(
          '.calc-quick-tour-settings-item'
        );
        if ($settings_item.length > 0) {
          $settings_item.forEach(($s_i) =>
            $s_i.addEventListener('click', this.settingsItemClickToggle)
          );
        }

        setTimeout(() => (this.disableNextTip = false), 500);
      }, 0);
    },

    settingsNextTip(calcQuickTour) {
      this.setTab('appearances');
      setTimeout(() => {
        if (calcQuickTour._chainNext && calcQuickTour._chainNext.target) {
          this.getStep = calcQuickTour._chainNext.target;
          calcQuickTour.switchToChainNext();
          window.$calcGlobalTour = calcQuickTour._chainNext;
        }

        setTimeout(() => (this.disableNextTip = false), 500);
      }, 0);
    },

    boxStyleNextTip(calcQuickTour) {
      if (calcQuickTour._chainNext && calcQuickTour._chainNext.target) {
        this.getStep = calcQuickTour._chainNext.target;
        calcQuickTour.switchToChainNext();
        window.$calcGlobalTour = calcQuickTour._chainNext;
      }

      setTimeout(() => (this.disableNextTip = false), 500);
    },

    presetsNextTip(calcQuickTour) {
      if (calcQuickTour._chainNext && calcQuickTour._chainNext.target) {
        this.getStep = calcQuickTour._chainNext.target;
        calcQuickTour.switchToChainNext();
        window.$calcGlobalTour = calcQuickTour._chainNext;
      }

      setTimeout(() => (this.disableNextTip = false), 500);
    },

    customizeNextTip(calcQuickTour) {
      if (calcQuickTour._chainNext && calcQuickTour._chainNext.target) {
        this.quickTourStarted = false;
        this.getStep = calcQuickTour._chainNext.target;
        calcQuickTour.switchToChainNext();
        window.$calcGlobalTour = calcQuickTour._chainNext;
      }

      setTimeout(() => (this.disableNextTip = false), 500);
    },

    setTab(tab) {
      this.$store.commit('setCurrentTab', tab);
    },

    /** Get beta condition data for sample Calculator */
    generateBetaCondition() {
      let fields = this.$store.getters.getBuilder;
      let exist_field_aliases = fields.map(({ alias }) => alias);
      let condition_node_aliases = this.getQuickTourConditions.nodes.map(
        ({ options }) => options
      );

      if (
        1 ===
        condition_node_aliases.filter(
          (z) => exist_field_aliases.indexOf(z) !== -1
        ).length
      ) {
        return {
          nodes: [
            {
              calculable: true,
              description: fields[0].text,
              icon: fields[0].icon,
              id: 1,
              label: fields[0].label,
              options: fields[0].alias,
              y: 99,
              x: 470,
            },
            {
              calculable: true,
              description: fields[1].text,
              icon: fields[1].icon,
              id: 2,
              label: fields[1].label,
              options: fields[1].alias,
              y: 100,
              x: 860,
            },
            {
              calculable: true,
              description: fields[2].text,
              icon: fields[2].icon,
              id: 3,
              label: fields[2].label,
              options: fields[2].alias,
              y: 342,
              x: 861,
            },
          ],
          links: [
            {
              from: 1,
              to: 2,
              id: 4,
              modal: false,
              options_from: fields[0].alias,
              options_to: fields[1].alias,
              input_coordinates: { position: 'leftMiddle', x: 854, y: 120 },
              target: {
                class_name: 'node-output-point right side',
                x: 664,
                y: 119,
              },
            },
            {
              from: 2,
              to: 3,
              id: 5,
              modal: false,
              options_from: fields[1].alias,
              options_to: fields[2].alias,
              input_coordinates: { position: 'topMiddle', x: 955, y: 342 },
              target: {
                class_name: 'node-output-point bottom center',
                x: 954,
                y: 140,
              },
            },
          ],
        };
      }

      return this.getQuickTourConditions;
    },

    /** Element items Style data for "Elemnt Styles" step**/
    getCalcSidebarItemStyleForElementStyleTourStep(type) {
      let proFieldTypes = [
        'file-upload',
        'drop-down-with-image',
        'multi-range',
        'date-picker',
        'time-picker',
        'repeater',
      ];
      if (
        '.calc-quick-tour-element-styles' === this.getTourStep &&
        proFieldTypes.includes(type)
      ) {
        return { 'border-color': 'rgba(0, 25, 49, 0.15)', opacity: '0.5' };
      }

      let fieldTypes = Object.keys(this.elements_style_data_for_quick_tour);
      if (
        '.calc-quick-tour-element-styles' !== this.getTourStep ||
        !fieldTypes.includes(type)
      ) {
        return {};
      }
      return {
        'z-index': 100,
        'background-color': 'white',
        margin: '4px 0',
        border: 'none',
      };
    },

    renderQuickTour() {
      const tourData = this.getQuickTourStorage();
      const fields = this.$store.getters.getBuilder;
      const quickTourFields = this.getQuickTourData.fields;

      if (fields.length === 0) {
        this.$store.commit('setTitle', this.getQuickTourData.title);

        if (quickTourFields && quickTourFields.length > 0) {
          quickTourFields.forEach((f) => fields.push(f));
        }
      }

      this.calcQuickTour = new window.CalcQuickTour(tourData);
      this.calcQuickTour.show();

      setTimeout(() => this.initListeners(), 300);
    },

    quickTourNextStep(target, chain = null) {
      if (chain && chain._chainNext) {
        if (target === chain.target) {
          chain.buttons[0].click(
            chain,
            null,
            target === '.calc-quick-tour-edit-field'
          );
        } else {
          this.quickTourNextStep(target, chain._chainNext);
        }
      }
    },

    quickTourLastStep() {
      if (
        window.$calcGlobalTour._chainNext &&
        window.$calcGlobalTour._chainNext.target
      ) {
        this.quickTourStarted = false;
        this.getStep = window.$calcGlobalTour._chainNext.target;
        window.$calcGlobalTour.switchToChainNext();
      }
    },

    initListeners() {
      if (this.getStep === '.calc-quick-tour-title-box') {
        const $approveBtn = document.querySelector(
          '.ccb-title-approve.ccb-icon-Path-3484'
        );
        if ($approveBtn)
          $approveBtn.addEventListener('click', this.titleBoxNextHandler);
      }
    },

    titleBoxNextHandler() {
      if (!this.disableNextTip) {
        this.disableNextTip = true;
        const $nextTipBtn = document.querySelector(
          '.ccb-q-t-btn-container-inner > button.success'
        );
        if ($nextTipBtn) $nextTipBtn.click();

        const $approveBtn = document.querySelector(
          '.ccb-title-approve.ccb-icon-Path-3484'
        );
        $approveBtn.removeEventListener('click', this.titleBoxNextHandler);
        setTimeout(() => (this.disableNextTip = false), 500);
      }
    },

    settingsItemClickToggle(e) {
      e.stopPropagation();
      this.settingsItemClick(
        e.target.classList.contains('calc-quick-tour-settings-item')
          ? e.target
          : e.target.parentNode
      );
    },

    settingsItemClick(target) {
      target = target || { dataset: null };
      if (target.dataset.slug) {
        this.settings_slug = target.dataset.slug;
        this.$store.commit('updateTab', target.dataset.slug);
        this.getTab = target.dataset.slug;
        document
          .querySelector('.calc-quick-tour-settings-item.ccb-active')
          .classList.remove('ccb-active');
        target.classList.add('ccb-active');
      }
    },

    getQuickTourStorage() {
      const vm = this;
      return [
        {
          target: '.calc-quick-tour-title-box',
          title: 'Name your calculator',
          position: 'bottom',
          buttons: [
            {
              text: 'Next tip',
              type: 'success',
              click(calcQuickTour) {
                vm.applyCallback(calcQuickTour, 'calculatorNameNextTip');
              },
            },
            {
              text: 'Skip all',
              className: '',
              type: 'info',
              click(calcQuickTour) {
                vm.$emit('edit-title', false);
                vm.skipQuickTour(calcQuickTour);
              },
            },
          ],
        },
        {
          target: '.calc-quick-tour-elements',
          type: 'medium m-b-10',
          title: 'Drag and drop the elements',
          content:
            'Move the custom elements to builder’s workplace to create the calculator.',
          position: 'right',
          documentation:
            'https://docs.stylemixthemes.com/cost-calculator-builder/calculator-elements/general-overview',
          buttons: [
            {
              text: 'Next tip',
              type: 'success',
              click(calcQuickTour) {
                vm.applyCallback(calcQuickTour, 'dragAndDropNextTip');
              },
            },
            {
              text: 'Skip all',
              className: '',
              click(calcQuickTour) {
                vm.showElements = false;
                vm.skipQuickTour(calcQuickTour);
              },
              type: 'info',
            },
          ],
        },
        {
          target: '.calc-quick-tour-edit-field',
          type: 'medium m-b-10',
          title: 'Set-up fields of custom element',
          content:
            'Enter the name of the element and set the parameters, then  click “Save” button',
          position: 'center-left',
          documentation:
            'https://docs.stylemixthemes.com/cost-calculator-builder/calculator-elements/general-overview',
          buttons: [
            {
              text: 'Next tip',
              type: 'success',
              click(calcQuickTour) {
                vm.applyCallback(calcQuickTour, 'setupFieldsNextTip');
              },
            },
            {
              text: 'Skip all',
              className: '',
              click: function (calcQuickTour) {
                vm.skipQuickTour(calcQuickTour);
              },
              type: 'info',
            },
          ],
        },
        {
          target: '.calc-quick-tour-element-styles',
          type: 'medium m-b-10',
          title: 'Element Styles',
          content:
            'You can pick from multiple available styles for certain elements, giving you the ability to design your form in different ways.',
          position: 'center-left',
          documentation:
            'https://docs.stylemixthemes.com/cost-calculator-builder/calculator-elements/general-overview',
          buttons: [
            {
              text: 'Next tip',
              type: 'success',
              click(calcQuickTour) {
                vm.applyCallback(calcQuickTour, 'elementStylesNextTip');
              },
            },
            {
              text: 'Skip all',
              className: '',
              click(calcQuickTour) {
                vm.skipQuickTour(calcQuickTour);
              },
              type: 'info',
            },
          ],
        },
        {
          target: `.calc-quick-tour-conditions`,
          arrowTarget: '.calc-quick-tour-flowchart-no-elements',
          type: 'big',
          documentation:
            'https://docs.stylemixthemes.com/cost-calculator-builder/pro-plugin-features/conditional-system',
          title: `<span class="ccb-quick-tour-title-inner">Conditions</span>${
            vm.proActive
              ? ``
              : `<span class="ccb-quick-tour-pro-badge"><span class="ccb-icon-Path_3615"></span><span>PRO</span></span>`
          }`,
          content:
            'Click on the elements to add them to the workplace and make connections between them. Then, add conditions by clicking on the circle button in the chain between elements.',
          content_html:
            '<p class="calc-quick-tour-content-html-text">You can create single or many conditions for one connection, but they should be logically correct and used for proper elements.</p>',
          position: {
            bottom: '10px',
            right: '10px',
          },
          arrowPosition: 'none',
          buttons: [
            {
              text: 'Next tip',
              type: 'success',
              click(calcQuickTour) {
                vm.applyCallback(calcQuickTour, 'conditionsNextTip');
              },
            },
            {
              text: 'Skip all',
              className: '',
              click(calcQuickTour) {
                vm.skipQuickTour(calcQuickTour);
              },
              type: 'info',
            },
          ],
        },
        {
          target: '.calc-quick-tour-settings',
          type: 'big settings',
          documentation:
            'https://docs.stylemixthemes.com/cost-calculator-builder/plugin-features/cost-calculator-settings#individual-settings',
          title: 'Settings',
          content: `<b>The Settings</b> option gives you the opportunity to change default settings.`,
          content_html: `<div class="calc-quick-tour-settings-container">
							${vm.getCalcSettings
                .filter(
                  (settings) =>
                    typeof settings === 'object' &&
                    settings.hasOwnProperty('tour_title')
                )
                .map((settings) => {
                  return `<div class="calc-quick-tour-settings-item${
                    vm.settings_slug === settings.slug ? ' ccb-active' : ''
                  }" data-slug="${settings.slug}">
							<span>${settings.tour_title}${
                !vm.proActive && settings.in_pro
                  ? `<span class="ccb-quick-tour-pro-badge small"><span class="ccb-icon-Path_3615"></span><span>PRO</span></span>`
                  : ``
              }</span>
							   <span class="calc-q-t-settings-icon-box">
								  <i class="${settings.icons}"></i>
							   </span>
							<span>${settings.tour_description}</span>
						</div>
					`;
                })
                .join('')}
					</div>
				`,
          position: {
            bottom: '10px',
            right: '10px',
          },
          arrowPosition: 'none',
          buttons: [
            {
              text: 'Next tip',
              type: 'success',
              click(calcQuickTour) {
                vm.applyCallback(calcQuickTour, 'settingsNextTip');
              },
            },
            {
              text: 'Skip all',
              className: '',
              click(calcQuickTour) {
                vm.skipQuickTour(calcQuickTour);
              },
              type: 'info',
            },
          ],
        },
        {
          target: '.calc-quick-tour-appearance-tab',
          type: 'medium appearance-tab m-b-10',
          title: 'Appearance',
          content: `Adjust settings of Colors, Typography, Spacing & Positions to make the calculator responsive`,
          position: 'center-right',
          documentation:
            'https://docs.stylemixthemes.com/cost-calculator-builder/plugin-features/calculator-customization',
          buttons: [
            {
              text: 'Next tip',
              type: 'success',
              click(calcQuickTour) {
                vm.applyCallback(calcQuickTour, 'boxStyleNextTip');
              },
            },
            {
              text: 'Skip all',
              className: '',
              click(calcQuickTour) {
                vm.skipQuickTour(calcQuickTour);
              },
              type: 'info',
            },
          ],
        },
        {
          target: '.calc-quick-tour-ccb-button',
          type: 'small',
          title: 'Save calculator',
          position: {
            top: '-10px',
            right: '105px',
          },
          arrowPosition: 'center-right',
          buttons: [],
        },
        {
          target: '.ccb-embed-popup-quick-tour',
          type: 'medium m-b-10',
          title: 'Calculator embed options',
          content: `You can add your built form manually using a shortcode, choose specific current pages, or create a new page for your calculator.`,
          documentation:
            'https://docs.stylemixthemes.com/cost-calculator-builder/plugin-features/calculator-customization#colors',
          position: {
            top: '15%',
            right: '-63%',
          },
          arrowPosition: 'center-left',
          buttons: [
            {
              text: 'Create a calculator',
              type: 'success',
              click() {
                if (window.$ccb_admin_calculator) {
                  window.$ccb_admin_calculator.createCalcPage();
                }
              },
            },
          ],
        },
      ];
    },

    skipQuickTour(calcQuickTour) {
      this.getStep = 'done';
      calcQuickTour.hide();
      this.removeBorderClassList();
      this.quickTourStarted = false;
      this.$store.dispatch('skipCalcQuickTour');

      /** remove last autoadded field**/
      const fields = this.$store.getters.getBuilder;
      fields.pop();
    },

    removeBorderClassList() {
      const body = document.querySelector('body.ccb-border-wrap');
      if (body) body.classList.remove('ccb-border-wrap');
    },
  },

  computed: {
    proActive() {
      if (
        typeof ajax_window !== 'undefined' &&
        window.ajax_window.hasOwnProperty('pro_active')
      )
        return !!window.ajax_window.pro_active;
      return false;
    },

    getters() {
      return this.$store.getters;
    },

    getCalcSettings() {
      return Object.entries(this.getters.getSettings || {}).map(
        ([key, value]) => ({ key, ...value })
      );
    },

    getStep: {
      get() {
        return this.getters.getQuickTourStep;
      },

      set(value) {
        this.$store.commit('setQuickTourStep', value);
      },
    },

    quickTourStarted: {
      get() {
        return this.getters.getQuickTourStarted;
      },

      set(value) {
        this.$store.commit('setQuickTourStarted', value);
      },
    },

    getQuickTourData() {
      return this.getters.getQuickTourData;
    },

    getQuickTourConditions() {
      return this.getters.getQuickTourConditions;
    },

    /** Sidebar header and block styles  for "Elemnt Styles" step**/
    getCalcSidebarStyleForElementStyleTourStep() {
      let result = { 'ccb-create-calc-sidebar': {}, 'ccb-sidebar-header': {} };

      if ('.calc-quick-tour-element-styles' === this.getTourStep) {
        result['ccb-create-calc-sidebar'] = {
          'z-index': 1001,
          'background-color': 'rgba(0, 0, 0, 0.01)',
        };

        result['ccb-sidebar-header'] = {
          background: 'unset',
          position: 'inherit',
        };
      }
      return result;
    },
  },
};
