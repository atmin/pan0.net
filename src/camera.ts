import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { Vector3 } from '@babylonjs/core/Maths/math';

import { Scene } from './types';

export default ({
  fov = 1,
  speed = 0.1,
  ellipsoid = [0.8, 0.9, 0.8],
  applyGravity = true,
  checkCollisions = true,
} = {}) => (scene: Scene) => {
  const camera = new UniversalCamera('camera', new Vector3(0, 1.8, -10), scene);
  camera.applyGravity = applyGravity;
  camera.ellipsoid = new Vector3(...ellipsoid);
  camera.setTarget(Vector3.Zero());
  camera.speed = speed;
  camera.fov = fov;
  camera.attachControl(
    scene.getEngine().getRenderingCanvas() as HTMLElement,
    true,
  );
  camera.checkCollisions = checkCollisions;
};
