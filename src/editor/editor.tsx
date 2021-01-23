import React, { useCallback, useRef } from 'react';
import babel from 'prettier/parser-babel';
import prettier from 'prettier/standalone';
import MonacoEditor from '@monaco-editor/react';

const PRETTIER_OPTIONS = {
  parser: 'babel' as const,
  plugins: [babel],
  printWidth: 40,
  semi: false,
  trailingComma: 'es5' as const,
};

export const Editor = () => {
  const editorRef = useRef(null);

  const handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      monaco.languages.registerDocumentFormattingEditProvider('javascript', {
        provideDocumentFormattingEdits(model: any) {
          return [
            {
              range: model.getFullModelRange(),
              text: prettier.format(model.getValue(), PRETTIER_OPTIONS),
            },
          ];
        },
      });

      editor.addAction({
        id: 'save',
        label: 'Save',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
        async run() {
          await editorRef.current
            .getAction('editor.action.formatDocument')
            .run();

          localStorage.setItem(location.pathname, editorRef.current.getValue());
        },
      });

      editor.onDidChangeCursorPosition(({ position, reason, source }) => {
        console.log({ position, reason, source });
      });
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
    />
  );
};
