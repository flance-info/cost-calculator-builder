import Customize from '../../../../../utils/customize';
import colorAppearance from '../fields/color';
import backgroundAppearance from '../fields/background';
import borderAppearance from '../fields/border';
import borderRadiusAppearance from '../fields/border-radius';
import indentAppearance from '../fields/indent';
import numberAppearance from '../fields/number';
import radioAppearance from '../fields/radio';
import selectAppearance from '../fields/select';
import shadowAppearance from '../fields/shadow';
import switcherAppearance from '../fields/switcher';
import toggleAppearance from '../fields/toggle';
import buttonAppearance from '../fields/buttons';
import preloaderAppearance from '../fields/preloader';
import containerAppearance from '../fields/container';
import layout from '../fields/layout';

import $ from 'jquery';

export default {
  props: ['type', 'is_color', 'custom'],
  components: {
    'background-field': backgroundAppearance,
    'border-field': borderAppearance,
    'border-radius-field': borderRadiusAppearance,
    'color-field': colorAppearance,
    'indent-field': indentAppearance,
    'number-field': numberAppearance,
    'radio-field': radioAppearance,
    'select-field': selectAppearance,
    'shadow-field': shadowAppearance,
    'switcher-field': switcherAppearance,
    'toggle-field': toggleAppearance,
    'button-field': buttonAppearance,
    'preloader-field': preloaderAppearance,
    'container-field': containerAppearance,
    'layout-field': layout,
  },

  data: () => ({
    collapsed: [],
    preset_key: '',
  }),

  methods: {
    /** get element path name **/
    getElementPathName(pathData) {
      return pathData.join('.');
    },

    stateChanged() {
      this.initEffects();
    },

    toggleCollapse(idx) {
      const key = `${this.type}_${idx}`;
      if (this.collapsed.includes(key)) {
        this.collapsed = this.collapsed.filter((i) => i !== key);
      } else {
        this.collapsed.push(key);
      }

      $(`*[data-collapse="${key}"]`).fadeToggle();
    },

    reset(type) {
      this.$emit('reset', type);
    },

    ...Customize,
  },

  computed: {
    appearance: {
      get() {
        return this.$store.getters.getAppearance;
      },

      set(value) {
        this.$store.commit('setAppearance', value);
      },
    },

    fields() {
      this.collapsed = [];
      const type = this.type || 'desktop';
      this.preset_key = this.appearance.preset_key;
      return this.appearance[type];
    },

    settingsField() {
      return this.$store.getters.getSettings;
    },
  },

  template: `
          <div class="container" style="padding: 0; margin: 0;">
            <template v-for="(field, index) in fields">
              <div class="row ccb-custom-row" style="row-gap: 15px; margin-left: -10px; margin-right: -10px" v-if="field.label">
                <div class="custom-col col-12">
                  <span class="col-12 ccb-heading-5 ccb-bold ccb-label">
                     <span class="ccb-label-inner" @click="() => toggleCollapse(index)">
                       <i class="ccb-icon-Path-3485" :class="{'collapsed': collapsed.includes(type + '_' + index)}"></i>
                       {{ field.label }}
                     </span>
                     <span class="ccb-label-reset" :class="{'hide-reset': collapsed.includes(type + '_' + index), 'disable-reset': custom}" @click="() => reset(index)">Reset</span>
                  </span>
                </div>
              </div>
              <div class="row ccb-custom-row ccb-custom-content custom-collapse" :data-collapse="type + '_' + index" style="row-gap: 15px; margin-left: -10px; margin-right: -10px; align-items: flex-end;" :key="type + '_' + index">
                <div v-for="(data, idx) in field.data" :class="data.col" class="custom-col ccb-custom-collapse">
                  <span v-if="data.label && idx.indexOf('horizontal_view') === -1 && data.type !== 'toggle'" class="ccb-default-description opacity-1 ccb-bold" style="display: flex; margin-bottom: 5px">
                    {{ data.label }}
                      <span class="ccb-help-tip-block" style="margin-top: 2px;" v-if="data.hint">
                        <i class="ccb-icon-Path-3367"></i>
                          <span class="ccb-help ccb-help-settings appearance-hint">
                            <span class="ccb-help-content">
                              <span class="ccb-help-content-img-box">
                                <img v-if="data.hint.image" :src="data.hint.image" alt="woo logo">
                              </span>
                              <span class="ccb-help-content-text-box">
                                <span class="ccb-help-content-title ccb-default-title large ccb-bold">{{ data.hint.label }}</span>
                                <span class="ccb-help-content-description ccb-default-description">{{ data.hint.content }}</span>
                                <a class="ccb-button ccb-href doc" target="_blank" :href="data.hint.link">Documentation</a>
                              </span>
                            </span>
                         </span>
                      </span>
                  </span>
                  <component :is="data.type + '-field'" :preset_key="preset_key" :name="getElementPathName([type, index, idx, 'data', index])" :element="data" @change="stateChanged"></component>
                </div>
              </div>
            </template>
          </div>
	
	`,
};
