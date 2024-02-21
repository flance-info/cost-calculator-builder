import $ from 'jquery';

const WooLinks = {};

WooLinks.initLinks = function () {
  const settings = this.$store.getters.getSettings;
  const self = this;

  /** run this part only on product page **/
  if (settings.woo_products?.enable && settings.woo_products?.is_product_page) {
    const links = settings.woo_products.meta_links;
    const calcId = this.$store.getters.getSettings.calc_id || this.id;

    if (settings.woo_products?.current_product) {
      this.$store.commit(
        'setWooProductPrice',
        +settings.woo_products.current_product.price
      );
    }

    setTimeout(() => {
      this.$calc = $(`*[data-calc-id="${calcId}"]`);

      links.forEach((link) => {
        if ('price' === link.woo_meta) {
          const value = $(`#woo_${link.woo_meta}`).data('value');
          if (link.action) {
            self.setValue(
              value,
              link.calc_field,
              link.action === 'set_value_disable'
            );
          }
        }

        if ('quantity' === link.woo_meta) {
          if ('set_value_disable' === link.action) {
            self.disableField(link.calc_field);
          }

          /** Set value from woocommerce to calc field
           * reverse logic inside 'change' cost-calc.js  */
          $('input.qty').change(function () {
            let value = $(this).val();
            if (link.action) {
              self.setValue(
                value,
                link.calc_field,
                link.action === 'set_value_disable'
              );
            }
          });
        }
      });
    });
  }
};

WooLinks.disableField = function (alias) {
  const field = this.calcStore[alias];
  if (field) {
    this.$store.getters.filterUnused(field);
  }

  this.disableFieldAction(field);
  this.apply();
};

WooLinks.setValue = function (value, alias, disabled) {
  const field = this.calcStore[alias];

  if (!field) {
    const repeaters = Object.values(this.calcStore).filter((f) =>
      f.alias.includes('repeater')
    );

    let repeater;
    for (const r of repeaters) {
      const aliases = r.groupElements.map((f) => f.alias);
      if (aliases.includes(alias)) {
        repeater = r;
      }
    }

    if (repeater) {
      for (const fields of repeater.resultGrouped) {
        const field = fields[alias];
        if (field) {
          field.value = value;
          this.setValueAction(fields, field, value, disabled);

          if (this.fields[repeater.alias]?.hasNextTick) {
            this.fields[repeater.alias].nextTickCount++;
          }
        }
      }
    }
  } else {
    this.$store.getters.filterUnused(field);
    this.setValueAction(this.fields, field, value, disabled);
  }
  this.apply();
};

WooLinks.setValueAction = function (fields, field, value, disabled) {
  if (disabled) {
    this.$calc.find('.calc_' + field.alias).addClass('calc-field-disabled');
  }

  fields[field.alias].value = value;

  if (field.alias.indexOf('checkbox') !== -1) {
    fields[field.alias].value = [
      { converted: value, label: value, temp: value, value: value },
    ];
  }

  if (field.alias.indexOf('toggle') !== -1) {
    fields[field.alias].value = [
      { converted: value, label: value, temp: value, value: value },
    ];
  }

  if (disabled && field.alias.startsWith('range')) {
    this.$calc.find('.calc_' + field.alias + ' input').each((i, e) => {
      e.disabled = true;
    });
  }

  if (field.alias.indexOf('multi') !== -1) {
    if (disabled) {
      this.$calc
        .find('.calc_' + field.alias + ' input')
        .each((i, e) => (e.disabled = true));
    }

    fields[field.alias].value = {
      end: value,
      start: 0,
      value: value,
    };
  }
};

WooLinks.disableFieldAction = function (field) {
  this.$calc.find('.calc_' + field.alias).addClass('calc-field-disabled');

  if (field.alias.startsWith('range')) {
    this.$calc
      .find('.calc_' + field.alias + ' input')
      .each((key, inputElement) => {
        inputElement.disabled = true;
      });
  }
};

export default WooLinks;
