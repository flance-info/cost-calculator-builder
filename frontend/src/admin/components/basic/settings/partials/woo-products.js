import settingsMixin from './settingsMixin';
import singleProBanner from '../../pro-banners/single-pro-banner';

export default {
  mixins: [settingsMixin],

  data: () => ({
    woo_product_id_all: false,
    woo_category_id_all: false,
    woo_meta_labels: { price: 'Product price', quantity: 'Product stock' },
  }),

  components: {
    singleProBanner,
  },

  computed: {
    woo_meta_links: {
      get() {
        return this.$store.getters.getWooMetaLinks;
      },

      set(links) {
        this.$store.commit('updateWooMetaLinks', links);
      },
    },

    exist_woo_product_category_ids() {
      const categories = this.$store.getters.getCategories;
      return !categories?.length
        ? []
        : categories.map((category) => category.term_id);
    },

    exist_woo_product_ids() {
      const products = this.$store.getters.getProducts;
      return !products?.length ? [] : products.map((product) => product.ID);
    },

    getGroupedFields() {
      const fieldFromStore = this.$store.getters.getBuilder;
      const repeaterFields = fieldFromStore.filter(
        (f) => f.groupElements && f.groupElements.length
      );

      const innerFields = [];
      for (const field of repeaterFields) {
        innerFields.push(...field.groupElements);
      }

      return innerFields;
    },

    /** ccb fields (quantity, range) for 'Product stock' type */
    ccb_fields_for_product_stock() {
      const fieldFromStore = this.$store.getters.getBuilder;
      const innerFields = this.getGroupedFields;

      let fields = [
        ...fieldFromStore.filter((f) => !f.alias.includes('repeater')),
        ...innerFields,
      ];

      fields = fields.filter((field) => {
        return (
          field.alias.startsWith('quantity') || field.alias.startsWith('range')
        );
      });
      return fields;
    },
  },

  mounted() {
    // hotfix , need to check why empty string is created as array item
    this.settingsField.woo_products.category_ids =
      this.settingsField.woo_products.category_ids.filter((item) => item);

    this.settingsField.woo_products.product_ids =
      this.settingsField.woo_products.product_ids.filter((item) => item);

    /* set woo_category_id_all to true if all categories choosen i*/
    if (
      Array.isArray(this.settingsField.woo_products.category_ids) &&
      Array.isArray(this.exist_woo_product_category_ids)
    ) {
      this.woo_category_id_all =
        this.settingsField.woo_products.category_ids.length ===
          this.exist_woo_product_category_ids.length &&
        this.settingsField.woo_products.category_ids.every(
          (v, i) => v === this.exist_woo_product_category_ids[i]
        );
    }

    if (
      Array.isArray(this.settingsField.woo_products.product_ids) &&
      Array.isArray(this.exist_woo_product_ids)
    ) {
      this.woo_product_id_all =
        this.settingsField.woo_products.product_ids.length ===
          this.exist_woo_product_ids.length &&
        this.settingsField.woo_products.product_ids.every(
          (v, i) => v === this.exist_woo_product_ids[i]
        );
    }
  },

  methods: {
    updateWooType(type) {
      if (type === 'by_category') {
        if (this.settingsField.woo_products.by_category === true) {
          this.settingsField.woo_products.by_product = false;
        }
      } else {
        if (this.settingsField.woo_products.by_product === true) {
          this.settingsField.woo_products.by_category = false;
        }
      }
    },

    addWooMetaLink() {
      this.$store.commit('addWooMetaLink');
    },

    /**
     * get woocommerce category name by term id
     */
    getWooCategoryNameById(id) {
      let woo_category = this.$store.getters.getCategories.find(
        (c) => c.term_id === id
      );
      if (typeof woo_category !== 'undefined') {
        return woo_category.name;
      }
    },

    getWooProductNameById(id) {
      let woo_category = this.$store.getters.getProducts.find(
        (c) => c.ID === id
      );
      if (typeof woo_category !== 'undefined') {
        return woo_category.post_title;
      }
    },

    /** for now just 'quantity' type fields */
    ccb_fields_for_link(wooMeta) {
      if ('quantity' === wooMeta) {
        return this.ccb_fields_for_product_stock;
      }

      const ignoreFields = [
        'text',
        'line',
        'html',
        'total',
        'file_upload',
        'datePicker',
        'timePicker',
      ];

      const fieldFromStore = this.$store.getters.getBuilder.filter((f) => {
        if (!f.alias) return false;
        const fieldName = f.alias.replace(/\_field_id.*/, '');
        return !ignoreFields.includes(fieldName);
      });

      // TODO uncomment code when repeater field will integrate with woo meta
      // const innerFields = this.getGroupedFields;

      return [
        ...fieldFromStore.filter((f) => !f.alias.includes('repeater')),
        // TODO uncomment code when repeater field will integrate with woo meta
        // ...innerFields,
      ];
    },

    /**
     * check/uncheck category id from multiselect
     * @param category_id - woocommerce category id
     */
    multiselectChooseWooCategories(category_id) {
      let category_ids = this.settingsField.woo_products.category_ids;
      if ('all' === category_id) {
        this.woo_category_id_all = !this.woo_category_id_all;
        if (this.woo_category_id_all) {
          category_ids = this.exist_woo_product_category_ids.concat();
        } else {
          category_ids = [];
        }
        this.$store.commit('updateWooCategoryIds', category_ids);
        return;
      }

      this.woo_category_id_all = false;
      let index = category_ids.indexOf(category_id);
      if (index !== -1) {
        category_ids.splice(index, 1);
        return;
      }
      category_ids.push(category_id);
      this.$store.commit('updateWooCategoryIds', category_ids);
    },

    /**
     * check/uncheck product id from multiselect
     * @param product_id - woocommerce product id
     */
    multiselectChooseWooProducts(product_id) {
      let product_ids = this.settingsField.woo_products.product_ids;
      if ('all' === product_id) {
        this.woo_product_id_all = !this.woo_product_id_all;
        if (this.woo_product_id_all) {
          product_ids = this.exist_woo_product_ids.concat();
        } else {
          product_ids = [];
        }
        this.$store.commit('updateWooProductIds', product_ids);
        return;
      }

      this.woo_product_id_all = false;
      let index = product_ids.indexOf(product_id);
      if (index !== -1) {
        product_ids.splice(index, 1);
        return;
      }

      product_ids.push(product_id);
      this.$store.commit('updateWooProductIds', product_ids);
    },

    removeWooMetaLink(index) {
      let links = this.$store.getters.getWooMetaLinks.filter(
        (e, i) => i !== index
      );
      this.$store.commit('updateWooMetaLinks', links);
    },
  },

  watch: {
    woo_meta_links: {
      handler(data) {
        if (typeof data === 'undefined' || !(data instanceof Array)) {
          return;
        }
        let changed = false;
        data.forEach((metaLink, index) => {
          if (
            'quantity' === metaLink.woo_meta &&
            metaLink.calc_field.indexOf('quantity') === -1 &&
            metaLink.calc_field.indexOf('range') === -1
          ) {
            data[index].calc_field = '';
            changed = true;
          }
        });
        if (changed) {
          this.woo_meta_links = data;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
