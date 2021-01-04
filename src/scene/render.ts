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
import 'pepjs';

import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene as BabylonScene } from '@babylonjs/core/scene';

import type { Scene } from '../types';

export async function render() {
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

  await Promise.all([
    self._createSceneObjects(scene),
    self._createCamera(scene),
    self._createEnvironment(scene),
    self._createLights(scene),
    self._createGround(scene),
  ]);

  self._eventHandlers.init.forEach((handler) => handler());

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
      // TODO: make it dynamic, pickInfo getter
      key === 'pointermove'
        ? {
            ...pointerInfo,
            pickInfo: scene.pick(scene.pointerX, scene.pointerY),
          }
        : pointerInfo;

    for (let handler of self._eventHandlers[key]) {
      const result = handler(pInfo);
      if (result === false) {
        break;
      }
    }
  });

  (window as any)._scene = scene;

  engine.runRenderLoop(() => scene.render());
  window.addEventListener('resize', () => {
    engine.resize();
  });
}
