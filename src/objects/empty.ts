import commonBundle from '../bundles/common';
import { BabylonScene } from '../common/types';
import { SceneObject } from './SceneObject';

export const empty = () => new EmptySceneObject('empty');

class EmptySceneObject extends SceneObject {
  async createMesh(_options: {}, scene: BabylonScene) {
    const { Mesh } = await commonBundle();
    return new Mesh(this._name, scene);
  }
}
