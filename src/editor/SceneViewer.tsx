import React, { useRef, useState, useEffect, useCallback } from 'react';

import { Vector3 } from '@babylonjs/core/Maths/math';

import { AST, findSceneObjects } from './ast';

export const SceneViewer: React.FC<{
  source: string;
  ast: AST;
  editorPosition: any;
  isResizing: boolean;
}> = ({ source, ast, editorPosition, isResizing }) => {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const timeoutRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [background, setBackground] = useState<string>('gray');
  const [position, setPosition] = useState<Vector3 | null>(null);
  const [rotation, setRotation] = useState<Vector3 | null>(null);
  const [debouncedSource, setDebouncedSource] = useState<string>(source);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!findSceneObjects(ast).length) {
      return;
    }
    timeoutRef.current = setTimeout(() => {
      setDebouncedSource(source);
      timeoutRef.current = null;
    }, 2000);
  }, [source, ast, editorPosition]);

  useEffect(() => {
    const { scene } = frameRef.current.contentWindow as any;
    scene?.babylon?.onAfterRenderObservable?.addOnce(() => {
      const canvas = frameRef.current.contentDocument.querySelector('canvas');
      setBackground(`url("${canvas.toDataURL()}")`);
    });
  }, [source]);

  useEffect(() => {
    const { scene } = frameRef.current.contentWindow as any;
    setPosition(scene?.babylon?.activeCamera?.position);
    setRotation(scene?.babylon?.activeCamera?.rotation);
    setIsLoading(true);
  }, [frameRef, debouncedSource]);

  const onLoad = useCallback(() => {
    const { scene } = frameRef.current.contentWindow as any;
    if (position) {
      scene.babylon.activeCamera.position = position;
    }
    if (rotation) {
      scene.babylon.activeCamera.rotation = rotation;
    }
    setIsLoading(false);
  }, [position, rotation]);

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
    <div
      style={{
        width: '100%',
        height: '100%',
        background,
        ...(isLoading && { filter: 'grayscale(100%)' }),
      }}
    >
      <iframe
        srcDoc={srcDoc}
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
          ...(isResizing && { pointerEvents: 'none' }),
          ...(isLoading && { opacity: 0 }),
        }}
        ref={frameRef}
        onLoad={onLoad}
      >
        This browser does not support iframes
      </iframe>
    </div>
  );
};
