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
    frame: [],
    pointerdown: [],
    pointerup: [],
    pointermove: [],
    pointerwheel: [],
    pointerpick: [],
    pointertap: [],
    pointerdoubletap: [],
  },
  _showInspector: false,

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

  inspect() {
    this._showInspector = true;
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

  scaling(v) {
    if (!v) {
      const { x, y, z } = mesh.scaling;
      return [x, y, z];
    }

    import('@babylonjs/core/Maths/math.vector').then(({ Vector3 }) => {
      mesh.scaling = new Vector3(...v);
    });
    return this;
  },

  rotation(v) {
    if (!v) {
      const { x, y, z } = mesh.rotation;
      return [x, y, z];
    }

    import('@babylonjs/core/Maths/math.vector').then(({ Vector3 }) => {
      mesh.rotation = new Vector3(...v);
    });
    return this;
  },

  material() {
    return this;
  },

  replace(...objects) {},
  remove() {},
});
