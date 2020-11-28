import { createSceneObject } from './createSceneObject';
import type {
  Plane,
  Vector4,
  SceneObject,
  SideOrientation,
  BabylonScene,
} from '../types';

interface PlaneOptions {
  size?: number;
  width?: number;
  height?: number;
  sideOrientation?: SideOrientation;
  sourcePlane?: Plane;
  frontUVs?: Vector4;
  backUVs?: Vector4;
}

/**
 * Create a plane.
 */
export const plane = (name?: string) =>
  createSceneObject<{
    size: (s: number) => SceneObject;
    width: (w: number) => SceneObject;
    height: (h: number) => SceneObject;
  }>({
    async createMesh(options: PlaneOptions, scene: BabylonScene) {
      const { MeshBuilder, Vector3 } = await import('../common');
      const mesh = MeshBuilder.CreatePlane(
        name || `plane(${counter++})`,
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
      const options = self.meshOptions as PlaneOptions;
      options.size = s;
      return self;
    },
    width(w) {
      const self = this as SceneObject;
      const options = self.meshOptions as PlaneOptions;
      options.width = w;
      return self;
    },
    height(h) {
      const self = this as SceneObject;
      const options = self.meshOptions as PlaneOptions;
      options.height = h;
      return self;
    },
  });

let counter = 1;
