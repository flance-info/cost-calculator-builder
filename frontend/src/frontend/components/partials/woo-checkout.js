import Helpers from '../../../utils/helpers';
import PaymentHelper from '../../../utils/payments';
import fieldsMixin from '../fields/fieldsMixin';

export default {
  mixins: [fieldsMixin],
  data: () => ({
    loader: false,
    message: false,
  }),

  methods: {
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

    async applyWoo(post_id) {
      if (this.$store.getters.hasUnusedFields) {
        const [first] = this.$store.getters.getUnusedFields;
        if (first?.alias) this.scrollIntoRequired(first.alias);
        return;
      }

      /** IF demo or live site ( demonstration only ) **/
      if (this.$store.getters.getIsLiveDemoLocation) {
        let demoModeDiv = this.getDemoModeNotice();
        let purchaseBtn = this.$el.querySelector('button');
        purchaseBtn.parentNode.after(demoModeDiv);
        return;
      }
      /** END| IF demo or live site ( demonstration only ) **/
      const response = await this.sendWooData();

      if (response && response.data.status === 'success') {
        this.wooApply(post_id, this);
      }
    },
    ...Helpers,
    ...PaymentHelper,
  },

  computed: {
    formulas() {
      return this.getWooCheckoutSettings?.formulas;
    },

    btnStyles() {
      const appearance = this.$store.getters.getAppearance;
      const btnAppearance = this.getElementAppearanceStyleByPath(
        appearance,
        'elements.primary_button.data'
      );

      let result = {};

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

    getSettings() {
      return this.$store.getters.getSettings;
    },

    getWooCheckoutSettings() {
      return this.getSettings.woo_checkout;
    },
  },
};
