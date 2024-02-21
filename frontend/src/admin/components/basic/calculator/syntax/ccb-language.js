import {
  LRLanguage,
  LanguageSupport,
  foldNodeProp,
  foldInside,
} from '@codemirror/language';
import { styleTags, tags as t } from '@lezer/highlight';
import { parser } from './parser';

export const CCBLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        Identifier: t.variableName,
        Boolean: t.bool,
        String: t.string,
        LineComment: t.lineComment,
        '( )': t.paren,
      }),
      foldNodeProp.add({
        'Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression ObjectType':
          foldInside,
        BlockComment(tree) {
          return { from: tree.from + 2, to: tree.to - 2 };
        },
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: ';' },
  },
});

export function CCBSyntax() {
  return new LanguageSupport(CCBLanguage);
}
