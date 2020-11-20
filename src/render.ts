import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import '@babylonjs/core/Collisions/collisionCoordinator';
import '@babylonjs/core/Rendering/edgesRenderer';
import '@babylonjs/core/Materials/Textures/Loaders/envTextureLoader';
import '@babylonjs/core/Helpers/sceneHelpers';
import 'pepjs';

import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene as BabylonScene } from '@babylonjs/core/scene';

import { Scene } from './types';

export async function render() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  document.body.append(canvas);

  const engine = new Engine(canvas);
  const scene = new BabylonScene(engine);

  const self = this as Scene;

  self._createSceneObjects(scene);
  if (!self._createCamera) {
    self.camera();
  }
  await this._createCamera(scene);

  engine.runRenderLoop(() => scene.render());
  window.addEventListener('resize', () => {
    engine.resize();
  });
}
