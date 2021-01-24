import React, { useCallback, useRef, useState } from 'react';
import babel from 'prettier/parser-babel';
import prettier from 'prettier/standalone';
import MonacoEditor from '@monaco-editor/react';

export const Editor = () => {
  const editorRef = useRef(null);
  const formatterRef = useRef(null);

  const [source, setSource] = useState(
    localStorage.getItem(location.pathname) || ''
  );
  const [ast, setAst] = useState(null);
  const [position, setPosition] = useState(null);

  const handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // useful AST tools: https://astexplorer.net/ https://ts-ast-viewer.com/
      monaco.languages.registerDocumentFormattingEditProvider('javascript', {
        provideDocumentFormattingEdits(model: any) {
          return [
            {
              range: model.getFullModelRange(),
              text: prettier.format(model.getValue(), {
                parser(text, { babel }) {
                  const ast = babel(text);
                  setAst(ast);
                  //   console.log(ast);
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
          localStorage.setItem(location.pathname, editor.getValue());
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
      clearTimeout(formatterRef.current);
      formatterRef.current = setTimeout(() => {
        editorRef.current.getAction('editor.action.formatDocument').run();
      }, 500);
    },
    [editorRef]
  );

  findSource().then((src) => {
    setSource(src);
    // editor.getAction('editor.action.formatDocument').run();
  });

  return (
    <MonacoEditor
      height="100vh"
      defaultLanguage="javascript"
      defaultValue={source}
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

/**
 * Find the source code of the current scene.
 * Currently, iterates only the inline script tags and finds
 * the first to use the scene() function
 *
 * TODO: iterate script src="..." tags, fetch and check for scene()
 */
const findSource = async (): Promise<string> => {
  for (const script of document.querySelectorAll('script')) {
    if (script.innerText.match(/scene\([\s\S]*?\)[\s\S]*?\.render\(\)/)) {
      return Promise.resolve(script.innerText);
    }
  }
  return Promise.resolve('');
};
