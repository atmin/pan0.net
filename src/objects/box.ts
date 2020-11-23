import type { Color4, Vector4 } from '@babylonjs/core/Maths/math';

import { createObject } from './createObject';
import type { BabylonScene } from '../types';

/**
 * Create a box.
 *
 * @param options (Optional) https://doc.babylonjs.com/divingDeeper/mesh/creation/set/box
 *
 * TODO: remap
 * - options.[faceUV, frontUVs, backUVs] to arrays of arrays of fixed elements
 * - options.faceColors using chroma.js
 */
export function box(
  options: {
    size?: number;
    width?: number;
    height?: number;
    depth?: number;
    faceUV?: Vector4[];
    faceColors?: Color4[];
    sideOrientation?: number;
    frontUVs?: Vector4;
    backUVs?: Vector4;
    wrap?: boolean;
    topBaseAt?: number;
    bottomBaseAt?: number;
    // updatable?: boolean;
  } = {}
) {
  return createObject((scene: BabylonScene) =>
    import('../common').then(({ MeshBuilder }) =>
      MeshBuilder.CreateBox(`box(${counter++})`, options, scene)
    )
  );
}

let counter = 1;
