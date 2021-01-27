import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import SplitPane from 'react-split-pane';

import { Scene } from '../types';
import { Editor } from './editor';

const styles = `
  body {
    margin: 0;
    padding: 0;
  }

  .Resizer {
    background: #000;
    opacity: 0.2;
    z-index: 1;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }
  
  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }
  
  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }
  
  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }
  
  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }
  
  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
  .Resizer.disabled {
    cursor: not-allowed;
  }
  .Resizer.disabled:hover {
    border-color: transparent;
  }
`;
const css = document.createElement('style');
css.appendChild(document.createTextNode(styles));
document.head.appendChild(css);

const Canvas: React.FC<{ scene: Scene }> = ({ scene }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (ref) {
      scene.renderTo(ref.current);
    }
  }, [ref]);
  return (
    <canvas
      touch-action="none"
      style={{ width: '100%', height: '100%' }}
      ref={ref}
    ></canvas>
  );
};

export const startEditorApp = (scene: Scene) => {
  const root = Object.assign(document.createElement('div'), {
    style: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
    },
  });
  document.body.appendChild(root);

  ReactDOM.render(
    <SplitPane defaultSize="33%" split="vertical">
      <Editor />
      <Canvas scene={scene} />
    </SplitPane>,
    root
  );
};
