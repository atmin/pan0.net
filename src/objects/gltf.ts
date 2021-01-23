import { BabylonScene, Mesh } from '../types';
import { SceneObject } from './SceneObject';

export const gltf = () => new GltfSceneObject('gltf');

class GltfSceneObject extends SceneObject {
  async createMesh(options: GltfOptions, scene: BabylonScene) {
    const [_sideEffect, { SceneLoader }, { Mesh }] = await Promise.all([
      import(
        /* webpackChunkName: "glTFLoader" */
        '@babylonjs/loaders/glTF/2.0/glTFLoader'
      ),
      import(
        /* webpackChunkName: "sceneLoader" */
        '@babylonjs/core/Loading/sceneLoader'
      ),
      import(
        /* webpackChunkName: "mesh" */
        '@babylonjs/core/Meshes/mesh'
      ),
    ]);
    const { source, receiveShadows, checkCollisions } = options;
    const parsed = new URL(source);
    const pathnameArray = parsed.pathname.split('/');
    const filename = pathnameArray.pop();
    const pathname = pathnameArray.join('/');

    const mesh = new Mesh(this._name, scene);

    await SceneLoader.ImportMeshAsync(
      '',
      parsed.origin + pathname + '/',
      filename,
      scene
    ).then((result) => {
      for (let gltfMesh of result.meshes) {
        gltfMesh.setParent(mesh);
      }
    });

    return mesh;
  }

  source(url: string) {
    (this._createMeshOptions as GltfOptions).source = url;
    return this;
  }

  checkCollisions(b: boolean | ((mesh: Mesh) => boolean) = true) {
    (this._createMeshOptions as GltfOptions).checkCollisions = b;
    return this;
  }
}

interface GltfOptions {
  source: string;
  receiveShadows?: boolean | ((mesh: Mesh) => boolean);
  checkCollisions?: boolean | ((mesh: Mesh) => boolean);
}
