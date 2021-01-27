import { Vector3 } from '@babylonjs/core/Maths/math.vector';
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
  Mesh,
} from '../types';

export const scene = (...objects: Array<SceneObject>): Scene => ({
  _createCamera: null,
  _createEnvironment: null,
  _createGround: null,
  _createLights: null,

  _eventHandlers: {
    init: [],
    frame: [],
    pointerdown: [],
    pointerup: [],
    pointermove: [],
    pointerwheel: [],
    pointerpick: [],
    pointertap: [],
    pointerdoubletap: [],
  },
  _enableDebug: true,
  _enableEditor: true,

  _createSceneObjects(scene): Promise<Array<Mesh>> {
    return Promise.all(
      objects
        .filter((obj) => typeof obj.appendTo === 'function')
        .map((obj) => obj.appendTo(scene))
    );
  },

  camera,
  environment,
  lights,
  ground,

  on(event, handler) {
    if (!(event in this._eventHandlers)) {
      console.error(
        `scene(...).on(event, handler): Event must be one of ${Object.keys(
          this._eventHandlers
        ).join(', ')}`
      );
    } else {
      this._eventHandlers[event].push(handler);
    }
    return this;
  },

  disableDebug() {
    this._enableDebug = false;
    return this;
  },

  disableEdit() {
    this._enableEditor = false;
    return this;
  },

  async renderTo(canvas) {
    const { renderTo } = await import(
      /* webpackChunkName: "render" */
      './render'
    );
    return renderTo.call(this, canvas);
  },

  async render() {
    const { render } = await import(
      /* webpackChunkName: "render" */
      './render'
    );
    render.call(this);
  },
});

scene.objects = {
  get(name: string): MutableSceneObject | null {
    const scene = (window as any)._scene as BabylonScene;
    const mesh = scene.getMeshByName(name);
    return mesh === null ? null : createMutableSceneObject(mesh as Mesh);
  },

  all(): Array<MutableSceneObject> {
    const scene = (window as any)._scene as BabylonScene;
    return scene.meshes.map(createMutableSceneObject);
  },
};

const createMutableSceneObject = (mesh: Mesh): MutableSceneObject => ({
  mesh,
  name: mesh.name,

  position(v) {
    if (!v) {
      const { x, y, z } = mesh.position;
      return [x, y, z];
    }

    mesh.position = new Vector3(...v);
    return this;
  },

  scaling(v) {
    if (!v) {
      const { x, y, z } = mesh.scaling;
      return [x, y, z];
    }

    mesh.scaling = new Vector3(...v);
    return this;
  },

  rotation(v) {
    if (!v) {
      const { x, y, z } = mesh.rotation;
      return [x, y, z];
    }

    mesh.rotation = new Vector3(...v);
    return this;
  },

  material() {
    return this;
  },

  replace(...objects) {},
  remove() {},
});
