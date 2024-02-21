export default {
  methods: {
    getFieldData(field, fields) {
      // const aliasStore = fields.map((f) => f.alias);
      // if (!aliasStore.includes(field.alias)) return field;

      const fieldName = field.alias.replace(/\_field_id.*/, '');
      const checkboxAndToggle = ['toggle', 'checkbox', 'checkbox_with_img'];
      const radioAndDropDown = [
        'radio',
        'dropDown',
        'dropDown_with_img',
        'radio_with_img',
      ];

      if (fieldName === 'datePicker') {
        return this.setStoreDatePicker(field);
      } else if (fieldName === 'timePicker') {
        return this.setStoreTimePicker(field);
      } else if ('file_upload'.includes(fieldName)) {
        return this.setStoreFileField(field); // Set checkbox | toggle field value
      } else if (checkboxAndToggle.includes(fieldName)) {
        return this.setStoreMultipleControlFields(field);
      } else if (radioAndDropDown.includes(fieldName)) {
        return this.setStoreSingleControlFields(field, fields);
      } else if (fieldName === 'multi_range') {
        return this.setStoreMultiRangeField(field);
      } else if ('range'.includes(fieldName)) {
        return this.setStoreNumberTypeFields(field);
      } else if ('quantity'.includes(fieldName)) {
        return this.setStoreFloatTypeFields(field);
      } else if ('repeater'.includes(fieldName)) {
        return this.setRepeaterTypeFields(field);
      } else if ('group'.includes(fieldName)) {
        return this.setGroupTypeFields(field);
      } else if (fieldName === 'total') {
        field.value = field.round ? Math.round(field.value) : field.value;

        return {
          value: field.value,
          label: field.label,
          alias: field.alias,
          required: field.required,
          hidden: field.hidden,
          converted: this.currencyFormat(
            field.value,
            field,
            this.currencySettings
          ),
          inRepeater:
            typeof this.inRepeater === 'function'
              ? this.inRepeater(field.alias)
              : false,
        };
      } else {
        const extra = field.extraLabel ? `(${field.extraLabel})` : undefined;
        if (typeof this.filterUnused === 'function') {
          this.filterUnused(extra, field);
        }
        return {
          extra: extra,
          alias: field.alias,
          label: field.label,
          hidden: field.hidden,
          required: field.required,
          addToSummary: field.addToSummary,
          styles: field.styles,
          converted: fieldName === 'text' ? field.value : '',
          value: fieldName === 'text' ? field.value : 0,
          inRepeater:
            typeof this.inRepeater === 'function'
              ? this.inRepeater(field.alias)
              : false,
        };
      }
    },

    setStoreDatePicker(field) {
      /** return if date not chosen **/
      if (!field || +field === 0 || typeof field === 'undefined') {
        return;
      }

      const extra = field.extraLabel ? `(${field.extraLabel})` : undefined;
      const viewValue =
        field.viewValue && +field.value !== 0 ? field.viewValue : '';

      // Todo change a logic
      if (viewValue.length > 0) {
        this.$store.getters.filterUnused(field);
      }

      const data = {
        extra,
        alias: field.alias,
        label: field.label,
        required: field.required,
        checked: field.checked,
        hidden: field.hidden,
        day_price: field.day_price_enabled,
        addToSummary: field.addToSummary,
        options: [{ value: 0, label: viewValue }],
        value: 0,
        converted: viewValue,
        convertedPrice: 0,
        styles: field.styles,
        inRepeater:
          typeof this.inRepeater === 'function'
            ? this.inRepeater(field.alias)
            : false,
      };

      if (field.day_price_enabled) {
        /** field.value contains count of days */
        data.value = parseFloat(field.day_price) * field.value;
        data.option_unit_info = viewValue;
        if (field.value !== 0) {
          data.option_unit =
            field.value +
            ' ' +
            this.translations.days +
            ' x ' +
            this.currencyFormat(field.day_price, field, this.currencySettings);
        }
        data.break_all = true;
        data.convertedPrice = this.currencyFormat(
          data.value,
          field,
          this.currencySettings
        );
        data.options = [{ value: data.value, label: viewValue }];
      } else {
        data.value = 0;
        data.convertedPrice = viewValue;
      }

      data.empty = data.value === 0;

      if (viewValue.length > 0) {
        this.$store.getters.filterUnused(field);
      }

      return data;
    },

    setStoreTimePicker(field) {
      /** return if time not chosen **/
      if (!field || +field === 0 || typeof field === 'undefined') {
        return;
      }

      const extra = field.extraLabel ? `(${field.extraLabel})` : undefined;
      const viewValue =
        field.viewValue && +field.value !== 0 ? field.viewValue : '';
      const value = field.value ? field.value : '';

      const splitView = viewValue.split(' - ');
      if (
        (viewValue && viewValue.trim() !== '-' && field.range !== '1') ||
        (splitView[0] && splitView[1] && field.range === '1')
      ) {
        this.$store.getters.filterUnused(field);
      }

      let renderRangeResult = '';

      if (field.viewValue !== undefined && field.viewValue.includes('start')) {
        const result = JSON.parse(field.viewValue);
        renderRangeResult = result.start + ' - ' + result.end;
      }

      return {
        extra,
        alias: field.alias,
        empty: value === 0,
        label: field.label,
        required: field.required,
        checked: field.checked,
        hidden: field.hidden,
        range: field.range === '1',
        addToSummary: field.addToSummary,
        summary_value: value,
        options: [{ value: value, label: viewValue }],
        value: 0,
        converted: renderRangeResult !== '' ? renderRangeResult : viewValue,
        styles: field.styles,
        inRepeater:
          typeof this.inRepeater === 'function'
            ? this.inRepeater(field.alias)
            : false,
      };
    },

    setStoreMultipleControlFields(field) {
      /** return if no data **/
      let sum = 0;
      let extra = '';
      let options = [];
      let empty = false;

      if (!field || +field === 0 || typeof field.value === 'undefined') {
        return;
      }

      if (field.value.hasOwnProperty('length')) {
        field.value.forEach((i) => {
          let val = field.round ? Math.round(i.value) : i.value;
          val = field.unit ? this.validateUnit(val * field.unit) : val;
          i.value = val;
          i.converted = this.currencyFormat(val, field, this.currencySettings);
        });

        options = field.value;
        sum = field.value.reduce((a, b) => a + parseFloat(b.value), 0);

        let toFixedValue = 2; // default to fixed value is 2

        /** get max count of ints after comma for toFixedValue if no round**/
        if (!field.round && field.value.length > 0) {
          field.value.forEach((i) => {
            let fixedValue =
              Math.floor(parseFloat(i.value).valueOf()) ===
              parseFloat(i.value).valueOf()
                ? 0
                : parseFloat(i.value).toString().split('.')[1].length || 0;
            if (fixedValue > toFixedValue) {
              toFixedValue = fixedValue;
            }
          });
        }

        sum = Number.isInteger(+sum) ? +sum : (+sum).toFixed(toFixedValue);
        extra = `(${field.value.map((e) => e.label).join(', ')})`;
        if (typeof this.filterUnused === 'function') {
          this.filterUnused(extra, field);
        }
      } else {
        empty = true;
      }

      return {
        extra,
        empty,
        value: sum,
        options: options,
        label: field.label,
        checked: field.checked,
        minChecked: field.minChecked,
        alias: field.alias,
        required: field.required,
        hidden: field.hidden,
        addToSummary: field.addToSummary,
        styles: field.styles,
        converted: this.currencyFormat(sum, field, this.currencySettings),
        inRepeater:
          typeof this.inRepeater === 'function'
            ? this.inRepeater(field.alias)
            : false,
      };
    },

    setStoreMultiRangeField(field) {
      /** return if no data **/
      const extra = field.extraLabel ? `(${field.extraLabel})` : undefined;

      let fieldValue = 0;
      if (field.value.hasOwnProperty('value')) {
        fieldValue = field.value['value'];
      }

      let value;

      value =
        field.unit && field.multiply
          ? this.validateUnit(fieldValue * field.unit)
          : fieldValue;

      value = field.round ? Math.round(value) : value;

      const options = [
        {
          value: value,
          label:
            field.value.value +
            ' (' +
            field.value.start +
            ' - ' +
            field.value.end +
            ') ',
        },
      ];

      const filterElement = Object.assign({}, field);
      filterElement.value = value;

      if (typeof this.filterUnused === 'function') {
        this.filterUnused(extra, filterElement);
      }

      let data = {
        extra,
        value: value,
        empty: value === 0,
        unit: +field.unit ? +field.unit : 0,
        slideValue: field.value,
        alias: field.alias,
        label: field.label,
        unitSymbol: field.sign,
        currency: field.currency,
        options: options,
        required: field.required,
        multiply: field.multiply,
        checked: field.checked,
        hidden: field.hidden,
        addToSummary: field.addToSummary,
        styles: field.styles,
        converted: this.currencyFormat(value, field, this.currencySettings),
        inRepeater:
          typeof this.inRepeater === 'function'
            ? this.inRepeater(field.alias)
            : false,
      };

      if (field.multiply && this.showUnitInSummary) {
        let position = field.unitPosition;

        if (position === 'right') {
          data.option_unit = `${field.value.value} ${field.sign ?? ''} x ${
            field.currency
              ? this.currencyFormat(field.unit, field, this.currencySettings)
              : field.unit + ' ' + field.unitSymbol
          }`;
        } else {
          data.option_unit = `${field.sign ?? ''} ${field.value.value} x ${
            field.currency
              ? this.currencyFormat(field.unit, field, this.currencySettings)
              : field.unit + ' ' + field.unitSymbol
          }`;
        }
      }

      return data;
    },

    setStoreNumberTypeFields(field) {
      /** return if no data **/
      const extra = field.extraLabel ? `(${field.extraLabel})` : undefined;
      let value = field.value ? field.value : 0;
      const slideValue = JSON.parse(JSON.stringify(value));
      const unit = +field.unit ? +field.unit : 0;
      const numAfterInt = this.currencySettings.num_after_integer;

      value =
        field.unit && field.multiply
          ? this.validateUnit(value * field.unit, numAfterInt)
          : value;

      value = field.round ? Math.round(value) : parseFloat(value);

      const options = [{ value: value, label: field.value }];

      let data = {
        extra,
        value,
        unit,
        slideValue,
        empty: value === 0,
        alias: field.alias,
        label: field.label,
        checked: field.value ? field.checked : false,
        required: field.required,
        options: options,
        multiply: field.multiply,
        hidden: field.hidden,
        addToSummary: field.addToSummary,
        unitSymbol: field.sign,
        currency: field.currency,
        styles: field.styles,
        converted: this.currencyFormat(value, field, this.currencySettings),
        inRepeater:
          typeof this.inRepeater === 'function'
            ? this.inRepeater(field.alias)
            : false,
      };

      if (field.multiply && this.showUnitInSummary) {
        let position = field.unitPosition;

        if (position === 'right') {
          data.option_unit = `${field.value} ${field.sign} x ${
            field.currency
              ? this.currencyFormat(field.unit, field, this.currencySettings)
              : field.unit + ' ' + field.unitSymbol
          }`;
        } else {
          data.option_unit = `${field.sign} ${field.value} x ${
            field.currency
              ? this.currencyFormat(field.unit, field, this.currencySettings)
              : field.unit + ' ' + field.unitSymbol
          }`;
        }
      }

      if (typeof this.filterUnused === 'function') {
        this.filterUnused(extra, field);
      }

      return data;
    },

    setStoreFloatTypeFields(field) {
      const extra = field.extraLabel ? `(${field.extraLabel})` : undefined;
      const unit = +field.unit ? +field.unit : 0;
      const numAfterInt = this.currencySettings.num_after_integer;

      let value = field.value ? field.value : 0;

      value =
        field.unit && field.multiply
          ? this.validateUnit(value * field.unit, numAfterInt)
          : value;

      value = field.round ? Math.round(value) : parseFloat(value);

      let skip;
      if (typeof window.$calcGlobalHiddens === 'undefined')
        window.$calcGlobalHiddens = {};

      if (
        typeof window.$calcGlobalHiddens[field.alias] !== 'undefined' &&
        window.$calcGlobalHiddens[field.alias].skip !== true
      ) {
        window.$calcGlobalHiddens[field.alias] = {
          value: field.hidden,
          skip: false,
        };

        if (field.hidden === false) {
          window.$calcGlobalHiddens[field.alias].skip = true;
        }

        skip = window.$calcGlobalHiddens[field.alias].skip;
      } else if (
        typeof window.$calcGlobalHiddens[field.alias] === 'undefined'
      ) {
        window.$calcGlobalHiddens[field.alias] = {
          value: field.hidden,
          skip: false,
        };

        skip = window.$calcGlobalHiddens[field.alias].skip;
      } else {
        skip = window.$calcGlobalHiddens[field.alias].skip;
      }

      if (typeof this.filterUnused === 'function') {
        this.filterUnused(extra, field);
      }

      let data = {
        extra,
        value,
        unit,
        empty: value === 0,
        alias: field.alias,
        label: field.label,
        original: field.value,
        checked: field.value ? field.checked : false,
        min: field.min,
        max: field.max,
        multiply: field.multiply,
        required: field.required,
        options: [{ value: value, label: field.value }],
        hidden: skip ? false : field.hidden,
        originalHidden: field.hidden,
        addToSummary: field.addToSummary,
        styles: field.styles,
        converted: this.currencyFormat(value, field, this.currencySettings),
        inRepeater:
          typeof this.inRepeater === 'function'
            ? this.inRepeater(field.alias)
            : false,
      };

      if (field.multiply && this.showUnitInSummary) {
        let position = field.unitPosition;

        if (position === 'right') {
          data.option_unit = `${field.value} ${field.sign ?? ''} x ${
            field.currency
              ? this.currencyFormat(field.unit, field, this.currencySettings)
              : field.unit + ' ' + field.unitSymbol
          }`;
        } else {
          data.option_unit = `${field.sign ?? ''} ${field.value} x ${
            field.currency
              ? this.currencyFormat(field.unit, field, this.currencySettings)
              : field.unit + ' ' + field.unitSymbol
          }`;
        }
      }

      return data;
    },

    setRepeaterTypeFields(field) {
      return {
        value: field.value,
        empty: false,
        alias: field.alias,
        label: field.label,
        original: field.value,
        required: field.required,
        hidden: field.hidden,
        addToSummary: field.addToSummary,
        styles: field.styles,
        converted: this.currencyFormat(
          field.value,
          { currency: true },
          this.currencySettings
        ),
        inRepeater: true,
        groupElements: field.groupElements,
        enableFormula: field.enableFormula,
        sumAllAvailable: field.sumAllAvailable,
        costCalcFormula: field.costCalcFormula,
        resultGrouped: field?.resultGrouped ? field.resultGrouped : [],
      };
    },

    setGroupTypeFields(field) {
      return {
        value: field.value,
        empty: false,
        alias: field.alias,
        label: field.label,
        original: field.value,
        required: field.required,
        hidden: field.hidden,
        addToSummary: field.addToSummary,
        styles: field.styles,
        inRepeater: true,
        groupElements: field.groupElements,
        resultGrouped: field?.resultGrouped ? field.resultGrouped : [],
      };
    },

    /** set radio and drop down field values **/
    setStoreSingleControlFields(field, fields) {
      let extraView = field.extraLabel;
      let extra = field.extraLabel ? `(${field.extraLabel})` : undefined;
      let value = field.value ? field.value.toString() : '';

      let fieldValue = parseFloat(value.split('_')[0]);

      fieldValue = isNaN(+fieldValue) ? 0 : +fieldValue;
      fieldValue = field.round ? Math.round(+fieldValue) : +fieldValue;
      fieldValue = field.unit
        ? this.validateUnit(fieldValue * field.unit)
        : +fieldValue;

      if (fieldValue > 0) {
        this.$store.getters.filterUnused(field);
      }

      /** if value exist remove from list of invalid required fields **/
      if (
        (value || value.length > 0) &&
        typeof this.filterUnused === 'function'
      ) {
        this.filterUnused(value, field);
      }

      let empty = false;
      let checked = false;
      let optionLabel = field.label;

      if (field.value && field.value.length > 0) {
        const fieldToData = fields.find((item) => item.alias === field.alias);
        const valueIndex = field.value.split('_');

        if (
          this.isObjectHasPath(fieldToData, [
            'options',
            valueIndex[1],
            'optionText',
          ])
        ) {
          optionLabel = fieldToData.options[valueIndex[1]].optionText;
          checked = true;
        }
      } else {
        empty = true;
      }

      return {
        extra,
        empty,
        extraView,
        alias: field.alias,
        label: field.label,
        checked: checked,
        required: field.required,
        hidden: field.hidden,
        summary_view: field.summary_view,
        summary_value: fieldValue || 0,
        addToSummary: field.addToSummary,
        styles: field.styles,
        woo_product_price: field.woo_product_price || 0,
        value:
          field.summary_view === 'show_label_not_calculable' ? 0 : fieldValue,
        options: [
          {
            value: fieldValue,
            temp: value,
            converted: fieldValue,
            label: optionLabel,
          },
        ],
        converted:
          field.summary_view === 'show_label_not_calculable'
            ? ''
            : this.currencyFormat(fieldValue, field, this.currencySettings),
        inRepeater:
          typeof this.inRepeater === 'function'
            ? this.inRepeater(field.alias)
            : false,
      };
    },

    setStoreFileField(field) {
      const extra = field.extraLabel ? `(${field.extraLabel})` : field.label;

      let value = parseFloat(field.value);
      let checked = false;

      const options = { value: [], label: '' };
      if (field.hasOwnProperty('files') && field.files.length > 0) {
        options.value = field['files'];
        options.label = 'file names is here';
        checked = true;
      }

      if (typeof this.filterUnused === 'function') {
        this.filterUnused(extra, field);
      }

      return {
        extra,
        value: value,
        unit: 0,
        alias: field.alias,
        label: field.label,
        options: options,
        required: field.required,
        checked: checked,
        hidden: field.hidden,
        addToSummary: field.addToSummary,
        styles: field.styles,
        price: field.price,
        allowPrice: field.allowPrice,
        allowCurrency: field.allowCurrency,
        calculatePerEach: field.calculatePerEach,
        converted: this.currencyFormat(value, field, this.currencySettings),
        inRepeater:
          typeof this.inRepeater === 'function'
            ? this.inRepeater(field.alias)
            : false,
      };
    },

    inRepeater(alias) {
      return this.repeaterFields?.includes(alias);
    },

    initField(field) {
      let value = 0;
      let fieldName = field.alias.replace(/\_field_id.*/, '');
      const multipleFieldNames = ['checkbox', 'checkbox_with_img', 'toggle'];

      /** set default value for not multiple fields
       * multiple fields default implemented inside field script **/
      if (!multipleFieldNames.includes(fieldName)) {
        value = field.default ? field.default : 0;
      }

      const data = {
        id: field._id,
        unit: field.unit,
        label: field.label,
        alias: field.alias,
        round: field.allowRound,
        currency: field.allowCurrency,
        wcProductMetaLink: field.wc_product_meta_link,
        hidden:
          field.hasOwnProperty('hidden') && field.hidden === true ? true : null,
        addToSummary:
          typeof field.addToSummary === 'undefined' ? true : field.addToSummary,
        required: JSON.parse(field.required || false),
        summary_view: !field.summary_view ? 'show_value' : field.summary_view,
        value: value,
        styles: field.styles,
      };

      /** set default value for Quantity if have 'min' value and 'default' not set */
      if (field.type === 'Quantity') {
        if (!field.default) {
          data.value = field.min ? field.min : 0;
        }
        data.min = field.min ? field.min : false;
        data.max = field.max ? field.max : false;
      }

      /** set price Data for date field */
      if ('Date Picker' === field.type) {
        /** put pseudo {currency: true} object to function, maybe later will add this settings to field*/
        data.day_price = field.day_price;
        data.day_price_enabled = field.day_price_enabled;
      }

      if ('Repeater' === field.type) {
        data.groupElements = field.groupElements;
        data.enableFormula = field.enableFormula;
        data.sumAllAvailable = field.sumAllAvailable;
        data.costCalcFormula = field.costCalcFormula;
        data.resultGrouped = field?.resultGrouped ? field.resultGrouped : [];
      }

      if ('Group' === field.type) {
        data.groupElements = field.groupElements;
        data.resultGrouped = field?.resultGrouped ? field.resultGrouped : [];
      }

      if ('File Upload' === field.type) {
        data.calculatePerEach = field.calculatePerEach;
        data.allowCurrency = field.allowCurrency;
        data.allowPrice = field.allowPrice;
        data.price = field.price;
      }

      if (field.range) {
        data.range = field.range;
      }

      if (field.default) {
        data.default = field.default;
      }

      if (field.unitPosition) {
        data.unitPosition = field.unitPosition;
      }

      if (field.multiply !== undefined) {
        data.multiply = field.multiply;
      }

      if (field.unitSymbol !== undefined) {
        data.unitSymbol = field.unitSymbol;
      }

      if (field.minChecked && Number(field.minChecked)) {
        data.minChecked = Number(field.minChecked);
      }

      /** If field needs re-render from outside we add new option values like <disabled, hasNextTick, nextTickCount> **/
      if (field.hasNextTick) {
        /** for disable/enable from outside **/
        data.disabled = field.disabled;
        /** for update value from outside **/
        data.hasNextTick = field.hasNextTick;
        data.nextTickCount = field.nextTickCount;
      }

      if (field.type === 'Total') {
        data.value = field.formulaView
          ? field.legacyFormula
          : field.costCalcFormula;
        data.additionalStyles = field.additionalStyles;
        data.totalSymbol = field.totalSymbol;
        data.totalSymbolSign = field.totalSymbolSign;
        data.legacyFormula = field.legacyFormula;
        data.formulaView = field.formulaView;
      }

      if (field.sign !== undefined) {
        data.sign = field.sign;
      }

      return data;
    },
  },
};
