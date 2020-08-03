import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import '@babylonjs/core/Collisions/collisionCoordinator';
import '@babylonjs/core/Rendering/edgesRenderer';
import '@babylonjs/core/Materials/Textures/Loaders/envTextureLoader';
import '@babylonjs/core/Helpers/sceneHelpers';
import 'pepjs';

import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene as BabylonScene } from '@babylonjs/core/scene';

import { Scene, SceneCreator } from './types';

/**
 * Render scene to canvas.
 * @param canvas The canvas to render to
 * @param createScene Scene created by {@linkcode scene}
 *
 * @example
 * ```
 * render(
 *   document.querySelector('canvas'),
 *   scene(box().translate([0, 0.5, 0]))
 * )
 * ```
 */
export default (canvas: HTMLCanvasElement, createScene: SceneCreator) => {
  const engine = new Engine(canvas);
  const scene = new BabylonScene(engine) as Scene;
  scene.initializers = [];
  createScene(scene);
  scene.initializers.forEach((initializer) => initializer());
  engine.runRenderLoop(() => scene.render());
};
