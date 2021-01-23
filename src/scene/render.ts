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

export async function render() {
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

  const engine = new Engine(canvas);
  const scene = new BabylonScene(engine);

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
  scene.onPointerObservable.add((pointerInfo: PointerInfo) => {
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
              return scene.pick(scene.pointerX, scene.pointerY);
            },
          }
        : pointerInfo;

    for (let handler of self._eventHandlers[key]) {
      const result = handler(pInfo);
      if (result === false) {
        break;
      }
    }
  });

  scene.actionManager = new ActionManager(scene);
  scene.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnEveryFrameTrigger, () => {
      for (let handler of self._eventHandlers.frame) {
        handler();
      }
    })
  );

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
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show({ embedMode: true });
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

  //
  // Load editor on crudely detecting `edit` URL parameter
  //
  if (
    self._enableEditor &&
    (location.search === '?edit' ||
      location.search.search(/edit=.?(?:&:$)*/) > -1)
  ) {
    Promise.resolve().then(() => {
      const editorHost = document.createElement('div');
      editorHost.id = 'editor-host';
      editorHost.style.position = 'relative';
      editorHost.style.width = '400px';
      editorHost.style.zIndex = '1';
      // editorHost.style.backgroundColor = '#333333';
      editorHost.style.opacity = '0.95';
      document.body.prepend(editorHost);
      document.body.style.display = 'flex';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.height = '100%';
      document.body.style.overflow = 'hidden';
      import(
        /* webpackChunkName: "editor" */
        '../editor'
      );
    });
  }

  //
  // Create and run Babylon scene
  //
  Promise.all([
    self._createEnvironment(scene),
    self._createGround(scene),
    self._createCamera(scene),
  ]).then(() => {
    Promise.all([
      self._createSceneObjects(scene),
      self._createLights(scene),
    ]).then(() => self._eventHandlers.init.forEach((handler) => handler()));

    // For debugging. Remove when `scene.objects` interface becomes sufficient
    (window as any)._scene = scene;

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => {
      engine.resize();
    });
  });
}
