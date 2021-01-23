import { BabylonScene } from '../types';
import { SceneObject } from './SceneObject';

export const empty = () => new EmptySceneObject('empty');

class EmptySceneObject extends SceneObject {
  async createMesh(_options: {}, scene: BabylonScene) {
    const { Mesh } = await import(
      /* webpackChunkName: "mesh" */
      '@babylonjs/core/Meshes/mesh'
    );
    return new Mesh(this._name, scene);
  }
}
