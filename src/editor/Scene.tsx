import React, { useEffect, useRef } from 'react';

export const Scene: React.FC<{ sceneSource: string }> = ({ sceneSource }) => {
  const srcDoc = `
  <script src="https://pan0.net/latest/main.js"></script>
  <script>
    ${sceneSource}
  </script>
  `;

  return (
    <iframe
      srcDoc={srcDoc}
      style={{ border: 'none', width: '100%', height: '100%' }}
    >
      This browser does not support iframes
    </iframe>
  );
};
