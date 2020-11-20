import type { Camera } from '@babylonjs/core/Cameras/camera';
import type { Scene as BabylonScene } from '@babylonjs/core/scene';

interface ISceneObject {
  appendTo(scene: BabylonScene): void;
}

interface Scene {
  _camera: Camera | null;
  _createSceneObjects(scene: BabylonScene): void;
  render(): void;
}

(globalThis as any).scene = (
  ...objectPromises: Array<Promise<ISceneObject>>
): Scene => ({
  _camera: null,

  async _createSceneObjects(scene) {
    const objects = await Promise.all(objectPromises);
    return objects
      .filter((obj) => typeof obj.appendTo === 'function')
      .forEach((obj) => obj.appendTo(scene));
  },

  async render() {
    const [engineModule, sceneModule] = await Promise.all([
      import('@babylonjs/core/Engines/engine'),
      import('@babylonjs/core/scene'),
    ]);

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    document.body.append(canvas);

    const engine = new engineModule.Engine(canvas);
    const scene = new sceneModule.Scene(engine);

    await this._createSceneObjects(scene);

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => {
      engine.resize();
    });
  },
});
