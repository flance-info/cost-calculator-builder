import calculator from './calculator';
import condition from './condition';
import settings from './settings';
import customize from './appearance';
import loader from '../../../loader';
import copyText from '../utility/copyText';
import { toast } from '../../../utils/toast';
import { removeParams } from '../utility/addParams';
import quickTourMixin from './quick-tour/quickTourMixin';

export default {
  mixins: [quickTourMixin],
  props: ['id'],
  components: {
    loader,
    'ccb-settings-tab': settings,
    'ccb-conditions-tab': condition,
    'ccb-appearances-tab': customize,
    'ccb-calculators-tab': calculator,
  },

  data: () => ({
    newCalc: null,
    preloader: true,
    editable: false,
    shortCode: {
      className: '',
      text: 'Copy',
    },
    showSaveTemplate: false,
  }),

  async mounted() {
    this.initListeners();
    const response = await this.$store.dispatch('edit_calc', { id: this.id });
    if (response.success === false) this.newCalc = true;

    this.editTitle();

    setTimeout(() => {
      this.preloader = false;
      window.ccb_refs = this.$refs;
    }, 300);
  },

  methods: {
    edit_title(value) {
      if (this.$store.getters.getQuickTourStep === '.calc-quick-tour-title-box')
        return;
      this.getEditVal = !!value;
    },

    initListeners() {
      window.addEventListener('click', (e) => {
        if (this.getTourStep !== '.calc-quick-tour-title-box') {
          const classList = [
            'ccb-title',
            'ccb-title-approve ccb-icon-Path-3484',
          ];
          if (!classList.includes(e.target.className)) {
            this.getEditVal = false;
          }
        }
      });
    },

    resetCopy() {
      this.shortCode = {
        className: '',
        text: 'Copy',
      };
    },

    showEmbed() {
      this.$emit('embed-calc', this.$store.getters.getId);
    },

    previewMode() {
      this.$store.commit('setModalType', 'preview');
      this.$store.commit('setOpenModal', true);
    },

    history() {
      this.$store.commit('setModalType', 'history');
      this.$store.commit('setOpenModal', true);
    },

    copyShortCode(id) {
      copyText(id);
      this.shortCode.className = 'copied';
      this.shortCode.text = 'Copied!';
    },

    back() {
      if (!confirm('Are you sure to leave this page?')) return;

      removeParams('id');
      removeParams('action');
      this.$emit('edit-calc', { id: null, step: 'list' });
      this.currentTab = 'calculators';
    },

    goToCreatePage() {
      this.$emit('create-calc-page-from-tour');
    },

    setTab(tab) {
      if (this.currentTab === tab) return;
      if (tab === 'calculators') {
        this.$store.commit('setGlobalErrors', []);
      }

      if (tab === 'conditions') {
        const filterPos = this.$store.getters.getFilterPos;
        const top = filterPos?.top || 0;
        const left = filterPos?.left || 0;

        setTimeout(() => {
          const $el = document.querySelector('.ccb-condition-content');
          $el?.scrollTo(left, top);
        }, 0);
      }
      this.currentTab = tab;
    },

    editTitle() {
      if (this.getTourStep === '.calc-quick-tour-title-box') {
        this.getEditVal = true;
      }

      if (this.title === '') this.title = 'Untitled';
    },

    async saveSettings(saveType) {
      this.$store.commit('setSettingsError', []);
      this.$store.commit('setErrorIdx', []);
      const builders = this.$store.getters.getBuilder;
      const errorIdx = [];
      const settingsError = [];

      /** show embed tour step **/
      if (
        typeof window.$calcGlobalTour !== 'undefined' &&
        'done' !== this.getters.getQuickTourStep
      ) {
        this.showEmbed();
        this.quickTourLastStep('.ccb-embed', window.$calcGlobalTour);
        return;
      }

      const settings = this.$store.getters.getSettings;
      if (settings.thankYouPage?.type) {
        const ty = settings.thankYouPage;
        if (ty.type === 'separate_page' && !ty.page_id) {
          settingsError.push({ type: 'thankYouPage', field: 'page_id' });
        }

        if (ty.type === 'custom_page' && !ty.custom_page_link.trim()) {
          settingsError.push({
            type: 'thankYouPage',
            field: 'custom_page_link',
          });
        }
      }

      builders.forEach((b, idx) => {
        if (b._id === undefined) {
          errorIdx.push(idx);
        }
      });

      if (errorIdx.length || settingsError.length) {
        if (this.getTourStep !== 'done') {
          this.quickTourStarted = false;
          this.getTourStep = 'done';
          this.$store.dispatch('skipCalcQuickTour');
        }

        if (this.currentTab !== 'calculators') {
          this.$store.commit('setGlobalErrors', errorIdx);
        }

        this.$store.commit('setErrorIdx', errorIdx);
        this.$store.commit('setSettingsError', settingsError);

        toast('Some fields are required', 'error');
        return;
      }

      this.preloader = true;
      await this.$store.dispatch('saveSettings', { type: saveType });
      await this.$store.dispatch('updateStyles');

      let text = 'Changes Saved';
      if (saveType === 'template') {
        text = 'Saved as template';
        await this.$store.dispatch('saveTemplate');
      }

      setTimeout(() => {
        this.preloader = false;
        this.showSaveTemplate = false;
        toast(text, 'success');
      }, 1000);
    },
  },

  computed: {
    calculatorTitle() {
      return this.$store.getters.getTitle.length < 13
        ? this.$store.getters.getTitle
        : this.$store.getters.getTitle.substring(0, 13) + '...';
    },

    getEditVal: {
      get() {
        return this.editable;
      },

      set(value) {
        this.editable = value;
      },
    },

    currentTab: {
      get() {
        return this.currentTabInner;
      },

      set(value) {
        this.$store.commit(
          'setFieldsKey',
          this.$store.getters.getFieldsKey + 1
        );
        this.currentTabInner = value;
      },
    },

    currentTabInner: {
      get() {
        return this.$store.getters.getCurrentTab;
      },

      set(value) {
        this.$store.commit('setCurrentTab', value);
      },
    },

    getActiveTab() {
      return `ccb-${this.currentTab}-tab`;
    },

    title: {
      get() {
        return this.$store.getters.getTitle;
      },

      set(value) {
        this.$store.commit('setTitle', value);
      },
    },

    getTourStep() {
      return this.$store.getters.getQuickTourStep;
    },
  },

  filters: {
    'to-short': (value) => {
      if (value.length >= 23) {
        return value.substring(0, 20) + '...';
      }
      return value;
    },
  },
};
