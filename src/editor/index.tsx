import { setAndStartTimer } from '@babylonjs/core';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import SplitPane from 'react-split-pane';

import { Scene } from '../types';
import { Editor, EditorPosition, format } from './Editor';

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
      scene.renderTo(ref.current).then((_scene) => {
        // For debugging. Remove when `scene.objects` interface becomes sufficient
        (window as any)._scene = _scene;
      });
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

const App: React.FC<{ scene: Scene }> = ({ scene }) => {
  const [source, setSource] = useState<string>('');
  const [ast, setAST] = useState(null);
  const [position, setPosition] = useState<EditorPosition>(null);

  useEffect(() => {
    findSource().then((src) => {
      const { source, ast } = format(src);
      setSource(source);
      setAST(ast);
      setPosition({ lineNumber: 1, column: 1 });
    });
  }, []);

  return (
    <SplitPane defaultSize="33%" split="vertical">
      <div>
        <div style={{ height: '50%' }}>
          <Editor
            source={source}
            setSource={setSource}
            setAST={setAST}
            setPosition={setPosition}
          />
        </div>
        <div style={{ height: '50%', overflow: 'auto' }}>
          <pre>
            {JSON.stringify(position)}
            <br />
            {JSON.stringify(ast, null, 2)}
          </pre>
        </div>
      </div>
      <Canvas scene={scene} />
    </SplitPane>
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
  ReactDOM.render(<App scene={scene} />, root);
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
