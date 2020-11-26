import { camera } from './camera';
import { environment } from './environment';
import { lights } from './lights';
import { ground } from './ground';

import type {
  BabylonScene,
  Scene,
  SceneObject,
  MutableSceneObject,
} from '../types';

export const scene = (...objects: Array<SceneObject>): Scene => ({
  _createCamera: null,
  _createEnvironment: null,
  _createGround: null,
  _createLights: null,

  _eventHandlers: {
    init: [],
  },

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

    if (mesh === null) {
      return null;
    }

    return {
      mesh,

      position(v) {
        return this;
      },
      replace(...objects) {},
      remove() {},
    };
  },
};
