import React from 'react';

export const SceneViewer: React.FC<{ source: string; isResizing: boolean }> = ({
  source,
  isResizing,
}) => {
  const srcDoc = `
  <script src="${
    process.env.NODE_ENV === 'development'
      ? '../latest/main.js'
      : 'https://pan0.net/latest/main.js'
  }"></script>
  <script>
    ${source}
  </script>
  `;

  return (
    <iframe
      srcDoc={srcDoc}
      style={{
        border: 'none',
        width: '100%',
        height: '100%',
        ...(isResizing && { pointerEvents: 'none' }),
      }}
    >
      This browser does not support iframes
    </iframe>
  );
};
