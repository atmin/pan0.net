import { Vector3, Vector4 } from '@babylonjs/core/Maths/math.vector';
import { SceneObject } from './SceneObject';
import type { BabylonScene, SideOrientation } from '../types';

/**
 * Create a box.
 */
export const sphere = (name?: string) => new SphereSceneObject('sphere', name);

class SphereSceneObject extends SceneObject {
  async createMesh(options: SphereOptions, scene: BabylonScene) {
    const { SphereBuilder } = await import(
      '@babylonjs/core/Meshes/Builders/sphereBuilder'
    );
    const mesh = SphereBuilder.CreateSphere(this._name, options, scene);
    mesh.position = new Vector3(
      0,
      (options.diameterY || options.diameter || 1) / 2,
      0
    );
    return mesh;
  }

  segments(s: number): SphereSceneObject {
    (this._createMeshOptions as SphereOptions).segments = s;
    return this;
  }

  diameter(d: number): SphereSceneObject {
    (this._createMeshOptions as SphereOptions).diameter = d;
    return this;
  }

  diameterX(d: number): SphereSceneObject {
    (this._createMeshOptions as SphereOptions).diameterX = d;
    return this;
  }

  diameterY(d: number): SphereSceneObject {
    (this._createMeshOptions as SphereOptions).diameterY = d;
    return this;
  }

  diameterZ(d: number): SphereSceneObject {
    (this._createMeshOptions as SphereOptions).diameterZ = d;
    return this;
  }

  arc(a: number): SphereSceneObject {
    (this._createMeshOptions as SphereOptions).arc = a;
    return this;
  }

  slice(s: number): SphereSceneObject {
    (this._createMeshOptions as SphereOptions).slice = s;
    return this;
  }

  sideOrientation(s: SideOrientation): SphereSceneObject {
    (this._createMeshOptions as SphereOptions).sideOrientation = s;
    return this;
  }

  frontUVs(v: [number, number, number, number]): SphereSceneObject {
    (this._createMeshOptions as SphereOptions).frontUVs = new Vector4(...v);
    return this;
  }

  backUVs(v: [number, number, number, number]): SphereSceneObject {
    (this._createMeshOptions as SphereOptions).backUVs = new Vector4(...v);
    return this;
  }
}

interface SphereOptions {
  segments?: number;
  diameter?: number;
  diameterX?: number;
  diameterY?: number;
  diameterZ?: number;
  arc?: number;
  slice?: number;
  sideOrientation?: SideOrientation;
  frontUVs?: Vector4;
  backUVs?: Vector4;
}
