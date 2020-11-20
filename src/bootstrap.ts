import type { Scene as BabylonScene } from '@babylonjs/core/scene';

interface Scene {
  _createCamera: ((scene: BabylonScene) => void) | null;
  _createSceneObjects(scene: BabylonScene): void;

  camera(options: {
    type?: 'fps';
    position?: [number, number, number];
    fov?: number;
    speed?: number;
    ellipsoid?: [number, number, number];
    applyGravity?: boolean;
    checkCollisions?: boolean;
  }): void;
  render(): void;
}

(globalThis as any).scene = (
  ...objectPromises: Array<
    Promise<{
      appendTo(scene: BabylonScene): void;
    }>
  >
): Scene => ({
  _createCamera: null,

  async _createSceneObjects(scene) {
    const objects = await Promise.all(objectPromises);
    return objects
      .filter((obj) => typeof obj.appendTo === 'function')
      .forEach((obj) => obj.appendTo(scene));
  },

  camera({
    type = 'fps',
    position = [0, 1.8, -10],
    fov = 1,
    speed = 0.1,
    ellipsoid = [0.8, 0.9, 0.8],
    applyGravity = true,
    checkCollisions = true,
  } = {}) {
    switch (type) {
      case 'fps': {
        this._createCamera = async (scene: BabylonScene) => {
          const [{ UniversalCamera }, { Vector3 }] = await Promise.all([
            import('@babylonjs/core/Cameras/universalCamera'),
            import('@babylonjs/core/Maths/math'),
          ]);

          const camera = new UniversalCamera(
            'camera',
            new Vector3(...position),
            scene
          );
          camera.applyGravity = applyGravity;
          camera.ellipsoid = new Vector3(...ellipsoid);
          camera.setTarget(Vector3.Zero());
          camera.speed = speed;
          camera.fov = fov;
          camera.attachControl(
            scene.getEngine().getRenderingCanvas() as HTMLElement,
            true
          );
          camera.checkCollisions = checkCollisions;
        };

        break;
      }
    }
  },

  async render() {
    const [{ Engine }, { Scene }] = await Promise.all([
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

    const engine = new Engine(canvas);
    const scene = new Scene(engine);

    await this._createSceneObjects(scene);
    if (!this._createCamera) {
      this.camera();
    }
    await this._createCamera(scene);

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => {
      engine.resize();
    });
  },
});
