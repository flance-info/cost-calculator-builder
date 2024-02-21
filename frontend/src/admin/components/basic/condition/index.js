import flowChart from './flow-chart';
import ccbModalWindow from '../../utility/modal';
import preview from '../calculator/partials/preview';
import quickTourMixin from '../quick-tour/quickTourMixin';
import hintMixin from '../quick-tour/hintMixin';
import VueTimepicker from 'vue2-timepicker';
import 'vue2-timepicker/dist/VueTimepicker.css';
import confirmPopup from '../../utility/confirmPopup';
import customDateCalendarField from '../condition/custom-date-calendar';
import jQuery from 'jquery';
import singleProBanner from '../pro-banners/single-pro-banner';

export default {
  mixins: [quickTourMixin, hintMixin],
  components: {
    preview,
    'flow-chart': flowChart,
    'ccb-modal-window': ccbModalWindow,
    'ccb-confirm-popup': confirmPopup,
    'custom-date-calendar': customDateCalendarField,
    'single-pro-banner': singleProBanner,
    VueTimepicker,
  },
  props: ['available', 'conditions'],
  data() {
    return {
      allowAdd: true,
      open: false,
      once: false,
      height: 3000,
      width: 3000,
      elements: [],
      tempModel: [],
      newNodeLabel: '',
      currentId: null,
      scene: {
        centerX: 0,
        centerY: 0,
        scale: 1,
        nodes: [],
        links: [],
        /** node css width in px **/
        nodeDefaultWidth: 230,
        /** node css height in px **/
        nodeDefaultHeight: 46,
      },
      condition: {
        hide: false,
        open: false,
      },
      conditionData: {},
      nodeCount: 0,
      inputTypeFields: [
        // Set value for condition
        'cost-range',
        'cost-quantity',
        'cost-multi-range',
        'date-picker',
        'cost-total',
        'cost-file-upload',
        'cost-checkbox',
        'cost-checkbox-with-image',
        'cost-toggle',
      ],
      isDefaultPosition: true,
      startFromNodeKey: 0,
      nodeInterval: 10 /** in px **/,
      collapse: false,
      pos: { top: 0, left: 0, x: 0, y: 0 },
      $container: null,
      confirmPopup: false,
    };
  },

  computed: {
    getters() {
      return this.$store.getters;
    },

    getElements() {
      let untitledIdx = 1;
      const fields = JSON.parse(JSON.stringify(this.getters.getBuilder || []));
      return fields
        .map((b) => {
          const field = this.getters.getFields.find((f) => f.tag === b._tag);
          if (!b.label?.length) {
            b.label = `Untitled ${untitledIdx}`;
            untitledIdx++;
          }

          if (field) {
            b.icon = field.icon;
            b.text = field.description;
          }
          return b;
        })
        .filter((f) => f.alias)
        .filter((f) => !f.alias.includes('repeater'));
    },

    rootDiv() {
      const clientRect = document
        .getElementsByClassName('flowchart-container')[0]
        .getBoundingClientRect();
      if (clientRect) clientRect.height = this.height;
      return clientRect;
    },

    centerTopPosition() {
      return (
        parseInt(this.rootDiv.height) / 2 - this.scene.nodeDefaultHeight / 2
      );
    },

    centerLeftPosition() {
      return parseInt(this.rootDiv.width) / 2 - this.scene.nodeDefaultWidth / 2;
    },

    /**
     * node can't be beyond the parent div borders
     * 5 is little padding buffer
     **/
    nodeStyleMaxPossibleTop() {
      return this.rootDiv.height - this.scene.nodeDefaultHeight - 5;
    },

    /**
     * node can't be beyond the parent div borders
     * 5 is little padding buffer
     **/
    nodeStyleMaxPossibleLeft() {
      return this.rootDiv.width - this.scene.nodeDefaultWidth - 5;
    },
  },

  methods: {
    refreshAvailable() {
      this.$store.commit(
        'updateAvailableFields',
        this.$store.getters.getBuilder
      );
      this.conditions = this.$store.getters.getConditions || {};
      this.scene.nodes = this.conditions.nodes;
      this.scene.links = this.conditions.links;
    },

    refreshResponsive() {
      let { nodes, links } = this.$store.getters.getConditions;
      if (links) {
        links = links.map((link) => {
          const { target } = link;
          if (target) {
            link.input_coordinates.x = target.x;
            link.input_coordinates.y = target.y;
          }
          return link;
        });
      }

      this.$store.commit('setConditions', {
        links: links || [],
        nodes: nodes || [],
      });
    },

    addNode(element) {
      if (!element) return;
      let maxID = Math.max(0, ...this.scene.nodes.map((link) => link.id));
      let calculable =
        ['cost-html', 'cost-line', 'cost-text'].indexOf(element._tag) === -1;
      if (
        (element._tag === 'date-picker' && parseInt(element.range) === 0) ||
        element._tag === 'time-picker' ||
        element._tag === 'cost-group'
      )
        calculable = false;

      if (element._tag === 'cost-file-upload' && parseInt(element.price) <= 0)
        calculable = false;

      const $el = document.querySelector('.ccb-condition-content');
      const filterPos = this.$store.getters.getFilterPos;

      let y = filterPos.top + ($el.offsetHeight / 2 - 40);
      let x = filterPos.left + ($el.offsetWidth / 2 - 240);

      if (this.scene.nodes.length > 0) {
        this.nodeCount = this.nodeCount + 1;

        /**  Get index of last centered node if exist **/
        const lastCenterNodeIndex = parseInt(
          this.scene.nodes
            .map((node) => x === node.x && y === node.y)
            .lastIndexOf(true)
        );
        this.startFromNodeKey =
          lastCenterNodeIndex === -1 ? 0 : lastCenterNodeIndex;

        for (let i = 0; i < this.nodeCount; i++) {
          const defaultXPosition = x + i * this.nodeInterval;
          const defaultYPosition = y + i * this.nodeInterval;

          const nodes = this.scene.nodes;
          const key = i + this.startFromNodeKey;

          if (
            (typeof nodes[key] === 'object' &&
              (defaultXPosition !== nodes[key].x ||
                defaultYPosition !== nodes[key].y)) ||
            typeof nodes[key] === 'undefined'
          ) {
            this.isDefaultPosition = false;
          }
        }

        if (!this.isDefaultPosition) {
          this.nodeCount = 0;
          this.isDefaultPosition = true;
        }

        y = y + this.nodeCount * this.nodeInterval;
        x = x + this.nodeCount * this.nodeInterval;
      }

      // check is inside parent here
      if (y > this.nodeStyleMaxPossibleTop) {
        y = this.nodeStyleMaxPossibleTop;
      }
      if (x > this.nodeStyleMaxPossibleLeft) {
        x = this.nodeStyleMaxPossibleLeft;
      }

      const nodeElement = {
        calculable,
        y: y,
        x: x,
        id: maxID + 1,
        icon: element.icon,
        label: element.label,
        options: element.alias || `id_for_label_${element._id}`,
      };
      if (element.format !== 'undefined') {
        nodeElement.format = element.format;
      }
      this.scene.nodes.push(nodeElement);

      this.change();
    },

    saveConditionSettings() {
      const data = {
        nodes: this.scene.nodes,
        links: this.scene.links,
      };

      this.$emit('save', data);
    },

    newNode(field) {
      if (this.allowAdd) {
        this.allowAdd = false;
        this.addNode(field);
      }

      setTimeout(() => (this.allowAdd = true));
    },

    getByAlias(alias) {
      return this.$store.getters.getFieldByAlias(alias);
    },

    linkEdit(event, data) {
      const vm = this;
      const link = document.querySelector(`[data-link='${data.id}']`);

      if (typeof link !== 'undefined') link.classList.add('ccb-link-active');

      this.$store.commit('updateConditionData', {});
      this.$store.commit('updateConditionModel', []);

      const optionsTo = vm.getByAlias(data.options_to);
      const optionsFrom = vm.getByAlias(data.options_from);

      vm.conditionData.id = data.id;
      vm.conditionData.optionTo = optionsTo.alias;
      vm.conditionData.optionFrom = optionsFrom.alias;
      vm.conditionData.checkedValues = data.checkedValues || [];
      vm.conditionData.type =
        this.inputTypeFields.indexOf(optionsFrom._tag) !== -1
          ? 'input'
          : 'select';
      vm.conditionData.actionType =
        ['cost-html', 'cost-line', 'cost-text', 'cost-total'].indexOf(
          optionsTo._tag
        ) !== -1
          ? 'simple'
          : 'calc';
      vm.conditionData.actionType =
        [
          'cost-multi-range',
          'date-picker',
          'cost-drop-down-with-image',
        ].indexOf(optionsTo._tag) !== -1
          ? 'pro'
          : vm.conditionData.actionType;

      const params = optionsFrom.options || [];
      if (vm.conditionData.type === 'select')
        this.$store.commit('updateConditionOptions', params);

      if (data.condition) {
        if (optionsTo.alias.includes('timePicker')) {
          data.condition = data.condition.map((c) => {
            if (c.action === 'set_time') {
              if (!JSON.parse(optionsTo.range || false)) {
                c.setVal =
                  typeof c.setVal === 'string'
                    ? JSON.parse(c.setVal)?.start
                    : '';
              } else if (!c.setVal.includes('start')) {
                c.setVal = JSON.stringify({ start: c.setVal || '', end: '' });
              }
            }
            return c;
          });
        }

        if (optionsTo.alias.includes('datePicker')) {
          data.condition = data.condition.map((c) => {
            if (c.action === 'set_period' && +optionsTo.range === 0) {
              c.setVal = !c.setVal ? c.setVal : JSON.parse(c.setVal)?.start;
              c.action = 'set_date';
            } else if (c.action === 'set_date' && +optionsTo.range === 1) {
              c.setVal = !c.setVal
                ? c.setVal
                : JSON.stringify({ start: c.setVal || '', end: null });
              c.action = 'set_period';
            } else if (
              c.action === 'set_date_and_disable' &&
              +optionsTo.range === 1
            ) {
              c.setVal = !c.setVal
                ? c.setVal
                : JSON.stringify({ start: c.setVal || '', end: null });
              c.action = 'set_period_and_disable';
            } else if (
              c.action === 'set_period_and_disable' &&
              +optionsTo.range === 0
            ) {
              c.setVal = !c.setVal ? c.setVal : JSON.parse(c.setVal)?.start;
              c.action = 'set_date_and_disable';
            }
            return c;
          });
        }

        this.$nextTick(() => {
          this.$store.commit(
            'updateConditionModel',
            JSON.parse(JSON.stringify(data.condition))
          );
        });
      }

      this.$store.commit('updateConditionData', vm.conditionData);
      this.$store.commit('setModalType', 'condition');
    },

    removeCondition(index) {
      this.tempModel.splice(index, 1);
    },

    saveCondition() {
      const vm = this;
      vm.scene.links.forEach((element) => {
        if (element.id === vm.conditionData.id)
          element.condition = vm.tempModel;
      });

      jQuery('.ccb-link-active').removeClass('ccb-link-active');
      vm.clearValues();
    },

    clearValues() {
      const vm = this;
      vm.tempModel = [];
      vm.currentId = null;
      vm.conditionData = {};
      vm.condition.open = false;
      vm.condition.hide = true;

      setTimeout(() => (vm.condition.hide = false), 130);
    },

    change() {
      const vm = this;
      vm.$nextTick(() => {
        const data = {
          nodes: vm.scene.nodes,
          links: vm.scene.links,
        };
        vm.$emit('save', data);
      });
    },

    collapseCondition() {
      this.collapse = !this.collapse;
      localStorage.setItem('conditionCollapse', this.collapse);
    },

    mouseDownHandler(e) {
      const target = e.target || e.srcElement;
      if (target && target.tagName !== 'svg') {
        return;
      }
      this.pos = {
        left: this.$container.scrollLeft,
        top: this.$container.scrollTop,
        x: e.clientX,
        y: e.clientY,
      };
      document.addEventListener('mousemove', this.mouseMoveHandler);
      document.addEventListener('mouseup', this.mouseUpHandler);
    },
    mouseMoveHandler(e) {
      const dx = e.clientX - this.pos.x;
      const dy = e.clientY - this.pos.y;
      // Scroll the element
      this.$container.scrollTop = this.pos.top - dy;
      this.$container.scrollLeft = this.pos.left - dx;
    },
    mouseUpHandler() {
      document.removeEventListener('mousemove', this.mouseMoveHandler);
      document.removeEventListener('mouseup', this.mouseUpHandler);
    },
    initListeners() {
      this.$container = document.querySelector('.ccb-condition-content');
      this.$container?.addEventListener('mousedown', this.mouseDownHandler);
    },
  },

  filters: {
    'to-short': (value) => {
      if (value.length >= 23) {
        return value.substring(0, 20) + '...';
      }
      return value;
    },
    'to-format': (value) => {
      if (value) value = value.split('with_').join('');
      if (value) value = `[${value.split('field_').join('')}]`;
      return value;
    },
  },

  created() {
    /** set static conditions data **/
    const collapse = localStorage.getItem('conditionCollapse');
    if (typeof collapse !== 'undefined') this.collapse = JSON.parse(collapse);

    const conditions = { actions: [], states: [] };
    if (window.ajax_window.hasOwnProperty('condition_actions'))
      conditions.actions = window.ajax_window.condition_actions;

    if (window.ajax_window.hasOwnProperty('condition_states'))
      conditions.states = window.ajax_window.condition_states;

    this.$store.commit('setStaticConditionData', conditions);
    this.open = true;
    if (!this.once) {
      this.once = true;
    }

    this.refreshAvailable();
    setTimeout(() => this.initListeners(), 500);
  },
};
