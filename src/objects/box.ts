import { createObject } from './createObject';
import type { Color4, Vector4, BabylonScene, SceneObject } from '../types';

interface BoxOptions {
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
}
/**
 * Create a box.
 */
export const box = (name?: string) =>
  createObject<{
    size: (s: number) => SceneObject;
    width: (w: number) => SceneObject;
    height: (h: number) => SceneObject;
    depth: (d: number) => SceneObject;
  }>(
    (options: BoxOptions, scene: BabylonScene) =>
      import('../common').then(({ MeshBuilder, Vector3 }) => {
        const mesh = MeshBuilder.CreateBox(
          name || `box(${counter++})`,
          options,
          scene
        );
        mesh.position = new Vector3(
          0,
          (options.height || options.size || 1) / 2,
          0
        );
        return mesh;
      }),

    {
      size(s) {
        (this.options as BoxOptions).size = s;
        return this;
      },
      width(w) {
        (this.options as BoxOptions).width = w;
        return this;
      },
      height(h) {
        (this.options as BoxOptions).height = h;
        return this;
      },
      depth(d) {
        (this.options as BoxOptions).depth = d;
        return this;
      },
    }
  );

let counter = 1;
