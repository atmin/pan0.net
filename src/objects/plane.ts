import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { SceneObject } from './SceneObject';
import { Plane, Vector4, BabylonScene, SideOrientation } from '../types';

/**
 * Create a plane.
 */
export const plane = (name?: string) => new PlaneSceneObject('plane', name);

class PlaneSceneObject extends SceneObject {
  async createMesh(options: PlaneOptions, scene: BabylonScene) {
    const { PlaneBuilder } = await import(
      /* webpackChunkName: "planeBuilder" */
      '@babylonjs/core/Meshes/Builders/planeBuilder'
    );
    const mesh = PlaneBuilder.CreatePlane(this._name, options, scene);
    mesh.position = new Vector3(
      0,
      (options.height || options.size || 1) / 2,
      0
    );
    return mesh;
  }

  size(s: number): PlaneSceneObject {
    (this._createMeshOptions as PlaneOptions).size = s;
    return this;
  }

  width(w: number): PlaneSceneObject {
    (this._createMeshOptions as PlaneOptions).width = w;
    return this;
  }

  height(h: number): PlaneSceneObject {
    (this._createMeshOptions as PlaneOptions).height = h;
    return this;
  }

  doublesided(): PlaneSceneObject {
    (this._createMeshOptions as PlaneOptions).sideOrientation =
      SideOrientation.DOUBLESIDE;
    return this;
  }
}

interface PlaneOptions {
  size?: number;
  width?: number;
  height?: number;
  sideOrientation?: SideOrientation;
  sourcePlane?: Plane;
  frontUVs?: Vector4;
  backUVs?: Vector4;
}
