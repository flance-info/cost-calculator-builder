export default {
  state: {
    conditions: {
      nodes: [],
      links: [],
    },
    conditionData: {},
    conditionModel: [],
    availableFields: [],
    options: [],

    /** name for date picker field if range is enabled **/
    datePickerRangeFieldName: 'range_datePicker',

    /** name for file upload field if price isn't empty **/
    fileUploadWithPriceFieldName: 'file_upload_with_price',

    /** static data from backend; possible action list **/
    possibleActions: [],
    /** static data from backend; possible condition state list **/
    possibleStates: [],

    /** prop for <Condition> Find element filter **/
    actionType: 'all',
    filteredElements: '',
    filterPos: { left: 0, top: 0 },
  },

  mutations: {
    /** set condition data; list of actions; States **/
    setStaticConditionData(state, staticConditionData) {
      state.possibleActions = staticConditionData.actions;
      state.possibleStates = staticConditionData.states;
    },

    setConditions(state, conditions) {
      conditions =
        typeof conditions === 'object' && !Array.isArray(conditions)
          ? conditions
          : { nodes: [], links: [] };
      state.conditions = conditions;
    },

    /**
     * Remove nodes and links based on field existance
     * @param state
     * @param availableData - calculator fields
     */
    updateAvailableFields(state, availableData) {
      let links = state.conditions.links || [];
      let nodes = state.conditions.nodes || [];

      state.conditions.links = links // Update condition's link
        .map((link) => {
          let result = false;

          const option_to = link.options_to || {}; // * Links options
          const option_from = link.options_from || {};
          const isSimple = link.calculable && JSON.parse(link.calculable);

          const found_to = availableData.find((e) => e.alias === option_to); // * Find from state fields
          const found_from = availableData.find((e) => e.alias === option_from);

          /** remove link if one of condition elements not exist in fields **/
          if (
            typeof found_to === 'undefined' ||
            typeof found_from === 'undefined'
          ) {
            return result;
          }

          if (found_from) {
            link.condition = (link.condition || []).map((condition) => {
              const options = found_from.options || [];
              if (options.length <= +condition.key) condition.key = 0;

              return condition;
            });

            if (found_to) {
              result = link;
              result.options_to = found_to.alias;
              result.options_from = found_from.alias;
            } else if (!isSimple) {
              result = link;
            }
          }

          return result;
        })
        .filter((link) => link !== false);

      let untitledIdx = 1;
      state.conditions.nodes = nodes // Update condition's nodes
        .map((node) => {
          let result = false;

          const options = node.options || {}; // Get node's option
          const found = availableData.find((e) => e.alias === options); // Redeclare options
          const isCalculable = node.calculable && JSON.parse(node.calculable);

          if (found) {
            let label = found.label;

            if (!label?.length) {
              label = `Untitled ${untitledIdx}`;
              untitledIdx++;
            }

            result = node;
            result.label = label;
            result.options = found.alias;
          } else if (!isCalculable && typeof found !== 'undefined') {
            result = node;
          }

          return result;
        })
        .filter((node) => node !== false);
      state.availableFields = availableData;
    },

    updateConditionData(state, data) {
      state.conditionData = data;
    },

    updateConditionNodes(state, conditionNodes) {
      state.conditions.nodes = conditionNodes;
    },

    updateConditionLinks(state, conditionLinks) {
      state.conditions.links = conditionLinks;
    },

    updateConditionModel(state, model) {
      /** add sort property to exist condition items **/
      model.forEach((item, key) => {
        if (!item.hasOwnProperty('sort')) {
          item.sort = key;
        }
      });

      model.sort((a, b) => a.sort - b.sort);

      state.conditionModel = model;
    },

    updateConditionOptions(state, options) {
      state.options = options;
    },

    addConditionData(state) {
      const defaultModal = {
        setVal: '',
        setOptions: '',
        action: '',
        index: false,
        hide: false,
        open: false,
        type: 'select',
        sort: state.conditionModel.length,
        optionTo: state.conditionData.optionTo,
        optionFrom: state.conditionData.optionFrom,
        conditions: [
          {
            key: 0,
            value: '',
            condition: '',
            logicalOperator: '&&',
            sort: 0,
            checkedValues: [],
          },
        ],
      };

      const model = state.conditionModel;
      model.push(defaultModal);
      model.sort((a, b) => a.sort - b.sort);
      state.conditionModel = model;
    },

    /**
     * Set Condition action value
     * @param state
     * @param value
     */
    setConditionActionType(state, value) {
      state.actionType = value;
    },

    setFilteredElements(state, value) {
      state.filteredElements = value;
    },

    updateFilterPos(state, filterPos) {
      state.filterPos = filterPos;
    },
  },

  getters: {
    /**
     *  static states for choosen field
     *  is selected, is equal to, is inferior to etc
     **/
    getStaticConditionStatesByField: (state) => (fieldId) => {
      let fieldName = fieldId.replace(/\_field_id.*/, '');

      /** check is datepicker with range **/
      if (fieldName === 'datePicker') {
        let fieldObject = state.availableFields.filter(
          (field) => field.alias === fieldId
        )[0];
        if (parseInt(fieldObject.range) === 1) {
          fieldName = state.datePickerRangeFieldName;
        }
      }

      /** check is file upload with price **/
      if (fieldName === 'file_upload') {
        let fieldObject = state.availableFields.filter(
          (field) => field.alias === fieldId
        )[0];
        if (parseInt(fieldObject.price) > 0) {
          fieldName = state.fileUploadWithPriceFieldName;
        }
      }

      return state.possibleStates.filter((s) => s.fields.includes(fieldName));
    },

    /**
     *  static actions for choosen field
     *  hide, hide_leave_in_total, disable, unset  etc
     **/
    getStaticConditionActionsByField: (state) => (fieldId) => {
      let fieldName = fieldId.replace(/\_field_id.*/, '');
      /** check is datepicker with range **/
      if (fieldName === 'datePicker') {
        let fieldObject = state.availableFields.filter(
          (field) => field.alias === fieldId
        )[0];
        if (parseInt(fieldObject.range) === 1) {
          fieldName = state.datePickerRangeFieldName;
        }
      }
      return state.possibleActions.filter((s) => s.fields.includes(fieldName));
    },

    getStaticConditionActionsByValue: (state) => (actionValue) => {
      return state.possibleActions.filter((s) => s.value === actionValue)[0];
    },

    getFieldByFieldId: (state) => (fieldId) => {
      return state.availableFields.filter(
        (field) => field.alias === fieldId
      )[0];
    },

    getFieldNameByFieldId: () => (fieldId) => {
      return fieldId.replace(/\_field_id.*/, '');
    },

    getFieldFormatByFieldAlias: (state) => (fieldAlias) => {
      let fieldData = state.availableFields.filter(
        (field) => field.alias === fieldAlias
      )[0];
      if (fieldData) {
        let result = { format: fieldData.format };
        if (fieldData.range === '1' || fieldData.range === 1) {
          result.range = fieldData.range;
        }
        return result;
      } else {
        return null;
      }
    },

    getFieldOptionsByFieldId: (state) => (fieldId) => {
      let fieldData = state.availableFields.filter(
        (field) => field.alias === fieldId
      )[0];
      if (fieldData.hasOwnProperty('options')) {
        return fieldData.options;
      }
      return [];
    },

    getAvailableFields(state) {
      return state.availableFields;
    },

    getConditions(state) {
      return state.conditions;
    },

    getConditionData(state) {
      return state.conditionData;
    },

    getConditionModel(state) {
      return state.conditionModel;
    },

    getConditionOptions(state) {
      return state.options;
    },

    getConditionActionType(state) {
      return state.actionType;
    },

    getFilteredElements(state) {
      return state.filteredElements;
    },

    getFilterPos(state) {
      return state.filterPos;
    },
  },

  actions: {
    updateLink({ getters }) {
      if (typeof getters.getConditions.links !== 'undefined') {
        getters.getConditions.links.forEach((element) => {
          if (element.id === getters.getConditionData.id)
            element.condition = getters.getConditionModel;
        });
      }
    },

    removeLink({ getters, commit }) {
      if (typeof getters.getConditions.links !== 'undefined') {
        const data = { nodes: getters.getConditions.nodes };
        data.links = getters.getConditions.links.filter(
          (element) => element.id !== getters.getConditionData.id
        );
        commit('setConditions', data);
      }
    },
  },
};
