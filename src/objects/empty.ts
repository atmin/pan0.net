import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { BabylonScene } from '../types';
import { SceneObject } from './SceneObject';

export const empty = () => new EmptySceneObject('empty');

class EmptySceneObject extends SceneObject {
  async createMesh(_options: {}, scene: BabylonScene) {
    return Promise.resolve(new Mesh(this._name, scene));
  }
}
