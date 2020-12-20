import { createSceneObject } from './createSceneObject';
import { SideOrientation } from '../types';
import type { Plane, Vector4, SceneObject, BabylonScene } from '../types';

/**
 * Create a plane.
 */
export const plane = (name?: string) =>
  createSceneObject<{
    size: (s: number) => SceneObject;
    width: (w: number) => SceneObject;
    height: (h: number) => SceneObject;
    doublesided: () => SceneObject;
  }>({
    async createMesh(options: PlaneOptions, scene: BabylonScene) {
      const [{ PlaneBuilder }, { Vector3 }] = await Promise.all([
        import('@babylonjs/core/Meshes/Builders/planeBuilder'),
        import('../common'),
      ]);
      const mesh = PlaneBuilder.CreatePlane(
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

    createMaterial() {
      console.log('plane.createMaterial');
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

    doublesided() {
      const self = this as SceneObject;
      const options = self.meshOptions as PlaneOptions;
      options.sideOrientation = SideOrientation.DOUBLESIDE;
      return self;
    },
  });

let counter = 1;

interface PlaneOptions {
  size?: number;
  width?: number;
  height?: number;
  sideOrientation?: SideOrientation;
  sourcePlane?: Plane;
  frontUVs?: Vector4;
  backUVs?: Vector4;
}
