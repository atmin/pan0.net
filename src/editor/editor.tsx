import React, { useCallback, useEffect, useRef, useState } from 'react';
import babel from 'prettier/parser-babel';
import prettier from 'prettier/standalone';
import MonacoEditor from '@monaco-editor/react';

export const format = (text: string) => {
  let ast;
  const source = prettier.format(text, {
    parser(text, { babel }) {
      ast = babel(text);
      return ast;
    },
    plugins: [babel],
    printWidth: 40,
    semi: false,
    trailingComma: 'es5' as const,
  });
  return { source, ast };
};

export type EditorPosition = { lineNumber: number; column: number };

export const Editor: React.FC<{
  source: string;
  setSource: (newSource: string) => void;
  setAST: (newAST: any) => void;
  setPosition: (newPosition: EditorPosition) => void;
}> = ({ source, setSource, setAST, setPosition }) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // useful AST tools: https://astexplorer.net/ https://ts-ast-viewer.com/
      monaco.languages.registerDocumentFormattingEditProvider('javascript', {
        provideDocumentFormattingEdits(model: any) {
          const { source: text, ast } = format(model.getValue());
          setSource(text);
          setAST(ast);
          return [
            {
              range: model.getFullModelRange(),
              text,
            },
          ];
        },
      });

      editor.addAction({
        id: 'save',
        label: 'Save',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
        run() {
          editorRef.current
            .getAction('editor.action.formatDocument')
            .run()
            .then(() => {
              localStorage.setItem(location.pathname, editor.getValue());
            });
        },
      });

      editor.onDidChangeCursorPosition(({ position }) => {
        setPosition(position);
      });
    },
    [editorRef]
  );

  const handleEditorChange = useCallback(
    (value, op) => {
      const { source, ast } = format(value);
      setSource(source);
      setAST(ast);
    },
    [editorRef]
  );

  return (
    <MonacoEditor
      defaultLanguage="javascript"
      defaultValue={source}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
      }}
      onMount={handleEditorDidMount}
      onChange={handleEditorChange}
    />
  );
};
