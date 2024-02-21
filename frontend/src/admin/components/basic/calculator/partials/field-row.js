import draggable from 'vuedraggable';
import { toast } from '../../../../../utils/toast';

export default {
  props: {
    value: {
      required: false,
      type: Array,
      default: null,
    },
    list: {
      required: false,
      type: Array,
      default: null,
    },
  },

  methods: {
    getConditionNodes() {
      const conditions = this.$store.getters.getConditions || {};
      return (conditions.nodes || []).map((f) => f.options);
    },

    emitter(value) {
      this.$emit('input', value);
    },

    deleteElement(event, key, field) {
      this.$emit('show-confirm', key, field);

      if (!field.alias.includes('repeater') && !field.alias.includes('group')) {
        if (event.target.closest('.ccb-fields-item-group')) {
          let groupId = event.target
            .closest('.ccb-fields-item-group')
            .getAttribute('data-group');

          if (
            confirm(
              'Are you sure you want to delete this field and all data associated with it?'
            )
          ) {
            let builders = this.$store.getters.getBuilder;

            builders.forEach((el) => {
              if (el.alias === groupId && field.alias) {
                el.costCalcFormula = el.costCalcFormula
                  .split(field.alias)
                  .join('0');

                el.groupElements = el.groupElements.filter(
                  (child) => child.alias !== field.alias
                );
              }
            });
          }
        }
      }
    },

    extractIds(data) {
      const idArray = [];

      function extractIdsRecursively(item) {
        if (item._id !== undefined) {
          idArray.push(item._id);
        }

        if (Array.isArray(item.groupElements)) {
          item.groupElements.forEach((child) => {
            extractIdsRecursively(child);
          });
        }
      }

      data.forEach((item) => {
        extractIdsRecursively(item);
      });

      return idArray;
    },

    quickTourNext(target) {
      if (this.quickTourStarted)
        this.quickTourNextStep(target, this.calcQuickTour);
    },

    added(event) {
      let index = event.newIndex;
      let element = event.to;

      if (element.closest('.ccb-fields-item-group')) {
        let groupId = element
          .closest('.ccb-fields-item-group')
          .getAttribute('data-group');

        let builders = this.$store.getters.getBuilder;
        let findElement = null;

        builders.forEach((el) => {
          if (el.alias === groupId) {
            findElement = el.groupElements[index];
          }
        });
        if (!findElement.hasOwnProperty('_id')) {
          this.editId = {
            groupId: groupId,
            key: index,
          };
        } else {
          this.editId = groupId;
          this.$store.commit('setType', 'repeater');
        }
      }
    },

    getNodes() {
      const conditions = this.$store.getters.getConditions || {};
      return (conditions.nodes || []).map((f) => f.options);
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

        if (!current.element.hasOwnProperty('_id')) {
          this.editField(null, current.element.type, validIdx);
        } else {
          this.closeOrCancelField();
        }

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

    endEvent(event) {
      let element = event.to;

      if (element.closest('.ccb-fields-item-group')) {
        this.closeOrCancelField();
      }
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

    onMove(event) {
      let unallowable = [
        'cost-total',
        'cost-repeater',
        'cost-group',
        'cost-group-field',
      ];
      let groupUnallowable = [
        'cost-repeater',
        'cost-group',
        'cost-group-field',
      ];
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
        if (
          unallowable.includes(element._tag) ||
          unallowable.includes(element.tag)
        ) {
          return false;
        }
      }
    },

    isSelectedField(field) {
      return this.editId === field.alias;
    },

    editField(event, type, id, key) {
      this.$store.commit('setMultiselectOpened', false); // make multiselect "default value(s)" arrow down by default
      if (event) {
        const classNames = [
          'ccb-icon-Path-3505',
          'ccb-duplicate',
          'ccb-icon-Path-3503',
          'ccb-fields-item-icon',
        ];
        const [className] = event.target.className.split(' ');
        if (classNames.includes(className)) return;
      }

      if (typeof type === 'string')
        type = type.toLowerCase().split(' ').join('-');

      if (typeof id === 'string') {
        if (isNaN(parseInt(id.replace(/\D/g, ''), 10))) {
          let group = event.target.closest('.ccb-fields-item-group');

          if (group) {
            let groupId = group.getAttribute('data-group');
            this.editId = {
              groupId: groupId,
              key: key,
            };
          } else {
            this.editId = {
              saveByKey: true,
              key: key,
            };
          }
        } else {
          this.editId = id;
        }
      } else {
        this.editId = id;
      }

      this.$store.commit('setType', type);
    },

    async duplicateField(field_id, notAllowed) {
      if (notAllowed) return;
      let groupId = null;

      const findWithIndex = (array, id) => {
        let result = null;

        array.some((o, i) => {
          if (o._id === id) {
            result = o;
            o.idx = i + 1; // Индекс элемента внутри groupElements + 1
            return true; // Stop iteration once the element is found
          }

          const nestedResult = findWithIndex(o.groupElements || [], id, i);
          if (nestedResult) {
            result = nestedResult;
            return true; // Stop iteration once the element is found in nested elements
          }

          return false; // Continue iteration
        });

        return result;
      };

      let field = findWithIndex(Object.values(this.getFields), field_id);

      this.getFields.forEach((item) => {
        if (item.groupElements) {
          item.groupElements.forEach((child) => {
            if (child._id === field_id) {
              groupId = item.alias;
            }
          });
        }
      });

      if (typeof field !== 'undefined') {
        /** create element from first found by id **/
        /** ps: cause wrong logic was earlier and there ara maybe fields with same ids **/
        let newField = Object.assign({}, field);

        let maxId = Math.max.apply(null, this.extractIds(this.getFields));

        let id = parseInt(maxId) + 1;
        let cleanFieldAlias = newField.alias.replace(/\_\d+/, '');
        let fields = this.getFields;

        fields.forEach((f) => {
          if (f.groupElements) {
            fields = [...fields, ...f.groupElements];
          }
        });

        let duplicatedCount = fields.filter(function (row) {
          return row.stm_dublicate_field_id === field_id;
        }).length;

        newField._id = id;
        newField.stm_dublicate_field_id = field_id;
        newField.label =
          newField.label + ' (copy ' + (parseInt(duplicatedCount) + 1) + ')';
        newField.alias = cleanFieldAlias + '_' + id;

        if (field.hasOwnProperty('options')) {
          newField.options = JSON.parse(JSON.stringify(field.options));
        }

        if (field.hasOwnProperty('styles')) {
          newField.styles = JSON.parse(JSON.stringify(field.styles));
        }

        this.$store.commit('addToBuilder', {
          data: newField,
          id: id,
          index: field.idx,
          copyToGroup: groupId,
        });
        this.$store.commit(
          'updateAvailableFields',
          this.$store.getters.getBuilder
        );
        this.$store.getters.updateCount(1);

        this.$store.commit('setType', field.type);
        toast('Field Duplicated', 'success');

        this.editField(null, field.type, newField.alias);
      }
    },
  },
  components: {
    draggable,
  },

  computed: {
    getFields() {
      return this.$store.getters.getBuilder.map((b) => {
        const field = this.$store.getters.getFields.find(
          (f) => f.tag === b._tag
        );
        if (field) {
          b.icon = field.icon;
          b.text = field.description;
        }
        return b;
      });
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

    duplicateNotAllowed() {
      return !(this.fields || []).every((e) => !e.hasOwnProperty('tag'));
    },

    getErrorIdx() {
      return this.$store.getters.getErrorIdx || [];
    },

    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
    // this.value when input = v-model
    // this.list  when input != v-model
    realValue() {
      return this.value ? this.value : this.list;
    },
  },
  filters: {
    'to-short': (value) => {
      if (value.length >= 33) {
        return value.substring(0, 30) + '...';
      }
      return value;
    },

    'to-format': (value) => {
      if (value) value = value.split('with_').join('');
      if (value) value = `[${value.split('field_').join('')}]`;
      return value;
    },
  },
  name: 'nested-test',
  template: `
      <template>
        <draggable
            v-bind="dragOptions"
            tag="div"
            class="ccb-fields-item-row"
            :list="list"
            :value="value"
            group="fields"
            @add="added"
            @end="endEvent"
            @change="log"
            :move="onMove"
            @input="emitter"
        >
          <div class="ccb-field-drag-row" v-for="(field, key) in realValue" :key="key" @click.stop="e => editField(e, field.type, field.alias, key)">
            <div class="ccb-fields-item" v-if="field.type !== 'Repeater' && field.type !== 'Group'" :class="{'ccb-field-selected': isSelectedField(field), 'ccb-idx-error': getErrorIdx.includes(key)}">
              <div class="ccb-fields-item-left" v-if="field.type !== 'Html' && field.type !== 'Line'">
                  <span class="ccb-field-item-title-box">
                      <span>{{ field.label }}</span>
                  </span>
                  <span class="ccb-field-item-icon-box">
                      <span class="ccb-field-item-icon">
                          <i :class="field.icon"></i>
                      </span>
                      <span class="ccb-default-description ccb-light">
                          {{ field.text }}
                      </span>
                      <span class="ccb-default-description ccb-light">
                            {{ field.alias | to-format }}
                      </span>
                  </span>
                </div>
              <div class="ccb-fields-item-left" v-if="field.type === 'Line'">
                  <span class="line-field"></span>
              </div>
              <div class="ccb-fields-item-left" v-if="field.type === 'Html'">
                  <span class="html-field">
                    <-- HTML element -->
                  </span>
              </div>
              <div class="ccb-fields-item-right">
                  <span class="ccb-fields-item-icon drag-icon">
                    <i class="ccb-icon-drag-dots"></i>
                  </span>
                  <span class="ccb-fields-item-icon border-icon" @click.prevent="duplicateField( field._id, !field.alias || field._id === null || field._id === undefined || duplicateNotAllowed)" v-if="!(!field.alias || field._id === null || field._id === undefined || duplicateNotAllowed)">
                    <i class="ccb-icon-Path-3505"></i>
                  </span>
                  <span class="ccb-fields-item-icon border-icon" @click.stop="e => deleteElement(e, key, field)">
                    <i class="ccb-icon-Path-3503"></i>
                  </span>
              </div>
            </div>
            <div class="ccb-fields-item-group" :data-group="field.alias" v-if="field.type == 'Repeater'" :class="{'ccb-field-selected':isSelectedField(field)}">
                <div class="ccb-fields-item ccb-fields-item-group__header">
                    <div class="ccb-fields-item-left">
                        <span class="ccb-field-item-icon-box">
                            <span class="ccb-field-item-icon">
                                <i class="ccb-icon-drag-dots"></i>
                            </span>
                            <span class="ccb-field-item-title-box">
                                {{ field.label }}
                            </span>
                        </span>
                    </div>
                    <div class="ccb-fields-item-right">
                        <span class="ccb-fields-item-icon">
                            <i class="ccb-icon-Union-28"></i>
                        </span>
                        <span class="ccb-fields-item-icon" @click.stop="e => deleteElement(e, key, field)">
                            <i class="ccb-icon-Path-3503"></i>
                        </span>
                    </div>
                </div>
                <nested-test 
                    class="ccb-fields-group" 
                    :class="{'empty-group': !field.groupElements.length }" 
                    :list="field.groupElements"
                />
                <span class="ccb-fields-group__message" v-if="!field.groupElements.length">Drag and drop elements inside group</span>
                <div class="ccb-fields-group__actions">
                  <div class="ccb-fields-group__button">
                    + {{ field.addButtonLabel | to-short }}
                  </div>
                </div>
            </div>
            <div class="ccb-fields-item-group" :data-group="field.alias" v-if="field.type == 'Group'" :class="{'ccb-field-selected':isSelectedField(field)}">
                <div class="ccb-fields-item ccb-fields-item-group__header">
                    <div class="ccb-fields-item-left">
                        <span class="ccb-field-item-icon-box">
                            <span class="ccb-field-item-icon">
                                <i class="ccb-icon-drag-dots"></i>
                            </span>
                            <span class="ccb-field-item-title-box">
                                {{ field.label }}
                            </span>
                            <span v-if="field.hidden" class="ccb-fields-item-group-hidden">
                              <i class="ccb-icon-no-preview"></i>
                              Hidden
                            </span>
                        </span>
                    </div>
                    <div class="ccb-fields-item-right">
                        <span class="ccb-fields-item-icon">
                            <i class="ccb-icon-Union-28"></i>
                        </span>
                        <span class="ccb-fields-item-icon" @click.stop="e => deleteElement(e, key, field)">
                            <i class="ccb-icon-Path-3503"></i>
                        </span>
                    </div>
                </div>
               <nested-test
                    class="ccb-fields-group" 
                    :class="[{'empty-group': !field.groupElements.length }, 'ccb-group-field-elements']" 
                    :list="field.groupElements"
                />
            </div>

            <span class="ccb-idx-error-info" v-if="getErrorIdx.includes(key)">
                Please add options
            </span>
          </div>
        </draggable>
      </template>
    `,
};
