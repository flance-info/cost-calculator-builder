import { toast } from '../../../../utils/toast';
import ccbModalWindow from '../../utility/modal';
import preview from './partials/preview';
import {
  checkbox,
  text,
  toggle,
  quantity,
  total,
  fileUpload,
  html,
  dropDown,
  dropDownWithImg,
  line,
  datePicker,
  timePicker,
  multiRange,
  range,
  radio,
  radioWithImage,
  checkboxWithImage,
  repeaterField,
  groupField,
} from './fields';

import quickTourMixin from '../quick-tour/quickTourMixin';
import hintMixin from '../quick-tour/hintMixin';
import calcConfig from './partials/config';
import quickTourModal from './partials/quick-tour-start';
import confirmPopup from '../../utility/confirmPopup';
import fieldRow from './partials/field-row';

export default {
  mixins: [quickTourMixin, hintMixin],
  components: {
    preview,
    'group-field': groupField,
    'repeater-field': repeaterField,
    'html-field': html,
    'line-field': line,
    'total-field': total,
    'toggle-field': toggle,
    'text-area-field': text,
    'checkbox-field': checkbox,
    'quantity-field': quantity,
    'range-button-field': range,
    'drop-down-field': dropDown,
    'radio-button-field': radio,
    'multi-range-field': multiRange,
    'date-picker-field': datePicker,
    'time-picker-field': timePicker,
    'file-upload-field': fileUpload,
    'drop-down-with-image-field': dropDownWithImg,
    'radio-with-image-field': radioWithImage,
    'checkbox-with-image-field': checkboxWithImage,
    'ccb-modal-window': ccbModalWindow,
    'calc-config': calcConfig,
    'ccb-quick-tour': quickTourModal,
    'ccb-confirm-popup': confirmPopup,
    'field-row': fieldRow,
  },

  data: () => ({
    fieldData: {},
    newCalc: false,
    updateEditKey: 0,
    currentField: null,
    draggableBorder: false,
    showElements: false,
    confirmPopup: false,
    currentFieldId: null,
    quickTourAllowAddOnlyOnce: false,
  }),

  created() {
    if (this.getTourStep !== 'done') {
      this.$store.commit('setModalType', 'quick-tour');
      this.$store.commit('setOpenModal', true);
    }
  },

  mounted() {
    this.initListeners();
  },

  computed: {
    getProFields() {
      return [
        'cost-multi-range',
        'date-picker',
        'time-picker',
        'cost-repeater-field',
        'cost-group-field',
        'cost-file-upload',
        'cost-drop-down-with-image',
        'cost-checkbox-with-image',
        'cost-radio-with-image',
      ];
    },

    getNodes() {
      const conditions = this.$store.getters.getConditions || {};
      return (conditions.nodes || []).map((f) => f.options);
    },

    builderFields: {
      get() {
        return this.getters.getBuilder.map((b) => {
          const field = this.getters.getFields.find((f) => f.tag === b._tag);
          if (field) {
            b.icon = field.icon;
            b.text = field.description;
          }
          return b;
        });
      },

      set(value) {
        const nodes = this.getNodes;
        const repeaters = value.filter((f) => f.alias.includes('repeater'));
        let repeaterGroupedFields = [];
        for (const repeater of repeaters) {
          if (repeater.groupElements?.length) {
            repeaterGroupedFields.push(...repeater.groupElements);
          }
        }

        repeaterGroupedFields = repeaterGroupedFields.map((f) => f.alias);
        let inCondition = false;

        for (const alias of repeaterGroupedFields) {
          if (nodes.includes(alias) && !inCondition) inCondition = true;
        }

        if (inCondition) {
          if (confirm('Are you sure to move a field that uses Conditions?')) {
            this.$store.commit('setBuilder', value);
            this.$store.commit(
              'updateAvailableFields',
              this.$store.getters.getBuilder
            );
          } else {
            const filteredFields = this.$store.getters.getBuilder.map((f) => {
              if (f.alias.includes('repeater')) {
                f.groupElements = f.groupElements.filter(
                  (field) => !nodes.includes(field.alias)
                );
              }
              return f;
            });

            this.$store.commit('setBuilder', filteredFields);
            this.closeOrCancelField();
          }
        } else {
          this.$store.commit('setBuilder', value);
        }
      },
    },

    duplicateNotAllowed() {
      return !(this.getFields || []).every((e) => !e.hasOwnProperty('tag'));
    },

    draggableKey() {
      return this.getters.getCount;
    },

    getErrorIdx() {
      return this.getters.getErrorIdx || [];
    },

    getFields() {
      return this.getters.getBuilder.map((b) => {
        const field = this.getters.getFields.find((f) => f.tag === b._tag);
        if (field) {
          b.icon = field.icon;
          b.text = field.description;
        }
        return b;
      });
    },

    getIndex() {
      return this.getters.getIndex;
    },

    editId: {
      get() {
        return this.$store.getters.getEditID;
      },

      set(value) {
        this.updateEditKey++;
        this.$store.commit('setEditID', value);
      },
    },

    getOrderId() {
      this.$store.dispatch('setFieldId');
      return this.getters.getFieldId;
    },

    getType() {
      this.updateEditKey++;
      const type = this.$store.getters.getType || null;
      this.fieldData = this.getters.getFieldData(this.editId);
      return type;
    },

    access() {
      return this.$store.getters.getAccess;
    },

    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    },

    getTitle: {
      get() {
        return this.$store.getters.getTitle;
      },

      set(newValue) {
        this.$store.commit('setTitle', newValue);
      },
    },

    calcCategory: {
      get() {
        return this.$store.getters.getCat;
      },

      set(value) {
        this.$store.commit('setCat', value);
      },
    },

    calcDescription: {
      get() {
        return this.$store.getters.getCalcDescription;
      },

      set(value) {
        this.$store.commit('setCalcDescription', value);
      },
    },

    calcIcons: {
      get() {
        return this.$store.getters.getIcon;
      },

      set(value) {
        this.$store.commit('setIcon', value);
      },
    },

    calcType: {
      get() {
        return this.$store.getters.getPluginType;
      },

      set(value) {
        this.$store.commit('setPluginType', value);
      },
    },

    getTourStep: {
      get() {
        return this.$store.getters.getQuickTourStep;
      },

      set(value) {
        this.$store.commit('setQuickTourStep', value);
      },
    },

    quickTourStarted: {
      get() {
        return this.getters.getQuickTourStarted;
      },

      set(value) {
        this.$store.commit('setQuickTourStarted', value);
      },
    },
  },

  methods: {
    showConfirm(key, field) {
      if (field._id !== undefined) {
        this.currentFieldId = key;
        this.confirmPopup = true;
      } else {
        this.removeFromBuilder(true, key);
      }
    },
    utmElementsGeneratedLink(type) {
      return `https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=calcwpadmin&utm_medium=freetoprobutton&utm_campaign=${encodeURIComponent(
        type
      )}`;
    },
    startQuickTour() {
      this.editable = true;
      if (this.getTourStep === '.calc-quick-tour-title-box') {
        this.$nextTick(() => {
          setTimeout(() => {
            this.renderQuickTour();
          }, 200);
        });
      }
    },

    hideOverlay(e) {
      if (e && e.target.classList.contains('ccb-field-overlay')) {
        this.closeOrCancelField();
      }
    },

    initListeners() {
      document.body.addEventListener('click', (e) => {
        if (
          this.getType &&
          e.target.classList.contains('ccb-not-allowed') === true
        ) {
          this.closeOrCancelField();
        }
      });

      document.body.addEventListener('keydown', (e) => {
        if (e.keyCode === 27 && this.getType) {
          this.closeOrCancelField();
        }
      });
    },

    closeOrCancelField(nextStep = true) {
      this.$store.commit('setType', '');
      this.$store.commit('setIndex', null);

      this.editId = null;
      this.$store.commit('setFieldId', null);
      if (nextStep) {
        this.quickTourNext(this.$store.getters.getQuickTourStep);
      }
    },

    saveTitle() {
      if (
        this.$store.getters.getDisableInput === false &&
        this.$store.getters.getTitle !== ''
      )
        this.$store.commit('setDisabledInput', true);
    },

    enableInput() {
      this.$refs.title.focus();
      if (this.$store.getters.getDisableInput === true)
        this.$store.commit('setDisabledInput', false);
    },

    removeFromBuilder(status, idx) {
      if (status) {
        let builders = this.$store.getters.getBuilder;

        const field = builders[idx];
        if (field?.alias) {
          builders = builders.map((f) => {
            if (f.alias.includes('total')) {
              f.costCalcFormula = f.costCalcFormula
                .split(field.alias)
                .join('0');
            }

            return f;
          });
        }

        this.clearErrors(idx);
        this.$store.commit('removeFromBuilderByIdx', idx);
        this.$store.commit('updateAvailableFields', builders);
        this.closeOrCancelField();
        this.initErrors(idx);
      }
      this.confirmPopup = false;
    },

    addOrSaveField(data, id, index, alias) {
      this.clearErrors(id);
      this.$store.commit('addToBuilder', { data, id, index, alias });
      /**
       *  The code used before for reactive other tab's when fields added or changed.
       *  But cause of this code fields scrolling up when you save last field in builder.
       *  If reactivity is not working between pages uncommit this code
       *
       *
       *       this.$store.commit(
       *         'updateAvailableFields',
       *         this.$store.getters.getBuilder
       *       );
       *       this.$store.commit('setFieldsKey', this.$store.getters.getFieldsKey + 1);
       *       this.$store.getters.updateCount(1);
       */
      this.closeOrCancelField();
      toast('Element Settings Saved', 'success');
    },

    clearErrors(id) {
      if (this.getErrorIdx.includes(id))
        this.$store.commit(
          'setErrorIdx',
          this.getErrorIdx.filter((e) => e !== id)
        );
    },

    initErrors(idx) {
      if (!this.getErrorIdx.length && typeof idx !== 'undefined') return true;

      this.$store.commit('setErrorIdx', []);
      const builders = this.$store.getters.getBuilder;
      const errorIdx = [];
      builders.forEach((b, idx) => {
        if (b._id === undefined) errorIdx.push(idx);
      });
      this.$store.commit('setErrorIdx', errorIdx);
    },

    editField(event, type, id) {
      this.$store.commit('setMultiselectOpened', false); // make multiselect "default value(s)" arrow down by default

      if (event) {
        const classNames = [
          'ccb-icon-Path-3505',
          'ccb-duplicate',
          'ccb-icon-Path-3503',
        ];
        const [className] = event.target.className.split(' ');
        if (classNames.includes(className)) return;
      }

      if (typeof type === 'string')
        type = type.toLowerCase().split(' ').join('-');
      this.editId = id;
      this.$store.commit('setType', type);
    },

    allowAccess() {
      if (this.$store.getters.getTitle !== '') {
        this.$store.commit('changeAccess', true);
        this.$store.commit('setDisabledInput', true);
      }
    },

    addField(field) {
      const step = '.calc-quick-tour-title-box';
      const currentStep = this.$store.getters.getQuickTourStep;

      if (
        this.quickTourAllowAddOnlyOnce &&
        this.quickTourStarted &&
        step !== currentStep
      )
        return;

      this.quickTourAllowAddOnlyOnce = true;
      if (typeof field.type !== 'undefined') {
        const builders = this.$store.getters.getBuilder;
        this.$store.dispatch('setFieldId');
        this.$store.commit('setIndex', builders.length);
        this.$store.commit('setType', field.type);

        field.text = field.description;
        builders.push(field);

        this.$store.commit('setBuilder', builders);
        this.editField(null, field.type, builders.length - 1);
      }

      this.quickTourNext('.calc-quick-tour-elements');
    },

    onMove(event) {
      let unallowable = [
        'cost-total',
        'cost-repeater-field',
        'cost-group-field',
      ];
      let groupUnallowable = ['cost-repeater-field', 'cost-group-field'];
      let element = event.draggedContext.element;
      let to = event.to;

      if (to.classList.contains('ccb-group-field-elements')) {
        if (
          groupUnallowable.includes(element._tag) ||
          groupUnallowable.includes(element.tag)
        ) {
          return false;
        }
      }

      if (
        to.classList.contains('ccb-fields-group') &&
        !to.classList.contains('ccb-group-field-elements')
      ) {
        if (unallowable.includes(element.tag)) {
          return false;
        }
      }
    },

    log(event) {
      const moved = event.moved;
      const current = event.added;

      if (current) {
        const builders = this.$store.getters.getBuilder;
        const validIdx =
          current.newIndex === builders.length
            ? current.newIndex - 1
            : current.newIndex;

        this.$store.commit('setIndex', validIdx);
        this.$store.commit('setType', current.element.type);

        this.editField(null, current.element.type, validIdx);
        const currentField = builders[validIdx];

        if (currentField) {
          currentField.text = currentField.description;
          builders[validIdx] = currentField;
          this.$store.commit('setBuilder', builders);
        }
      } else if (moved && this.editId !== null) {
        this.editField(null, moved.element.type, moved.newIndex);
      }

      this.quickTourNext('.calc-quick-tour-elements');
    },

    openTemplateSettings() {
      this.$store.commit('setModalType', 'calc-settings');
    },

    start() {
      const body = document.querySelector('body');
      if (body && !body.classList.contains('ccb-border-wrap'))
        body.classList.add('ccb-border-wrap');
    },

    clear() {
      const builders = this.$store.getters.getBuilder;
      this.$store.commit(
        'setBuilder',
        builders.filter(
          (builder) =>
            builder.alias && builder._id !== null && builder._id !== undefined
        )
      );
    },

    end() {
      const body = document.querySelector('body.ccb-border-wrap');
      if (body && !this.quickTourStarted)
        body.classList.remove('ccb-border-wrap');
    },

    quickTourNext(target) {
      if (this.quickTourStarted)
        this.quickTourNextStep(target, this.calcQuickTour);
    },
  },

  watch: {
    '$store.getters.getQuickTourStep': function (value) {
      if (value === '.calc-quick-tour-conditions')
        this.closeOrCancelField(false);
    },
  },

  filters: {
    'to-short': (value) => {
      if (value && value.length >= 18) {
        return value.substring(0, 15) + '...';
      }
      return value || '';
    },
    'to-format': (value) => {
      if (value) value = value.split('with_').join('');
      if (value) value = `[${value.split('field_').join('')}]`;
      return value;
    },
  },

  destroyed() {
    this.closeOrCancelField();
  },
};
