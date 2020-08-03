import { Vector3 } from '@babylonjs/core/Maths/math';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';

import SceneObject from './SceneObject';

/**
 * Create a box.
 * @param size
 *   nothing: 1 meter cube
 *   integer: cube of `size` meters
 *   [x, y, z]: box of specified sizes
 *
 */
export default (size: number | [number, number, number] = 1) =>
  new SceneObject((scene) => {
    const mesh = MeshBuilder.CreateBox(
      `box(${JSON.stringify(size)})`,
      {
        ...(typeof size === 'number' && { size }),
        ...(Array.isArray(size) && {
          width: size[0],
          height: size[1],
          depth: size[2],
        }),
      },
      scene,
    );
    mesh.position =
      typeof size === 'number'
        ? new Vector3(size / 2, size / 2, size / 2)
        : new Vector3(size[0] / 2, size[1] / 2, size[2] / 2);
    return mesh;
  });
