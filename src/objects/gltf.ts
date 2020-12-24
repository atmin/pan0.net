import { BabylonScene } from '../types';
import { SceneObject } from './SceneObject';

export const gltf = () => new GltfSceneObject('gltf');

class GltfSceneObject extends SceneObject {
  async createMesh(options: GltfOptions, scene: BabylonScene) {
    const [_, { SceneLoader }, { Vector3 }] = await Promise.all([
      import('@babylonjs/loaders/glTF/2.0/glTFLoader'),
      import('@babylonjs/core/Loading/sceneLoader'),
      import('@babylonjs/core/Maths/math.vector'),
    ]);
    const parsed = new URL(options.source);
    const pathnameArray = parsed.pathname.split('/');
    const filename = pathnameArray.pop();
    const pathname = pathnameArray.join('/');
    return SceneLoader.ImportMeshAsync(
      '',
      parsed.origin + pathname + '/',
      filename,
      scene
    ).then((result) => result.meshes);
  }

  source(url: string) {
    (this._createMeshOptions as GltfOptions).source = url;
    return this;
  }
}

interface GltfOptions {
  source: string;
}
