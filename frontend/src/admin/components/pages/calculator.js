import calculatorList from '../basic';
import calculatorTab from '../basic/tab';
import demoImport from '../basic/calculator/partials/demo-import';
import templatesContainer from '../templates/template-container';
import ccbEmbed from '../embed/embed';
import { removeParams } from '../utility/addParams';

export default {
  components: {
    'templates-container': templatesContainer,
    'calculators-list': calculatorList,
    'calculators-tab': calculatorTab,
    'ccb-demo-import': demoImport,
    'ccb-embed': ccbEmbed,
  },

  mounted() {
    window.$ccb_admin_calculator = this;
  },

  data: () => ({
    calcId: null,
    args: null,
    step: 'list',
    preloader: false,
    calcQuickTourStarted: false,
  }),

  created() {
    if (this.$checkUri('action') === 'edit' && this.$checkUri('id')) {
      if (this.getTourStep !== 'done')
        this.getTourStep = '.calc-quick-tour-title-box';
      this.editCalc({ id: this.$checkUri('id'), step: 'create' });
    } else {
      if (this.getTourStep !== 'done') this.getTourStep = 'quick_tour_start';
    }
  },

  methods: {
    showEmbed(id) {
      this.$refs.embedCalc.showEmbedPopup(id);
    },

    createCalcPage() {
      this.$refs.embedCalc.closePopup();

      removeParams('id');
      removeParams('action');
      this.editCalc({ step: 'templates' });
    },
    editCalc({ id, step, args }) {
      const isCreate = step === 'create';
      this.$store.commit(
        'setHideHeader',
        step === 'demo-import' ? false : isCreate
      );
      this.calcId = id;
      if (args !== undefined) {
        this.args = args;
      }
      this.step = step;
    },
  },

  computed: {
    getTourStep: {
      get() {
        return this.$store.getters.getQuickTourStep;
      },

      set(value) {
        this.$store.commit('setQuickTourStep', value);
      },
    },
  },
};
