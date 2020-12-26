import type { Scene } from '../types';

export function camera({
  type = 'fps',
  position = [0, 1.8, -10],
  fov = 1,
  speed = 0.25,
  angularSensibility = 2000,
  touchAngularSensibility = 2000,
  ellipsoid = [0.8, 0.9, 0.8],
  minZ = 0.5,
  maxZ = 10000,
  applyGravity = true,
  checkCollisions = true,
} = {}): Scene {
  switch (type) {
    case 'fps': {
      (this as Scene)._createCamera = async (scene) => {
        const [{ UniversalCamera }, { Vector3 }] = await Promise.all([
          import('@babylonjs/core/Cameras/universalCamera'),
          import('@babylonjs/core/Maths/math.vector'),
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
        camera.angularSensibility = angularSensibility;
        camera.touchAngularSensibility = touchAngularSensibility;
        camera.fov = fov;
        camera.minZ = minZ;
        camera.maxZ = maxZ;
        camera.attachControl(
          scene.getEngine().getRenderingCanvas() as HTMLElement,
          true
        );
        camera.checkCollisions = checkCollisions;
        // WASD controls
        camera.keysUp.push(87);
        camera.keysDown.push(83);
        camera.keysLeft.push(65);
        camera.keysRight.push(68);
      };

      break;
    }
  }
  return this;
}
