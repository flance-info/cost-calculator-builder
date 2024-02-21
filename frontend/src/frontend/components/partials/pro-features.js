import payment from './payment';
import wooCheckout from './woo-checkout';
import calcForm from './calc-form';
import invoiceBtn from './invoice-btn';
import fieldsMixin from '../fields/fieldsMixin';

export default {
  mixins: [fieldsMixin],
  props: {
    settings: {
      default: {},
    },
  },

  data: () => ({
    type: '',
  }),

  created() {
    const settings = this.settings;
    const payment_gateway = settings.payment_gateway;
    const email = settings.formFields.accessEmail || false;
    const use_payment = (settings.formFields.payment && email) || false;
    const woo_checkout = settings.woo_checkout.enable || false;

    const all_payments = [
      {
        payment: 'woo_checkout',
        enabled: settings.woo_checkout.enable || false,
      },
      { payment: 'paypal', enabled: payment_gateway?.paypal.enable || false },
      {
        payment: 'twoCheckout',
        enabled:
          payment_gateway?.cards?.card_payments?.twoCheckout?.enable || false,
      },
      {
        payment: 'razorpay',
        enabled:
          payment_gateway?.cards?.card_payments?.razorpay?.enable || false,
      },
      {
        payment: 'stripe',
        enabled: payment_gateway?.cards?.card_payments?.stripe?.enable || false,
      },
      {
        payment: 'cash_payment',
        enabled: payment_gateway?.cash_payment.enable || false,
      },
    ];
    const enabled_payments = all_payments.filter(
      (payment) => payment.enabled === true
    );

    if (use_payment) {
      this.type = 'form';
    } else {
      if (woo_checkout && enabled_payments.length === 1) {
        this.type = 'woo_checkout';
      } else {
        this.type = email
          ? 'form'
          : enabled_payments.length
          ? 'payment'
          : 'invoiceBtn';
      }
    }
  },

  components: {
    'calc-form': calcForm,
    'calc-payments': payment,
    'calc-woo-checkout': wooCheckout,
    'invoice-btn': invoiceBtn,
  },
};
