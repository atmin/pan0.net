import { camera } from './camera';
import { environment } from './environment';
import { lights } from './lights';
import { ground } from './ground';
import { Scene, SceneDecorator } from '../types';

export function scene(
  ...objectPromises: Array<
    Promise<{
      appendTo: SceneDecorator;
    }>
  >
): Scene {
  return {
    _createCamera: null,
    _createEnvironment: null,
    _createGround: null,
    _createLights: null,

    _eventHandlers: {
      init: [],
    },

    async _createSceneObjects(scene) {
      const objects = await Promise.all(objectPromises);
      return objects
        .filter((obj) => typeof obj.appendTo === 'function')
        .forEach((obj) => {
          console.log(obj);
          obj.appendTo(scene);
        });
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
  };
}

scene.objects = {
  get(id) {
    console.log('scene.objects.get ' + id);
  },
};

// import camera from './camera';
// import environment from './environment';
// import ground from './ground';
// import lights from './lights';
// import SceneObject from './SceneObject';
// import { Scene, SceneCreator, MutableSceneObject } from './types';

// /**
//  * Create a scene from list of objects
//  * @param objects Scene objects
//  * @returns A scene creator function
//  *
//  * @example
//  * ```
//  * // Reflective red sphere on a light gray box
//  * scene(
//  *   box([3, 1, 3]),
//  *   sphere(1.5)
//  *     .translate([0, 1, 0])
//  *     .albedo_color(COLOR_RED)
//  *     .metallic(1)
//  *     .roughness(0)
//  *     .env_snapshot(0)
//  * )
//  * ```
//  */
// const scene = (...objects: Array<SceneObject | SceneCreator>): SceneCreator => (
//   scene: Scene,
// ) => {
//   objects
//     .filter((o) => o instanceof SceneObject || typeof o === 'function')
//     .flat()
//     .forEach((obj) => {
//       if (obj instanceof SceneObject) {
//         obj.appendTo(scene);
//       } else if (typeof obj === 'function') {
//         (obj as SceneCreator)(scene);
//       }
//     });

//   if (!scene.environmentApplied) {
//     environment()(scene);
//   }

//   if (!scene.lightsApplied) {
//     lights([
//       {
//         type: 'hemispheric',
//         direction: [0.5, 1, 0.5],
//       },
//       {
//         type: 'directional',
//         direction: [0, -1, 0],
//         position: [0, 10, 0],
//       },
//     ])(scene);
//   }

//   if (!scene.getCameraByName('camera')) {
//     camera()(scene);
//   }

//   if (!scene.getMeshByName('ground')) {
//     ground()(scene);
//   }
// };

// scene.objects = {
//   get: (id: string): MutableSceneObject => {
//     return {
//       replace() {},
//       remove() {},

//       translate() {
//         return this;
//       },
//       position() {
//         return this;
//       },
//       rotateX() {
//         return this;
//       },
//       rotateY() {
//         return this;
//       },
//       rotateZ() {
//         return this;
//       },
//       color() {
//         return this;
//       },
//       metallic() {
//         return this;
//       },
//       roughness() {
//         return this;
//       },
//     };
//   },
// };

// export default scene;
