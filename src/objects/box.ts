import { SceneObject } from './SceneObject';
import type { Color4, Vector4, BabylonScene, SideOrientation } from '../types';

/**
 * Create a box.
 */
export const box = (name?: string) => new BoxSceneObject('box', name);

class BoxSceneObject extends SceneObject {
  async createMesh(options: BoxOptions, scene: BabylonScene) {
    const [{ BoxBuilder }, { Vector3 }] = await Promise.all([
      import('@babylonjs/core/Meshes/Builders/boxBuilder'),
      import('@babylonjs/core/Maths/math.vector'),
    ]);
    const mesh = BoxBuilder.CreateBox(this._name, options, scene);
    mesh.position = new Vector3(
      0,
      (options.height || options.size || 1) / 2,
      0
    );
    return mesh;
  }

  size(s: number): BoxSceneObject {
    (this._createMeshOptions as BoxOptions).size = s;
    return this;
  }

  width(w: number): BoxSceneObject {
    (this._createMeshOptions as BoxOptions).width = w;
    return this;
  }

  height(h: number): BoxSceneObject {
    (this._createMeshOptions as BoxOptions).height = h;
    return this;
  }

  depth(d: number): BoxSceneObject {
    (this._createMeshOptions as BoxOptions).depth = d;
    return this;
  }
}

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
