import CBuilderFront from '../../../../frontend/components/cost-calc'; // main-component front

import preview from '../calculator/partials/preview';
import ccbModalWindow from '../../utility/modal';
import appearanceRow from './components/appearance-row';
import presetItem from './components/preset-item';

import loader from '../../../../loader';
import { toast } from '../../../../utils/toast';
import quickTourMixin from '../quick-tour/quickTourMixin';

export default {
  mixins: [quickTourMixin],
  components: {
    'calc-builder-front': CBuilderFront, // Front main component and Preview
    preview: preview,
    'ccb-modal-window': ccbModalWindow,
    'appearance-row': appearanceRow,
    'preset-item': presetItem,
    loader,
  },

  data: () => ({
    tab: 'desktop',
    settings: {},
    preloader: false,
    toggleMenu: false,
    updateCounter: 0,
    edit_preset: '',
    types: ['default', 'orange', 'sky', 'black', 'dark_blue'],
    showNotice: true,
  }),

  async mounted() {
    this.settings = this.$store.getters.getSettings;
  },

  computed: {
    isCustom() {
      return !this.types.includes(this.presetIdx);
    },

    isSaved() {
      return this.presetIdx && this.presetIdx.startsWith('saved_');
    },

    appearance: {
      get() {
        return this.$store.getters.getAppearance;
      },

      set(value) {
        this.$store.commit('setAppearance', value);
      },
    },

    presets: {
      get() {
        return this.$store.getters.getPresets;
      },

      set(value) {
        this.$store.commit('setPresets', value);
      },
    },

    presetIdx: {
      get() {
        return this.$store.getters.getPresetIdx || 'default';
      },

      set(value) {
        this.$store.commit('setPresetIdx', value);
      },
    },

    getContainerId() {
      return this.preview === 'mobile'
        ? 'ccb-mobile-preview'
        : 'ccb-desktop-preview';
    },

    settingsField: {
      get() {
        return this.$store.getters.getSettings;
      },

      set(value) {
        this.$store.commit('updateSettings', value);
      },
    },

    fields() {
      const fields = this.appearance[this.tab];
      return fields || [];
    },

    get_styles() {
      if (this.presets.length === 1)
        return {
          opacity: 0.7,
          pointerEvents: 'none',
        };

      return {};
    },
  },

  methods: {
    async gotIt() {
      this.showNotice = false;
      await fetch(
        `${window.ajaxurl}?` +
          new URLSearchParams({
            action: 'ccb_preset_hide_notice',
            nonce: window.ccb_nonces.ccb_preset_hide_notice,
          })
      );
    },

    toggleSettings() {
      this.toggleMenu = !this.toggleMenu;
    },

    async resetType(type) {
      const data = await fetch(
        `${window.ajaxurl}?` +
          new URLSearchParams({
            action: 'ccb_reset_type',
            calc_id: this.$store.getters.getId,
            nonce: window.ccb_nonces.ccb_reset_type,
            selectedIdx: this.presetIdx,
            type,
            device: this.tab,
          })
      );

      const response = await data.json();
      if (response && response.success && response.data) {
        const { reset_data } = response.data;
        const customAppearance = JSON.parse(JSON.stringify(this.appearance));

        for (const key of Object.keys(reset_data)) {
          if (
            customAppearance[this.tab][type] &&
            customAppearance[this.tab][type]['data'][key]
          ) {
            const border = [
              'button_border',
              'container_border',
              'fields_border',
            ];
            const spacing = ['container_margin', 'container_padding'];
            const object_fields = ['container', 'container_shadow'];
            if (object_fields.includes(key)) {
              for (const innerKey of Object.keys(reset_data[key])) {
                customAppearance[this.tab][type]['data'][key]['data'][innerKey][
                  'value'
                ] = reset_data[key][innerKey];
              }
            } else if (border.includes(key)) {
              for (const innerKey of Object.keys(reset_data[key])) {
                customAppearance[this.tab][type]['data'][key]['data'][
                  `border_${innerKey}`
                ]['value'] = reset_data[key][innerKey];
              }
            } else if (spacing.includes(key)) {
              customAppearance[this.tab][type]['data'][key]['data']['bottom'][
                'value'
              ] = reset_data[key][0];
              customAppearance[this.tab][type]['data'][key]['data']['left'][
                'value'
              ] = reset_data[key][0];
              customAppearance[this.tab][type]['data'][key]['data']['right'][
                'value'
              ] = reset_data[key][0];
              customAppearance[this.tab][type]['data'][key]['data']['top'][
                'value'
              ] = reset_data[key][0];
            } else {
              customAppearance[this.tab][type]['data'][key]['value'] =
                reset_data[key];
            }
          }
        }

        this.appearance = customAppearance;

        toast('Changed successfully', 'success');
        this.updateCounter++;
      }
    },

    async saveAsTheme() {
      this.presetIdx = 'saved';
      this.preloader = true;
      await this.$store.dispatch('updateStyles');
      setTimeout(() => {
        this.preloader = false;
        toast('Theme saved successfully', 'success');
      }, 300);
    },

    async removeTheme() {
      if (!confirm('Are you sure to delete this theme?')) return;

      this.preloader = true;

      const data = await fetch(
        `${window.ajaxurl}?` +
          new URLSearchParams({
            action: 'ccb_delete_preset',
            calc_id: this.$store.getters.getId,
            nonce: window.ccb_nonces.ccb_delete_preset,
            selectedIdx: this.presetIdx,
          })
      );

      const response = await data.json();
      if (response && response.success) {
        this.presetIdx = 'default';
        this.presets = response.list;
        this.appearance = response.data;
      }

      setTimeout(() => {
        this.preloader = false;
        toast('Preset deleted successfully', 'success');
      }, 500);
    },

    customizeTheme() {
      this.edit_preset = this.presetIdx;
      this.presetIdx = 'custom';
    },

    async selectPreset(idx) {
      this.edit_preset = '';
      if (this.presetIdx === idx) return;

      this.presetIdx = idx;

      const data = await fetch(
        `${window.ajaxurl}?` +
          new URLSearchParams({
            action: 'ccb_update_preset',
            calc_id: this.$store.getters.getId,
            nonce: window.ccb_nonces.ccb_update_preset,
            selectedIdx: idx,
            editCustom: this.edit_preset,
          })
      );

      const response = await data.json();
      if (response && response.success) {
        this.edit_preset = '';
        this.presets = response.list;
        this.appearance = response.data;
      }

      this.updateCounter++;
    },

    async updateTitle(title) {
      this.presets = this.presets.map((p) => {
        if (p.key === this.presetIdx) p.title = title;
        return p;
      });

      const data = await fetch(
        `${window.ajaxurl}?` +
          new URLSearchParams({
            action: 'ccb_update_preset_title',
            calc_id: this.$store.getters.getId,
            nonce: window.ccb_nonces.ccb_update_preset_title,
            selectedIdx: this.presetIdx,
            title: title,
          })
      );

      const response = await data.json();
      if (response && response.success) {
        toast(response.message, 'success');
      }

      this.updateCounter++;
    },
  },
};
