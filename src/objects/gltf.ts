import { BabylonScene, Mesh } from '../types';
import { SceneObject } from './SceneObject';

export const gltf = () => new GltfSceneObject('gltf');

class GltfSceneObject extends SceneObject {
  async createMesh(options: GltfOptions, scene: BabylonScene) {
    const [_sideEffect, { SceneLoader }, { Mesh }] = await Promise.all([
      import('@babylonjs/loaders/glTF/2.0/glTFLoader'),
      import('@babylonjs/core/Loading/sceneLoader'),
      import('@babylonjs/core/Meshes/mesh'),
    ]);
    const parsed = new URL(options.source);
    const pathnameArray = parsed.pathname.split('/');
    const filename = pathnameArray.pop();
    const pathname = pathnameArray.join('/');

    const mesh = new Mesh(this._name, scene);

    SceneLoader.ImportMeshAsync(
      '',
      parsed.origin + pathname + '/',
      filename,
      scene
    ).then((result) => {
      for (let gltfMesh of result.meshes) {
        mesh.addChild(gltfMesh);
      }
    });

    return mesh;
  }

  source(url: string) {
    (this._createMeshOptions as GltfOptions).source = url;
    return this;
  }
}

interface GltfOptions {
  source: string;
}
