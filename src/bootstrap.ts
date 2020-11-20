import { camera } from './camera';
import { environment } from './environment';
import { Scene, SceneDecorator } from './types';

(globalThis as any).scene = (
  ...objectPromises: Array<
    Promise<{
      appendTo: SceneDecorator;
    }>
  >
): Scene => ({
  _createCamera: null,
  _createEnvironment: null,
  _createGround: null,
  _createLights: null,

  async _createSceneObjects(scene) {
    const objects = await Promise.all(objectPromises);
    return objects
      .filter((obj) => typeof obj.appendTo === 'function')
      .forEach((obj) => obj.appendTo(scene));
  },

  camera,
  environment,
  lights() {
    // TODO
    return this;
  },
  ground() {
    // TODO
    return this;
  },

  async render() {
    const { render } = await import('./render');
    render.call(this);
  },
});
