export default {
  props: {
    nodes: {
      type: Object,
      required: true,
    },
    links: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      filterBodyHeight: '100%',
      currentFilterBodyHeight: '100%',
      filterTop: 0,
      filterLeft: 0,
      filterBottom: undefined,
      showFilter: false,
      hasBottom: false,
      containerHeight: 0,
      toggleBar: false,
      searchText: '',
    };
  },

  mounted() {
    const toggleBar = localStorage.getItem('conditionBarStatus');
    if (typeof toggleBar !== 'undefined')
      this.toggleBar = JSON.parse(toggleBar);

    setTimeout(() => {
      this.initTotalSummaryAccordion();
    }, 300);
    this.showFilter = true;
  },

  computed: {
    getFilterStyles() {
      if (!this.containerHeight) {
        const $container = document.querySelector('.ccb-condition-content');
        this.containerHeight = $container?.offsetHeight || 0;
      }

      const filterPos = this.$store.getters.getFilterPos;
      this.filterTop = filterPos?.top || 0;
      this.filterLeft = filterPos?.left || 0;

      const left = this.filterLeft + 20;
      const top = this.filterTop + 20;
      const len = Object.keys(this.getGroupedElements).length;

      if (len) {
        const elementHeight = 38;
        const elementGap = 4;
        const fixedFilterHeight = 139;
        const canvasMaxHeight = 3000;

        const contentHeight =
          len * elementHeight + (len - 1) * elementGap + fixedFilterHeight;
        this.hasBottom = this.containerHeight - 40 > contentHeight;
        this.filterBottom =
          canvasMaxHeight - (this.containerHeight - 20) - this.filterTop;
      }

      return {
        left: `${left}px`,
        top: `${top}px`,
        bottom:
          this.currentFilterBodyHeight === '0px' || this.hasBottom
            ? undefined
            : `${this.filterBottom}px`,
        height: this.currentFilterBodyHeight === '0px' ? 'auto' : '',
      };
    },

    getters() {
      return this.$store.getters;
    },

    getActions() {
      return [
        {
          label: this.translations?.all_in_canvas,
          value: 'all',
        },
        {
          label: this.translations?.triggers_other_field,
          value: 'triggers',
        },
        {
          label: this.translations?.affects_by_other_field,
          value: 'affects',
        },
      ];
    },

    getGroupedElements() {
      let elements = [];
      const action = String(this.actionType);

      if (action === 'all') {
        elements = this.nodes.map((n) => {
          const field = this.getElements.find((f) => f.alias === n.options);
          const alias = field?.alias || n.options;
          const icon = field?.icon || n.icon;
          return { alias, icon, label: n.label };
        });
      } else {
        const fields = this.getElements;
        const filteredWithId = {};
        for (const link of this.links) {
          if (action === 'affects') {
            filteredWithId[link.to] = link.options_to;
          } else {
            filteredWithId[link.from] = link.options_from;
          }
        }

        let untitledIdx = 1;
        elements = Object.values(filteredWithId).map((alias) => {
          const field = fields.find((f) => f.alias === alias);
          if (!field) return null;

          let label = field.label;
          if (!label?.length) {
            label = `Untitled ${untitledIdx}`;
            untitledIdx++;
          }

          return {
            label,
            icon: field.icon,
            alias: field.alias,
          };
        });
      }

      const filteredElements = this.searchText
        ? elements.filter((e) => {
            const searchText = this.searchText.toLowerCase();
            if (!e.label.toLowerCase().includes(searchText)) {
              return false;
            }

            const escapedSearchText = searchText.replace(
              /[.*+?^${}()|[\]\\]/g,
              '\\$&'
            );
            e.label = e.label.replace(
              new RegExp(escapedSearchText, 'gi'),
              (match) => `<span class="highlight">${match}</span>`
            );

            return e;
          })
        : elements;

      const mappedElements = {};
      for (const e of filteredElements) {
        if (mappedElements[e.alias]) {
          mappedElements[e.alias].elements.push(e);
        } else {
          mappedElements[e.alias] = {
            icon: e.icon,
            label: e.label,
            alias: e.alias,
            elements: [e],
          };
        }
      }

      return mappedElements;
    },

    actionType: {
      get() {
        return this.getters.getConditionActionType || 'all';
      },

      set(value) {
        this.$store.commit('setFilteredElements', '');
        if (value) {
          this.$store.commit('setConditionActionType', value);
        }
      },
    },

    getElements() {
      return this.getters.getBuilder.map((b) => {
        const field = this.getters.getFields.find((f) => f.tag === b._tag);
        if (field) {
          b.icon = field.icon;
        }
        return b;
      });
    },

    translations() {
      return window.ajax_window.translations;
    },

    elementStyle() {
      return {
        padding: this.hasBottom ? '' : '0 16px 16px',
        marginBottom: this.hasBottom ? '' : '15px',
        overflow: this.hasBottom ? 'hidden' : '',
      };
    },

    getSearchImg() {
      return `${window.ajax_window.plugin_url}/frontend/dist/img/search.png`;
    },
  },

  methods: {
    updateToggle() {
      this.toggleBar = !this.toggleBar;
      localStorage.setItem('conditionBarStatus', this.toggleBar);
    },

    toggleAccordion() {
      if (this.$refs.conditionFilterCollapse) {
        this.currentFilterBodyHeight =
          this.currentFilterBodyHeight === '0px' ? '100%' : '0px';
      }
    },
    initTotalSummaryAccordion() {
      if (this.$refs.conditionFilterCollapseToggle) {
        setTimeout(() => {
          if (this.$refs.conditionFilterCollapse) {
            this.filterBodyHeight =
              this.$refs.conditionFilterCollapse.scrollHeight + 'px';
          }
        }, 0);
      }
    },

    applyFilter(value) {
      this.$emit('reset');
      this.$store.commit('setFilteredElements', value);
    },
  },

  template: `
        <div class="calc-condition-filter-container" :style="getFilterStyles" v-if="showFilter" :class="{'ccb-hide-bar': toggleBar}">
          <div class="calc-condition-filter-container-search" v-if="toggleBar" @click.prevent="updateToggle">
            <img :src="getSearchImg" alt="search" width="24" height="24">
          </div>
          <template v-else>
            <div class="calc-condition-filter-header" @click.prevent="updateToggle">
              <img :src="getSearchImg" alt="search" width="24" height="24">
              <span class="ccb-heading-5 ccb-bold">{{ translations?.find_element }}</span>
              <span class="calc-filter-collapse-box" ref="conditionFilterCollapseToggle" @click="toggleAccordion">
                    <i class="ccb-icon-Path-3398"></i>
                </span>
            </div>
            <div class="calc-condition-filter-search">
              <div class="ccb-input-wrapper">
                <input type="text" :placeholder="translations?.enter_title" v-model="searchText">
              </div>
            </div>
            <div class="calc-condition-filter-body">
              <div class="ccb-select-box">
                <div class="ccb-select-wrapper">
                  <i class="ccb-icon-Path-3485 ccb-select-arrow" style="z-index: 1"></i>
                  <select class="ccb-select" v-model="actionType" style="z-index: 2; background: transparent; cursor: pointer">
                    <option v-for="a in getActions" :value="a.value">{{ a.label }}</option>
                  </select>
                </div>
              </div>
              <div class="calc-condition-filter-elements ccb-custom-scrollbar" :style="elementStyle" v-if="Object.keys(getGroupedElements || {}).length">
                <div class="calc-condition-filter-element" v-for="e of getGroupedElements" @click="applyFilter(e.alias)">
                  <span class="ccb-filter-icon-box">
                      <span :class="e.icon"></span>
                  </span>
                  <span class="ccb-filter-title-box">
                    <span class="ccb-filter-title ccb-default-title">
                      <span v-html="e.label"></span>
                      <span class="ccb-count" v-if="e.elements?.length > 1">({{ e.elements.length }})</span>
                    </span>
                  </span>
                </div>
              </div>
              <div v-else class="calc-condition-filter-no-elements">
                <span>{{ translations?.no_element }}</span>
              </div>
            </div>
          </template>
        </div>
    `,
};
