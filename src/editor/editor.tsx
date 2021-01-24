import React, { useCallback, useRef, useState } from 'react';
import babel from 'prettier/parser-babel';
import prettier from 'prettier/standalone';
import MonacoEditor from '@monaco-editor/react';

export const Editor = () => {
  const editorRef = useRef(null);

  const [source, setSource] = useState(null);
  const [ast, setAst] = useState(null);
  const [position, setPosition] = useState(null);

  const handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // useful AST explorer: https://astexplorer.net/
      monaco.languages.registerDocumentFormattingEditProvider('javascript', {
        provideDocumentFormattingEdits(model: any) {
          return [
            {
              range: model.getFullModelRange(),
              text: prettier.format(model.getValue(), {
                parser(text, { babel }) {
                  const ast = babel(text);
                  setAst(ast);
                  console.log(ast);
                  return ast;
                },
                plugins: [babel],
                printWidth: 40,
                semi: false,
                trailingComma: 'es5' as const,
              }),
            },
          ];
        },
      });

      editor.addAction({
        id: 'save',
        label: 'Save',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
        run() {
          editorRef.current.getAction('editor.action.formatDocument').run();

          localStorage.setItem(location.pathname, editorRef.current.getValue());
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
      setSource(value);
      console.log(op);
    },
    [editorRef]
  );

  return (
    <MonacoEditor
      height="100vh"
      defaultLanguage="javascript"
      defaultValue={localStorage.getItem(location.pathname) || ''}
      theme="vs-dark"
      options={{
        // formatOnType: true,
        minimap: { enabled: false },
        // automaticLayout: true,
      }}
      onMount={handleEditorDidMount}
      onChange={handleEditorChange}
    />
  );
};
