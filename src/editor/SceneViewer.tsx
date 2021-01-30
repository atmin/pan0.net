import React, { useRef, useState, useEffect } from 'react';

import { Scene } from '../types';

export const SceneViewer: React.FC<{ source: string; isResizing: boolean }> = ({
  source,
  isResizing,
}) => {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const timeoutRef = useRef(null);
  const [debouncedSource, setDebouncedSource] = useState<string>(source);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setDebouncedSource(source);
      timeoutRef.current = null;
    }, 2000);
  }, [source]);

  useEffect(() => {
    const newScene = ((frameRef.current.contentWindow as unknown) as {
      scene: Scene;
    }).scene;

    // if (scene && newScene) {
    //   newScene.activeCamera.position = scene.activeCamera.position.clone();
    //   newScene.activeCamera.rotation = scene.activeCamera.rotation.clone();
    // }

    setScene(newScene);
  }, [debouncedSource]);

  const srcDoc = `
  <script src="${
    process.env.NODE_ENV === 'development'
      ? '../latest/main.js'
      : 'https://pan0.net/latest/main.js'
  }"></script>
  <script>
    ${debouncedSource}
  </script>
  `;

  return (
    <div style={{ width: '100%', height: '100%', background: 'gray' }}>
      <iframe
        srcDoc={srcDoc}
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
          ...(isResizing && { display: 'none' }),
        }}
        ref={frameRef}
      >
        This browser does not support iframes
      </iframe>
    </div>
  );
};
