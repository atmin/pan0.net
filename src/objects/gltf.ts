import commonBundle from '../bundles/common';
import gltfLoaderBundle from '../bundles/gltfLoader';
import { BabylonScene, Mesh } from '../common/types';
import { SceneObject } from './SceneObject';

export const gltf = () => new GltfSceneObject('gltf');

class GltfSceneObject extends SceneObject {
  async createMesh(options: GltfOptions, scene: BabylonScene) {
    const [{ SceneLoader }, { Mesh }] = await Promise.all([
      gltfLoaderBundle(),
      commonBundle(),
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
