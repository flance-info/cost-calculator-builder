export default {
  state: {
    calc_forms: {},
  },
  mutations: {
    setDescOptions(state, options) {
      state.desc_options = options || {};
    },
    updateAll(state, response) {
      state.desc_options = response.desc_options;
      state.forms = response.forms;
      state.pages = response.pages;
      state.products = response.products;
      state.categories = response.categories;
      state.woo_meta_links =
        typeof response.settings?.woo_products?.meta_links !== 'undefined'
          ? response.settings.woo_products.meta_links
          : [];

      if (response.settings && response.settings.general)
        state.settings = this._vm.$validateData(
          this._vm.$deepMerge(state.settings, response.settings)
        );
    },

    updateSettings(state, settings) {
      if (settings?.hasOwnProperty('general'))
        state.settings = this._vm.$validateData(
          this._vm.$deepMerge(state.settings, settings)
        );
    },
  },
  getters: {
    getTab: (state) => state.tab,
    getForms: (state) => state.forms,
  },
};
