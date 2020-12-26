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
    return SceneLoader.ImportMeshAsync(
      '',
      parsed.origin + pathname + '/',
      filename,
      scene
    ).then((result) => {
      const mesh = Mesh.MergeMeshes(
        (result.meshes as Array<Mesh>).filter(
          (mesh) => mesh.name !== '__root__'
        ),
        true,
        false,
        null,
        false,
        true
      );
      (result.meshes as Array<Mesh>)
        .find((mesh) => mesh.name === '__root__')
        .dispose();
      mesh.name = this._name;
      return mesh;
    });
  }

  source(url: string) {
    (this._createMeshOptions as GltfOptions).source = url;
    return this;
  }
}

interface GltfOptions {
  source: string;
}
