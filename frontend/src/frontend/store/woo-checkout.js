const parseDescriptions = (data) => {
  let result = [];

  data.forEach((element) => {
    if (!element.alias.includes('repeater')) {
      result.push(element);
    } else {
      result.push({
        alias: element.alias,
        converted: ' ',
        hidden: false,
        label: element.label,
        value: '',
      });

      if (element.groupElements.length) {
        result = [...result, ...element.groupElements];
      }
    }
  });

  return result;
};
export default {
  state: {
    productName: false,
  },
  actions: {
    async applyWoo({ getters, state }, params) {
      const getSettings = getters.getSettings;
      const action = 'calc_woo_redirect';
      const nonce = window.ccb_nonces.ccb_woo_checkout;

      const descriptions = getters.getSettings.general.hide_empty
        ? getters.getDescriptions('showZero')
        : getters.getDescriptions();

      let finalDescription = parseDescriptions(descriptions);

      let wooData = {
        woo_info: getSettings.woo_checkout,
        item_name: getSettings.title,
        calcTotals: params.totals,
        calcId: getSettings.calc_id,
        orderId: getters.getOrderId,
      };

      if (
        getSettings.woo_products.enable &&
        getSettings.woo_checkout.product_id === 'current_product'
      ) {
        wooData.woo_info.product_id = params.post_id;
      }

      const formData = new FormData();
      formData.append('action', action);
      formData.append('nonce', nonce);

      /** get files **/
      if (typeof params.files !== 'undefined') {
        params.files.forEach((fileItem) => {
          for (const file of fileItem.files) {
            let isInDescription = finalDescription.find(
              (d) => d.alias === fileItem.alias
            );

            /**  append files from fields with
             *  - 'Settings->Zero Values in Grand Total' is disabled
             * - 'FileField->Show in Grand Total' is disabled
             * - 'FileField->Price' is zero */
            if (typeof isInDescription === 'undefined') {
              let fileField = getters.getFieldDescriptionByAlias(
                fileItem.alias
              );
              if (fileField !== null) {
                finalDescription.push(fileField[0]);
              }
            }
            formData.append([fileItem.alias, file.name].join('_ccb_'), file);
          }
        });
      }
      /** get files | End **/

      wooData.descriptions = finalDescription.filter(
        (el) => !el.alias.includes('group')
      );

      formData.append('data', JSON.stringify(wooData));

      const response = await fetch(window.ajax_window.ajax_url, {
        method: 'POST',
        body: formData,
      });

      const resJson = await response.json();
      if (resJson.success) {
        if (params.callback) params.callback();

        if (resJson.page === 'stayOnPage') {
          state.productName = resJson.product_name;
          return false;
        } else {
          location.href = resJson.page;
        }
      }

      return true;
    },
  },

  getters: {
    getProductName: (s) => s.productName,
  },

  mutations: {
    setProductName(state, name) {
      state.productName = name;
    },
  },
};
