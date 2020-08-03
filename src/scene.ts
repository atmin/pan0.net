import camera from './camera';
import environment from './environment';
import ground from './ground';
import lights from './lights';
import SceneObject from './SceneObject';
import { Scene, SceneCreator } from './types';

/**
 * Create a scene from list of objects
 * @param objects Scene objects
 * @returns A scene creator function
 *
 * @example
 * ```
 * // Reflective red sphere on a light gray box
 * scene(
 *   box([3, 1, 3]),
 *   sphere(1.5)
 *     .translate([0, 1, 0])
 *     .albedo_color(COLOR_RED)
 *     .metallic(1)
 *     .roughness(0)
 *     .env_snapshot(0)
 * )
 * ```
 */
export default (...objects: Array<SceneObject>): SceneCreator => (
  scene: Scene,
) => {
  objects
    .filter((o) => o instanceof SceneObject || typeof o === 'function')
    .flat()
    .forEach((obj) => {
      if (obj instanceof SceneObject) {
        obj.appendTo(scene);
      } else if (typeof obj === 'function') {
        (obj as SceneCreator)(scene);
      }
    });

  if (!scene.environmentApplied) {
    environment()(scene);
  }

  if (!scene.lightsApplied) {
    lights([
      {
        type: 'hemispheric',
        direction: [0.5, 1, 0.5],
      },
      {
        type: 'directional',
        direction: [0, -1, 0],
        position: [0, 10, 0],
      },
    ])(scene);
  }

  if (!scene.getCameraByName('camera')) {
    camera()(scene);
  }

  if (!scene.getMeshByName('ground')) {
    ground()(scene);
  }
};
