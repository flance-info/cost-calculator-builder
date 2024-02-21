import flowChartFilter from './flow-chart-filter';
import flowChartLink from './flow-chart-link';
import flowChartNode from './flow-chart-node';
import confirmPopup from '../../utility/confirmPopup';

export default {
  props: {
    scene: {
      type: Object,
      default() {
        return {
          centerX: 1024,
          scale: 1,
          centerY: 140,
          nodes: [],
          links: [],
        };
      },
    },
    modal: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 762,
    },
    confirmPopup: false,
    deleteFieldId: null,
  },

  components: {
    'flow-chart-link': flowChartLink,
    'flow-chart-node': flowChartNode,
    'flow-chart-filter': flowChartFilter,
    'ccb-confirm-popup': confirmPopup,
  },

  data() {
    return {
      action: {
        linking: false,
        dragging: false,
        scrolling: false,
        selected: 0,
      },
      mouse: {
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0,
      },
      draggingLink: null,
      rootDivOffset: {
        top: 0,
        left: 0,
      },
      rootDiv: {
        height: 0,
        width: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        x: 0,
        y: 0,
      },
    };
  },

  computed: {
    getBoundingClientRect() {
      const clientRect = this.$el.getBoundingClientRect();
      if (clientRect) clientRect.height = this.height;
      return clientRect;
    },

    hasCancelListener() {
      return this.$listeners && this.$listeners.linkEdit;
    },

    nodeOptions() {
      return {
        scale: this.scene.scale,
        centerY: this.scene.centerY,
        centerX: this.scene.centerX,
        selected: this.action.selected,
        offsetTop: this.rootDivOffset.top,
        offsetLeft: this.rootDivOffset.left,
        rootDiv: this.rootDiv,
        nodeDefaultWidth: this.scene.nodeDefaultWidth,
        nodeDefaultHeight: this.scene.nodeDefaultHeight,
      };
    },

    /** node links **/
    lines() {
      /** exist lines **/
      const lines = this.scene.links.map((link) => {
        let x, y, cy, cx, ex, ey;
        x = link.target.x;
        y = link.target.y;

        [cx, cy] = this.getPortPosition(
          x,
          y,
          `output ${link.target?.position}`
        );
        [ex, ey] = this.getPortPosition(
          link.input_coordinates.x,
          link.input_coordinates.y,
          `input ${link.input_coordinates?.position}`
        );

        return {
          start: [cx, cy],
          end: [ex, ey],
          id: link.id,
        };
      });

      /** just dragging line **/
      if (this.draggingLink) {
        let x, y, cy, cx;
        x = this.draggingLink.target.x;
        y = this.draggingLink.target.y;
        [cx, cy] = this.getPortPosition(
          x,
          y,
          this.draggingLink.target.class_name
        );

        lines.push({
          start: [cx, cy],
          end: [this.draggingLink.mx, this.draggingLink.my],
        });
      }

      return lines; // start-end line
    },

    /** node can't be beyond the parent div borders
     * 5 is little padding buffer
     **/
    nodeStyleMaxPossibleTop() {
      return this.rootDiv.height - this.scene.nodeDefaultHeight - 5;
    },
    nodeStyleMaxPossibleLeft() {
      return this.rootDiv.width - this.scene.nodeDefaultWidth - 5;
    },
  },

  mounted() {
    this.rootDiv = this.getBoundingClientRect;
    /** flow chat data **/
    this.rootDivOffset.top = this.$el ? this.$el.offsetTop : 0;
    this.rootDivOffset.left = this.$el ? this.$el.offsetLeft : 0;

    setTimeout(() => {
      this.initListeners();
    }, 300);
  },

  updated: function () {
    this.$nextTick(function () {
      let rootDiv = this.getBoundingClientRect;
      if (+rootDiv.x !== +this.rootDiv.x || +rootDiv.y !== +this.rootDiv.y) {
        this.rootDiv = this.getBoundingClientRect;
      }
    });
  },
  methods: {
    /**
     * Get Key for 'getNodePossiblePointsCoordinates' by target class name
     * @param className
     * @returns {string}
     */
    getOutputNodePositionKeyByClassName(className) {
      let outputPosition;

      switch (true) {
        case className.includes('bottom') && className.includes('left'):
          outputPosition = 'bottomLeft';
          break;
        case className.includes('bottom') && className.includes('right'):
          outputPosition = 'bottomRight';
          break;
        case className.includes('bottom') && className.includes('center'):
          outputPosition = 'bottomMiddle';
          break;
        case className.includes('top') && className.includes('left'):
          outputPosition = 'topLeft';
          break;
        case className.includes('top') && className.includes('right'):
          outputPosition = 'topRight';
          break;
        case className.includes('top') && className.includes('center'):
          outputPosition = 'topMiddle';
          break;
        case className.includes('left') && className.includes('side'):
          outputPosition = 'leftMiddle';
          break;
        default:
          outputPosition = 'rightMiddle';
      }
      return outputPosition;
    },

    /**
     *  Get possible node points coordinates
     * @param startNodeFromX
     * @param startNodeFromY
     * @returns {{}}
     */
    getNodePossiblePointsCoordinates(startNodeFromX, startNodeFromY) {
      startNodeFromX = startNodeFromX - 6;

      let middleX = startNodeFromX + this.scene.nodeDefaultWidth / 2;
      let middleY = startNodeFromY + this.scene.nodeDefaultHeight / 2;
      let endNodeFromX = startNodeFromX + this.scene.nodeDefaultWidth;
      let endNodeFromY = startNodeFromY + this.scene.nodeDefaultHeight;

      let fifteenPercentOfWidth = (this.scene.nodeDefaultWidth * 15) / 100;
      let possibleCoordinates = {};

      possibleCoordinates['leftTopCorner'] = {
        x: startNodeFromX,
        y: startNodeFromY,
        position: 'leftTopCorner',
      };
      possibleCoordinates['rightTopCorner'] = {
        x: endNodeFromX,
        y: startNodeFromY,
        position: 'rightTopCorner',
      };
      possibleCoordinates['leftBottomCorner'] = {
        x: startNodeFromX,
        y: endNodeFromY,
        position: 'leftBottomCorner',
      };
      possibleCoordinates['rightBottomCorner'] = {
        x: endNodeFromX,
        y: endNodeFromY,
        position: 'rightBottomCorner',
      };
      possibleCoordinates['leftMiddle'] = {
        x: startNodeFromX,
        y: middleY,
        position: 'leftMiddle',
      };
      possibleCoordinates['rightMiddle'] = {
        x: endNodeFromX,
        y: middleY,
        position: 'rightMiddle',
      };
      possibleCoordinates['topMiddle'] = {
        x: middleX,
        y: startNodeFromY,
        position: 'topMiddle',
      };
      possibleCoordinates['bottomMiddle'] = {
        x: middleX,
        y: endNodeFromY,
        position: 'bottomMiddle',
      };

      possibleCoordinates['topLeft'] = {
        x: startNodeFromX + fifteenPercentOfWidth,
        y: startNodeFromY,
        position: 'topLeft',
      };
      possibleCoordinates['topRight'] = {
        x: endNodeFromX - fifteenPercentOfWidth,
        y: startNodeFromY,
        position: 'topRight',
      };
      possibleCoordinates['bottomLeft'] = {
        x: startNodeFromX + fifteenPercentOfWidth,
        y: endNodeFromY,
        position: 'bottomLeft',
      };
      possibleCoordinates['bottomRight'] = {
        x: endNodeFromX - fifteenPercentOfWidth,
        y: endNodeFromY,
        position: 'bottomRight',
      };
      return possibleCoordinates;
    },

    /**
     * Closest point to flip link arrow
     * @param {floatval} startNodeFromX
     * @param {floatval} startNodeFromY
     * @returns {*}
     */
    getInputNodePosition(startNodeFromX, startNodeFromY) {
      let possibleCoordinates = this.getNodePossiblePointsCoordinates(
        startNodeFromX,
        startNodeFromY
      );

      let resultsKey;
      let minDotDistance = false;
      Object.keys(possibleCoordinates).forEach((coordinateKey) => {
        let dotDistance =
          Math.pow(possibleCoordinates[coordinateKey].x - this.mouse.x, 2) +
          Math.pow(possibleCoordinates[coordinateKey].y - this.mouse.y, 2);
        if (minDotDistance === false || minDotDistance > dotDistance) {
          minDotDistance = dotDistance;
          resultsKey = coordinateKey;
        }
      });

      return possibleCoordinates[resultsKey];
    },

    change() {
      this.$emit('update');
    },

    getOffsetRect(element) {
      let box = element.getBoundingClientRect();

      let scrollTop = window.pageYOffset;
      let scrollLeft = window.pageXOffset;

      let top = +box.top + +scrollTop;
      let left = +box.left + +scrollLeft;

      return { top: Math.round(top), left: Math.round(left) };
    },

    getMousePosition(element, event) {
      let mouseX =
        event.pageX || +event.clientX + +document.documentElement.scrollLeft;
      let mouseY =
        event.pageY || +event.clientY + +document.documentElement.scrollTop;

      let offset = this.getOffsetRect(element);
      let x = mouseX - offset.left;
      let y = mouseY - offset.top;

      return [x, y];
    },

    findNodeWithID(id) {
      return this.scene.nodes.find((item) => id === item.id);
    },

    getPortPosition(x, y, className = '') {
      if (className.includes('input')) {
        if (className.includes('leftMiddle')) {
          x = x - 1;
        }

        if (className.includes('topLeft')) {
          y = y - 1;
          x = x + 5;
        }

        if (className.includes('topMiddle')) {
          y = y + 1;
          x = x - 1;
        }

        if (className.includes('topRight')) {
          x = x - 5;
        }

        if (className.includes('bottomLeft')) {
          y = y - 1;
          x = x + 5;
        }

        if (className.includes('bottomMiddle')) {
          x = x - 1;
        }

        if (className.includes('bottomRight')) {
          y = y + 1;
          x = x - 5;
        }

        if (className.includes('rightMiddle')) {
          x = x + 1;
        }
      }

      if (className.includes('output')) {
        if (className.includes('leftMiddle')) {
          // Nothing changed
        }

        if (className.includes('topLeft')) {
          x = x + 5;
        }

        if (className.includes('topMiddle')) {
          x = x - 2;
        }

        if (className.includes('topRight')) {
          y = y + 1;
          x = x - 5;
        }

        if (className.includes('bottomLeft')) {
          x = x + 5;
        }

        if (className.includes('bottomMiddle')) {
          x = x - 1;
        }

        if (className.includes('bottomRight')) {
          y = y + 1;
          x = x - 5;
        }

        if (className.includes('rightMiddle')) {
          x = x + 1;
        }
      }

      x = x + 6;
      return [+x, +y];
    },

    linkingStart(index, target, startPos) {
      this.action.linking = true;
      const node_from = this.scene.nodes.find((node) => node.id === index);
      const options = this.$store.getters.getFieldByAlias(node_from.options);

      const filterPos = this.$store.getters.getFilterPos;
      const top = filterPos?.top || 0;
      const left = filterPos?.left || 0;

      let targetClientRect = target.getBoundingClientRect();
      let targetClassname = target.className;

      this.draggingLink = {
        mx: startPos.x + left || 0,
        my: startPos.y + top || 0,
        from: index,
        options: options.alias,
        target: {
          class_name: targetClassname,
          x: targetClientRect.x + left - this.rootDiv.x,
          y: targetClientRect.y + top - this.rootDiv.y,
        },
      };
    },

    linkingStop(index) {
      if (this.draggingLink && this.draggingLink.from !== index) {
        // add new Link
        const existed = this.scene.links.find(
          (link) => link.from === this.draggingLink.from && link.to === index
        ); // check link existence

        if (!existed) {
          let maxID = Math.max(0, ...this.scene.links.map((link) => link.id));
          let nodeTo = this.scene.nodes.find((node) => node.id === index);

          const newLink = {
            id: +maxID + 1,
            to: index,
            modal: false,
            from: this.draggingLink.from,
            target: this.draggingLink.target,
            input_coordinates: this.getInputNodePosition(nodeTo.x, nodeTo.y),
            options_to: nodeTo.options,
            options_from: this.draggingLink.options,
          };

          this.scene.links.push(newLink);
          this.$store.commit('setConditions', {
            nodes: this.scene.nodes,
            links: this.scene.links,
          });
        }
      }
      this.draggingLink = null;
    },

    editLink(event, id, cords) {
      const vm = this;
      const editedLink = this.scene.links.find((item) => item.id === id);
      if (editedLink) {
        vm.$emit('linkedit', event, editedLink, cords);
      }
    },

    nodeSelected(id, e) {
      if (
        this.action.selected === null ||
        (this.action.selected && this.action.selected !== id)
      )
        this.reset();

      this.action.dragging = id;
      this.action.selected = id;
      this.$emit('nodeClick', id);

      this.mouse.lastX =
        e.pageX || +e.clientX + +document.documentElement.scrollLeft;
      this.mouse.lastY =
        e.pageY || +e.clientY + +document.documentElement.scrollTop;
    },

    /**
     * Move element on scene
     * base on type (link|node)
     * @param e - event
     */
    handleMove(e) {
      if (this.action.linking) {
        [this.mouse.x, this.mouse.y] = this.getMousePosition(this.$el, e);
        [this.draggingLink.mx, this.draggingLink.my] = [
          this.mouse.x,
          this.mouse.y,
        ];
      }

      if (this.action.dragging) {
        this.mouse.x =
          e.pageX || +e.clientX + +document.documentElement.scrollLeft;
        this.mouse.y =
          e.pageY || +e.clientY + +document.documentElement.scrollTop;
        let diffX = this.mouse.x - this.mouse.lastX;
        let diffY = this.mouse.y - this.mouse.lastY;

        this.mouse.lastX = this.mouse.x;
        this.mouse.lastY = this.mouse.y;
        this.moveSelectedNode(diffX, diffY);
      }

      if (this.action.scrolling) {
        [this.mouse.x, this.mouse.y] = this.getMousePosition(this.$el, e);
        let diffX = this.mouse.x - this.mouse.lastX;
        let diffY = this.mouse.y - this.mouse.lastY;

        this.mouse.lastX = this.mouse.x;
        this.mouse.lastY = this.mouse.y;

        this.scene.centerX += +diffX;
        this.scene.centerY += +diffY;
      }
    },

    /**
     * On mouse up clean data
     * @param e - event
     */
    cleanActions(e) {
      const target = e.target || e.srcElement;
      if (target && target.tagName === 'svg') {
        this.$store.commit('setFilteredElements', '');
        this.action.selected = null;
        return;
      }

      if (this.$el.contains(target)) {
        if (
          typeof target.className !== 'string' ||
          target.className.indexOf('node-input') < 0
        )
          this.draggingLink = null;

        if (
          typeof target.className === 'string' &&
          target.className.indexOf('node-delete') > -1
        ) {
          if (this.hasBundle(this.action.dragging)) {
            this.showConfirmPopup();
            this.deleteFieldId = this.action.dragging;
          } else {
            this.nodeDelete(this.action.dragging);
          }
        }
      }

      this.action.dragging = null;
      this.action.linking = false;
      this.action.scrolling = false;
    },

    hasBundle(id) {
      let links = this.$store.getters.getConditions.links;
      let result = links.find(({ from, to }) => id === from || id === to);
      return result !== undefined;
    },

    showConfirmPopup() {
      this.confirmPopup = true;
    },
    closeConfirmPopup(status) {
      if (status) {
        this.nodeDelete(this.deleteFieldId);
      }
      this.confirmPopup = false;
    },

    handleUp(e) {
      this.cleanActions(e);
    },

    handleLeave(e) {
      this.cleanActions(e);
    },

    handleDown(e) {
      const target = e.target || e.srcElement;
      if (target && target.tagName === 'svg') return;
      if (
        (target === this.$el || target.matches('svg, svg *')) &&
        e.which === 1
      ) {
        this.action.scrolling = true;
        [this.mouse.lastX, this.mouse.lastY] = this.getMousePosition(
          this.$el,
          e
        );

        this.action.selected = null; // deselectAll
      }
      this.$emit('canvasClick', e);
    },

    reset() {
      this.$store.commit('setFilteredElements', '');
      this.action.selected = null;
    },

    moveSelectedNode(differenceX, differenceY) {
      let index = this.scene.nodes.findIndex(
        (item) => item.id === this.action.dragging
      );
      this.moveSelectedNodeBody(index, differenceX, differenceY);
    },

    moveSelectedNodeBody(index, differenceX, differenceY) {
      if (index !== -1) {
        const [left, top] = this.generatePositions(
          index,
          differenceX,
          differenceY
        );
        let positions = this.getNodePossiblePointsCoordinates(left, top);

        /** update links coordinates , if exist **/
        this.scene.links.forEach((link, linkIndex) => {
          if (link.to === this.action.dragging) {
            let inputPosition = link.input_coordinates.hasOwnProperty(
              'position'
            )
              ? link.input_coordinates.position
              : 'leftMiddle';
            this.$set(
              this.scene.links,
              linkIndex,
              Object.assign(this.scene.links[linkIndex], {
                input_coordinates: positions[inputPosition], //new_input_coordinates,
              })
            );
          }

          if (link.from === this.action.dragging) {
            let outputPosition = this.getOutputNodePositionKeyByClassName(
              link.target.class_name
            );
            this.$set(
              this.scene.links,
              linkIndex,
              Object.assign(this.scene.links[linkIndex], {
                target: {
                  class_name: link.target.class_name,
                  x: positions[outputPosition].x,
                  y: positions[outputPosition].y,
                  position: outputPosition,
                },
              })
            );
          }
        });

        /** update node coordinates **/
        this.$set(
          this.scene.nodes,
          index,
          Object.assign(this.scene.nodes[index], {
            x: left,
            y: top,
          })
        );
      }
    },

    moveTrigger() {
      this.scene.nodes.forEach((_, index) => {
        const [left, top] = this.generatePositions(index, 0, 0);
        let positions = this.getNodePossiblePointsCoordinates(left, top);

        this.scene.links.forEach((link, linkIndex) => {
          let inputPosition = link.input_coordinates.hasOwnProperty('position')
            ? link.input_coordinates.position
            : 'leftMiddle';
          this.$set(
            this.scene.links,
            linkIndex,
            Object.assign(this.scene.links[linkIndex], {
              input_coordinates: positions[inputPosition], // new_input_coordinates,
            })
          );

          let outputPosition = this.getOutputNodePositionKeyByClassName(
            link.target.class_name
          );
          this.$set(
            this.scene.links,
            linkIndex,
            Object.assign(this.scene.links[linkIndex], {
              target: {
                class_name: link.target.class_name,
                x: positions[outputPosition].x,
                y: positions[outputPosition].y,
                position: outputPosition,
              },
            })
          );
        });

        /** update node coordinates **/
        this.$set(
          this.scene.nodes,
          index,
          Object.assign(this.scene.nodes[index], {
            x: left,
            y: top,
          })
        );
      });
    },

    generatePositions(index, differenceX, differenceY) {
      let left = +this.scene.nodes[index].x + differenceX;
      let top = +this.scene.nodes[index].y + differenceY;

      if (top > this.nodeStyleMaxPossibleTop) {
        top = this.nodeStyleMaxPossibleTop;
      }
      if (left > this.nodeStyleMaxPossibleLeft) {
        left = this.nodeStyleMaxPossibleLeft;
      }
      if (top < 5) {
        top = 5;
      }
      if (left < 5) {
        left = 5;
      }

      return [left, top];
    },

    nodeDelete(id) {
      this.scene.nodes = this.scene.nodes.filter((node) => node.id !== id);
      this.scene.links = this.scene.links.filter(
        (link) => link.from !== id && link.to !== id
      );

      this.$emit('nodeDelete', id);
      this.$store.commit('setConditions', {
        nodes: this.scene.nodes,
        links: this.scene.links,
      });
      this.action.selected = 0;
    },

    initListeners() {
      const $el = document.querySelector('.ccb-condition-content');
      $el?.addEventListener('scroll', this.scrollHandler);
    },

    removeListeners() {
      const $el = document.querySelector('.ccb-condition-content');
      $el?.removeEventListener('scroll', this.scrollHandler);
    },

    scrollHandler(e) {
      if (!this.action.linking) {
        this.action.dragging = false;
        this.action.selected = null;
      }

      const left = e.target?.scrollLeft || 0;
      const top = e.target?.scrollTop || 0;
      this.$store.commit('updateFilterPos', { left, top });
    },
  },

  destroyed() {
    this.removeListeners();
  },

  template: `
        <div class="flowchart-container"
            ref="flowchart-container"
            @mousemove="handleMove" 
            @mouseup="handleUp"
            @mousedown="handleDown"
            @mouseleave="handleLeave"
            style="width: 3000px; height: 3000px"
            >
            <flow-chart-filter @reset="reset" :links="scene.links" :nodes="scene.nodes"/>
            <div class="calc-quick-tour-flowchart-no-elements" v-esle>
                <svg width="100%" :height="height">
                    <flow-chart-link v-bind.sync="link"
                         v-for="(link, index) in lines"
                         :key="'link' + index"
                         :link="link"
                         :rect="rootDiv"
                         @update="change"
                         @editLink="editLink">
                    </flow-chart-link>
                </svg>
            </div>
            <flow-chart-node v-bind.sync="node" 
              v-for="(node, index) in scene.nodes" 
              :key="'node' + index"
              @update="change"
              :nodeOptions="nodeOptions"
              :node="node"
              :links="scene.links"
              :nodes="scene.nodes"
              v-on:linkingStart="linkingStart"
              v-on:linkingStop="linkingStop"
              @nodeSelected="nodeSelected(node.id, $event)">
            </flow-chart-node>
            <ccb-confirm-popup 
                :cancel="'Cancel'"
                :del="'Delete field'"
                v-if="confirmPopup"
                :status="confirmPopup"
                @close-confirm="closeConfirmPopup"
            >
                <slot>
                    <span slot="description">
                        Are you sure you want to delete this field and all data associated with it?
                    </span>
                </slot>
            </ccb-confirm-popup>
        </div>
    `,
};
