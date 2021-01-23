import React from 'react';
import MonacoEditor from '@monaco-editor/react';

export const Editor = () => (
  <MonacoEditor
    height="100vh"
    defaultLanguage="typescript"
    defaultValue="// some comment"
  />
);
