import { camera } from './camera';
import { environment } from './environment';
import { lights } from './lights';
import { ground } from './ground';

import type {
  BabylonScene,
  Scene,
  SceneObject,
  MutableSceneObject,
  AbstractMesh,
} from '../types';

export const scene = (...objects: Array<SceneObject>): Scene => ({
  _createCamera: null,
  _createEnvironment: null,
  _createGround: null,
  _createLights: null,

  _eventHandlers: {
    init: [],
  },
  _data: {},

  async _createSceneObjects(scene) {
    await Promise.all(
      objects
        .filter((obj) => typeof obj.appendTo === 'function')
        .map((obj) => obj.appendTo(scene))
    );
  },

  camera,
  environment,
  lights,
  ground,

  data(initialData) {
    this._data = initialData;
    return this;
  },

  onInit(handler) {
    this._eventHandlers.init.push(handler);
    return this;
  },

  async render() {
    const { render } = await import(
      /* webpackChunkName: "render" */ './render'
    );
    render.call(this);
  },
});

scene.objects = {
  get(name: string): MutableSceneObject | null {
    const scene = (window as any)._scene as BabylonScene;
    const mesh = scene.getMeshByName(name);
    return mesh === null ? null : createMutableSceneObject(mesh);
  },

  all(): Array<MutableSceneObject> {
    const scene = (window as any)._scene as BabylonScene;
    return scene.meshes.map(createMutableSceneObject);
  },
};

scene.data = {
  get(key: string): any {
    const data = (window as any)._sceneData;
    return data[key];
  },
  set(key: string, value: any): void {
    const data = (window as any)._sceneData;
    data[key] = value;
  },
};

const createMutableSceneObject = (mesh: AbstractMesh): MutableSceneObject => ({
  name: mesh.name,

  position(v) {
    if (!v) {
      const { x, y, z } = mesh.position;
      return [x, y, z];
    }

    import('@babylonjs/core/Maths/math.vector').then(({ Vector3 }) => {
      mesh.position = new Vector3(...v);
    });
    return this;
  },

  // TODO: implement rest

  material() {
    return this;
  },

  replace(...objects) {},
  remove() {},
});
