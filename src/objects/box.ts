import { createSceneObject } from './createSceneObject';
import type {
  Color4,
  Vector4,
  BabylonScene,
  SceneObject,
  SideOrientation,
} from '../types';

/**
 * Create a box.
 */
export const box = (name?: string) =>
  createSceneObject<{
    size: (s: number) => SceneObject;
    width: (w: number) => SceneObject;
    height: (h: number) => SceneObject;
    depth: (d: number) => SceneObject;
  }>({
    async createMesh(options: BoxOptions, scene: BabylonScene) {
      const { MeshBuilder, Vector3 } = await import('../common');
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
    },

    size(s) {
      const self = this as SceneObject;
      const options = self.meshOptions as BoxOptions;
      options.size = s;
      return self;
    },

    width(w) {
      const self = this as SceneObject;
      const options = self.meshOptions as BoxOptions;
      options.width = w;
      return self;
    },

    height(h) {
      const self = this as SceneObject;
      const options = self.meshOptions as BoxOptions;
      options.height = h;
      return self;
    },

    depth(d) {
      const self = this as SceneObject;
      const options = self.meshOptions as BoxOptions;
      options.depth = d;
      return self;
    },
  });

let counter = 1;

interface BoxOptions {
  size?: number;
  width?: number;
  height?: number;
  depth?: number;
  faceUV?: Vector4[];
  faceColors?: Color4[];
  sideOrientation?: SideOrientation;
  frontUVs?: Vector4;
  backUVs?: Vector4;
  wrap?: boolean;
  topBaseAt?: number;
  bottomBaseAt?: number;
}
