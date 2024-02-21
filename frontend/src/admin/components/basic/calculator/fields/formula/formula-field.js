import formulaMixin from './formula.mixin';
import {
  Decoration,
  EditorView,
  keymap,
  MatchDecorator,
  ViewPlugin,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { defaultKeymap } from '@codemirror/commands';
import { syntaxTree } from '@codemirror/language';
import { linter, lintGutter } from '@codemirror/lint';
import { CCBSyntax } from '../../syntax/ccb-language';

export default {
  mixins: [formulaMixin],
  props: ['available_fields', 'id', 'value', 'legacy'],

  data: () => ({
    costCalcLetterFormula: '',
    editor: null,
  }),

  computed: {
    getFormulaValue() {
      return this.value || '';
    },
  },

  mounted() {
    this.initEditor();
  },

  methods: {
    initEditor() {
      this.costCalcLetterFormula =
        this.transferCostCalcFormulaToLetterFormula();
      this.costCalcLetterFormula = this.costCalcLetterFormula.toUpperCase();

      const regexLetterList = this.getRegexLetterList();
      const regexOperatorList = this.getOperatorList();

      const letterMatcher = this.letterMatcherInstance(regexLetterList);
      const letterColorPlugin = this.letterColorPluginInstance(letterMatcher);

      const operatorMatcher = this.operatorMatcherInstance(regexOperatorList);
      const operatorPatternPlugin =
        this.operatorPatternPluginInstance(operatorMatcher);

      const state = this.editorStateInstance(
        letterColorPlugin,
        operatorPatternPlugin
      );

      this.editor = this.editorInstance(state);
      this.editor.dom.addEventListener('focusout', (e) => {
        setTimeout(() => {
          this.editorInputEventHandler(e);
        }, 0);
      });

      this.editor.dom.addEventListener('input', this.editorInputEventHandler);
    },

    insertAtCursorDom(inputText) {
      const selection = this.editor.state.selection.main;
      if (inputText) {
        let cursorPosition = inputText.length;

        if (inputText.length > 5) {
          for (let char of inputText) {
            cursorPosition += 1;
            if (char === '(') {
              cursorPosition = cursorPosition - inputText.length;
              break;
            }
          }
        }

        const transaction = this.editor.state.update({
          changes: {
            from: selection.head,
            to: selection.head,
            insert: inputText,
          },
          selection: {
            anchor: selection.head + cursorPosition,
            head: selection.head + cursorPosition,
          },
        });
        this.editor.dispatch(transaction);
        this.editor.contentDOM.focus();

        this.change();
      }
    },

    transferCostCalcFormulaToLetterFormula() {
      let formula = this.getFormulaValue;
      // let formula = '';
      const replacements = new Map([
        ['&&', ' AND '],
        ['||', ' OR '],
        ['Math.', ''],
      ]);

      const regex = new RegExp(
        `\\b(?:${this.available_fields
          .map((field) => field.alias)
          .join('|')})\\b|(\\|\\||&&|Math\\.)`,
        'g'
      );
      return formula.replace(
        regex,
        (match) =>
          replacements.get(match) ??
          this.available_fields.find((field) => field.alias === match)
            ?.letter ??
          match
      );
    },

    getRegexLetterList() {
      let i = 0;
      let regexList = '';

      for (const field of this.available_fields) {
        if (i === this.available_fields.length - 1) {
          regexList += field.letter;
        } else {
          regexList += field.letter + '|';
        }
        i++;
      }
      return new RegExp(`\\b(${regexList})\\b`, 'g');
    },

    getOperatorList() {
      const keywordList = 'POW|SQRT|ROUND|CEIL|FLOOR|ABS|IF|ELSE|OR|AND';
      const specialCharacters =
        '\\{|\\}|\\(|\\)|;|\\?|:|=|\\!|>|<|*|/|+|\\-|%|,';
      const combinedPattern = `(?:\\b(?:${keywordList.replace(
        /\|/g,
        '|'
      )})\\b|[${specialCharacters}])`;
      return new RegExp(combinedPattern, 'g');
    },

    letterMatcherInstance(regexLetterList) {
      return this.available_fields.length > 0
        ? new MatchDecorator({
            regexp: regexLetterList,
            decoration: () =>
              Decoration.mark({ class: 'ccb-formula-field-letter' }),
          })
        : [];
    },

    letterColorPluginInstance(letterMatcher) {
      return this.available_fields.length > 0
        ? ViewPlugin.fromClass(
            class {
              constructor(view) {
                this.view = view;
                this.decorations = letterMatcher.createDeco(view);
              }
              update(update) {
                this.decorations = letterMatcher.updateDeco(
                  update,
                  this.decorations
                );
              }
            },
            {
              decorations: (instance) => instance.decorations,
              provide: (plugin) =>
                EditorView.atomicRanges.of((view) => {
                  return view.plugin(plugin)?.decorations || Decoration.none;
                }),
            }
          )
        : [];
    },

    operatorMatcherInstance(regexOperatorList) {
      return new MatchDecorator({
        regexp: regexOperatorList,
        decoration: () => Decoration.mark({ class: 'ccb-formula-operator' }),
      });
    },

    operatorPatternPluginInstance(operatorMatcher) {
      return ViewPlugin.fromClass(
        class {
          constructor(view) {
            this.view = view;
            this.decorations = operatorMatcher.createDeco(view);
          }
          update(update) {
            this.decorations = operatorMatcher.updateDeco(
              update,
              this.decorations
            );
          }
        },
        {
          decorations: (instance) => instance.decorations,
          provide: (plugin) =>
            EditorView.atomicRanges.of((view) => {
              return view.plugin(plugin)?.decorations || Decoration.none;
            }),
        }
      );
    },

    editorStateInstance(letterColorPlugin, operatorPatternPlugin) {
      const capitalizeLettersPlugin = [
        EditorView.inputHandler.of(this.inputHandlerForLetters),
      ];

      const customLinter = linter(this.linterHandler);

      return EditorState.create({
        doc: this.costCalcLetterFormula,
        extensions: [
          basicSetup,
          keymap.of(defaultKeymap),
          EditorView.lineWrapping,
          letterColorPlugin,
          operatorPatternPlugin,
          customLinter,
          capitalizeLettersPlugin,
          lintGutter(),
          CCBSyntax(),
        ],
      });
    },

    editorInstance(state) {
      return new EditorView({
        parent: document.querySelector('.ccb-cm-formula-input'),
        state: state,
      });
    },

    editorInputEventHandler(event) {
      const selection = this.editor.state.selection.main;
      const inputText = event.data;
      if (inputText && /[(){}.]/.test(inputText)) return;

      const uppercaseText = inputText ? inputText.toUpperCase() : '';

      //Replace all characters between the start and end positions with the uppercase text.
      this.editor.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: uppercaseText,
        },
      });

      // Move the cursor to the end of the uppercase text, or to the end of the document if the uppercase text is outside of the document.
      const cursorPosition = Math.min(
        selection.to + uppercaseText.length,
        this.editor.state.doc.length
      );

      this.editor.dispatch({
        selection: {
          anchor: cursorPosition,
          head: cursorPosition,
        },
      });

      this.change();
    },

    change() {
      this.costCalcLetterFormula = this.editor.state.doc.toString();
      this.$emit('change', this.buildFormula());
    },

    buildFormula() {
      let formula = this.costCalcLetterFormula;
      const keywordList = 'POW|SQRT|ROUND|CEIL|FLOOR|ABS|IF|ELSE|OR|AND';
      const replacements = new Map([
        ['AND', '&&'],
        ['OR', '||'],
        ['POW', 'Math.pow'],
        ['SQRT', 'Math.sqrt'],
        ['CEIL', 'Math.ceil'],
        ['FLOOR', 'Math.floor'],
        ['ROUND', 'Math.round'],
        ['ABS', 'Math.abs'],
        ['IF', 'if'],
        ['ELSE', 'else'],
      ]);
      const regex = new RegExp(
        `\\b(?:${this.available_fields
          .map((field) => field.letter)
          .join('|')}|${keywordList})\\b`,
        'g'
      );
      return formula.replace(
        regex,
        (match) =>
          replacements.get(match) ??
          this.available_fields.find((field) => field.letter === match)
            ?.alias ??
          match
      );
    },

    linterHandler(view) {
      let diagnostics = [];
      let tree = syntaxTree(view.state);
      tree.cursor().iterate((node) => {
        let nextNode = tree.resolve(node.to, 1);

        if (node.name === 'ArithOp' && nextNode.name === 'ArithOp') {
          diagnostics.push({
            from: node.from,
            to: node.to,
            severity: 'error',
            message: 'Repeated math operator',
            actions: [
              {
                name: 'Remove',
                apply(view, from, to) {
                  view.dispatch({ changes: { from, to } });
                },
              },
            ],
          });
        }

        if (node.type.isError && view.state.doc.length > 0) {
          diagnostics.push({
            from: node.from,
            to: node.to,
            severity: 'error',
            message: 'An error expression found, please fix it',
          });
        }

        if (
          node.name === ',' &&
          syntaxTree(view.state).resolveInner(node.from).name !== 'ArgList'
        ) {
          diagnostics.push({
            from: node.from,
            to: node.to,
            severity: 'error',
            message: 'The decimal separator should be a period.',
            actions: [
              {
                name: 'Remove',
                apply(view, from, to) {
                  view.dispatch({ changes: { from, to } });
                },
              },
            ],
          });
        }

        if (node.name === 'VariableName' && !node.type.isError) {
          let specificIdentifier = view.state.doc
            .toString()
            .substring(node.from, node.to)
            .trim();

          const letterDoesNotExist = this.available_fields.every((obj) => {
            return (
              obj.hasOwnProperty('letter') &&
              !obj['letter'].includes(specificIdentifier)
            );
          });

          const validFunctions = 'POW|SQRT|ROUND|CEIL|FLOOR|ABS|IF|ELSE|OR|AND';
          const validStringsArray = validFunctions.split('|');
          const functionDoesNotExist =
            !validStringsArray.includes(specificIdentifier);

          if (letterDoesNotExist && functionDoesNotExist) {
            diagnostics.push({
              from: node.from,
              to: node.to,
              severity: 'error',
              message: 'Error: Nonexistent letters are used',
              actions: [
                {
                  name: 'Remove',
                  apply(view, from, to) {
                    view.dispatch({ changes: { from, to } });
                  },
                },
              ],
            });
          }
        }
      });

      return diagnostics;
    },

    inputHandlerForLetters(view, from, to, text) {
      let uppercaseText = text.toUpperCase();
      view.dispatch({
        changes: { from, to, insert: uppercaseText },
        selection: { anchor: from + 1 },
        scrollIntoView: true,
      });
      this.costCalcLetterFormula = this.editor.state.doc.toString();
      this.totalField.costCalcFormula = this.buildFormula();
      return true;
    },
  },

  template: `
    <div class="ccb-edit-field-formula">
      <div class="ccb-formula-content">
        <div class="ccb-cm-formula-input" spellcheck="false"></div>
      </div>
      <div class="ccb-formula-tools">
        <span class="ccb-formula-tool" title="Addition (+)" @click="insertAtCursorDom('+')">
          <span class="plus">+</span>
        </span>
        <span class="ccb-formula-tool" title="Subtraction (-)" @click="insertAtCursorDom('-')">-</span>
        <span class="ccb-formula-tool" title="Division (/)" @click="insertAtCursorDom('/')">/</span>
        <span class="ccb-formula-tool" title="Remainder (%)" @click="insertAtCursorDom('%')">%</span>
        <span class="ccb-formula-tool" title="Multiplication (*)" @click="insertAtCursorDom('*')">
          <span class="multiple">*</span>
        </span>
        <span class="ccb-formula-tool" title="Open bracket '('" @click="insertAtCursorDom('(')">(</span>
        <span class="ccb-formula-tool" title="Close bracket ')'" @click="insertAtCursorDom(')')">)</span>
        <span class="ccb-formula-tool" title="Math.pow(x, y) returns the value of x to the power of y:" @click="insertAtCursorDom(' POW(,) ')">^</span>
        <span class="ccb-formula-tool" title="Math.sqrt(x) returns the square root of x:" @click="insertAtCursorDom(' SQRT() ')">&#8730;</span>
        <span class="ccb-formula-tool" title="If operator" @click="insertAtCursorDom('IF(){}')">IF</span>
        <span class="ccb-formula-tool" title="If else operator" @click="insertAtCursorDom(' IF(){}ELSE{} ')">IF ELSE</span>
        <span class="ccb-formula-tool" title="Boolean operator &&" @click="insertAtCursorDom(' AND ')">AND</span>
        <span class="ccb-formula-tool" title="Boolean operator ||" @click="insertAtCursorDom(' OR ')">OR</span>
        <span class="ccb-formula-tool" title="Operator less than" @click="insertAtCursorDom('<')"><</span>
        <span class="ccb-formula-tool" title="Operator more than" @click="insertAtCursorDom('>')">></span>
        <span class="ccb-formula-tool" title="Operator less than" @click="insertAtCursorDom('<=')"><=</span>
        <span class="ccb-formula-tool" title="Operator more than" @click="insertAtCursorDom('>=')">>=</span>
        <span class="ccb-formula-tool" title="Operator not equal" @click="insertAtCursorDom('!=')">!=</span>
        <span class="ccb-formula-tool" title="Operator strict equal" @click="insertAtCursorDom('==')">==</span>
        <span class="ccb-formula-tool" title="Math.abs(x)" @click="insertAtCursorDom(' ABS()')">ABS</span>
        <span class="ccb-formula-tool" title="Math.pow(x, y)" @click="insertAtCursorDom(' POW()')">POW</span>
        <span class="ccb-formula-tool" title="Math.round(x) returns the value of x rounded to its nearest integer:" @click="insertAtCursorDom(' ROUND()')">ROUND</span>
        <span class="ccb-formula-tool" title="Math.ceil(x) returns the value of x rounded up to its nearest integer:" @click="insertAtCursorDom(' CEIL() ')">CEIL</span>
        <span class="ccb-formula-tool" title="Math.floor(x) returns the value of x rounded down to its nearest integer:" @click="insertAtCursorDom(' FLOOR()')">FLOOR</span>
      </div>
      <div class="ccb-edit-field-aliases">
        <template v-if="available_fields && available_fields.length">
          <div class="ccb-edit-field-alias" v-for="(item) in available_fields" :title="item.alias" @click="insertAtCursorDom( ' '+item.letter+' ')" v-if="item.alias !== 'total'">
            <div class="ccb-edit-field-letter">
              <span>{{ item.letter }}</span>
            </div>
            <div class="ccb-edit-field-label">
              <span>{{ item.label }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  `,
};
