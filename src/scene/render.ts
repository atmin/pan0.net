import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import '@babylonjs/core/Collisions/collisionCoordinator';
import '@babylonjs/core/Materials/standardMaterial';
// import '@babylonjs/core/Rendering/edgesRenderer';
import '@babylonjs/core/Materials/Textures/Loaders/envTextureLoader';
// import '@babylonjs/core/Helpers/sceneHelpers';
import {
  PointerEventTypes,
  PointerInfo,
} from '@babylonjs/core/Events/pointerEvents';

import { ActionManager } from '@babylonjs/core/Actions/actionManager';
import { ExecuteCodeAction } from '@babylonjs/core/Actions/directActions';

import 'pepjs';

import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene as BabylonScene } from '@babylonjs/core/scene';

import type { Scene } from '../types';

export async function renderTo(
  canvas: HTMLCanvasElement
): Promise<BabylonScene> {
  const engine = new Engine(canvas);
  const babylonScene = new BabylonScene(engine);

  const self = this as Scene;

  //
  // Setup defaults
  //
  if (self._createCamera === null) {
    self.camera();
  }
  if (self._createEnvironment === null) {
    self.environment();
  }
  if (self._createLights === null) {
    self.lights([
      {
        type: 'hemispheric',
        direction: [-0.5, 1, -0.5],
      },
      {
        type: 'directional',
        direction: [0, -1, 0],
        position: [0, 10, 0],
      },
    ]);
  }
  if (self._createGround === null) {
    self.ground();
  }

  //
  // Setup event processing
  //

  // TODO: maybe deprecate/remove observables in lieu of actions?
  babylonScene.onPointerObservable.add((pointerInfo: PointerInfo) => {
    const key = {
      [PointerEventTypes.POINTERDOWN]: 'pointerdown',
      [PointerEventTypes.POINTERUP]: 'pointerup',
      [PointerEventTypes.POINTERMOVE]: 'pointermove',
      [PointerEventTypes.POINTERWHEEL]: 'pointerwheel',
      [PointerEventTypes.POINTERPICK]: 'pointerpick',
      [PointerEventTypes.POINTERTAP]: 'pointertap',
      [PointerEventTypes.POINTERDOUBLETAP]: 'pointerdoubletap',
    }[pointerInfo.type];

    const pInfo =
      // BabylonJS does not provide pickInfo on pointermove event
      key === 'pointermove'
        ? {
            ...pointerInfo,
            get pickInfo() {
              return babylonScene.pick(
                babylonScene.pointerX,
                babylonScene.pointerY
              );
            },
          }
        : pointerInfo;

    for (const handler of self._eventHandlers[key]) {
      const result = handler(pInfo);
      if (result === false) {
        break;
      }
    }
  });

  babylonScene.actionManager = new ActionManager(babylonScene);
  babylonScene.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnEveryFrameTrigger, () => {
      for (const handler of self._eventHandlers.frame) {
        handler();
      }
    })
  );

  //
  // Create and run Babylon scene
  //
  Promise.all([
    self._createEnvironment(babylonScene),
    self._createGround(babylonScene),
    self._createCamera(babylonScene),
  ]).then(() => {
    Promise.all([
      self._createSceneObjects(babylonScene),
      self._createLights(babylonScene),
    ]).then(() => {
      for (const handler of self._eventHandlers.init) {
        handler();
      }
    });

    engine.runRenderLoop(() => babylonScene.render());
    if ((window as any).ResizeObserver) {
      let timeout = null;
      const observer = new (window as any).ResizeObserver(
        (entries: Array<{ target: Element }>) => {
          for (const entry of entries) {
            if (entry.target === canvas) {
              clearTimeout(timeout);
              timeout = setTimeout(() => engine.resize(), 100);
            }
          }
        }
      );
      observer.observe(canvas);
    } else {
      let timeout = null;
      window.addEventListener('resize', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => engine.resize(), 100);
      });
    }
  });

  return babylonScene;
}

export async function render() {
  const self = this as Scene;

  //
  // Load editor on crudely detecting `edit` URL parameter
  //
  if (
    self._enableEditor &&
    (location.search === '?edit' ||
      location.search.search(/edit=.?(?:&:$)*/) > -1)
  ) {
    import(
      /* webpackChunkName: "editor" */
      '../editor'
    ).then(({ startEditorApp }) => {
      startEditorApp(self);
    });
    return;
  }

  //
  // Setup canvas
  //
  const canvas = document.createElement('canvas');
  canvas.setAttribute('touch-action', 'none');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  document.body.append(canvas);

  //
  // Render scene
  //
  const babylonScene = await self.renderTo(canvas);

  //
  // Load inspector on crudely detecting `debug` URL parameter
  //
  if (
    self._enableDebug &&
    (location.search === '?debug' ||
      location.search.search(/debug=.?(?:&:$)*/) > -1)
  ) {
    import(
      /* webpackChunkName: "inspector" */
      '@babylonjs/inspector'
    ).then(() => {
      const toggle = () => {
        if (babylonScene.debugLayer.isVisible()) {
          babylonScene.debugLayer.hide();
        } else {
          babylonScene.debugLayer.show({ embedMode: true });
          document.body.style.margin = '0';
          document.body.style.padding = '0';
          document.body.style.height = '100%';
          document.getElementById('embed-host').style.opacity = '0.95';
        }
      };
      toggle();
      document.addEventListener('keyup', (e) => e.code === 'KeyI' && toggle());
    });
  }

  return babylonScene;
}
