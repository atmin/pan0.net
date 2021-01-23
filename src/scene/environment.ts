import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { BabylonScene, Scene } from '../types';

/**
 * Create environment. TODO: Make configurable.
 */
export function environment(): Scene {
  (this as Scene)._createEnvironment = async (scene: BabylonScene) => {
    const [
      { BoxBuilder },
      { PBRMaterial },
      { CubeTexture },
      { Texture },
    ] = await Promise.all([
      import('@babylonjs/core/Meshes/Builders/boxBuilder'),
      import('@babylonjs/core/Materials/PBR/pbrMaterial'),
      import('@babylonjs/core/Materials/Textures/cubeTexture'),
      import('@babylonjs/core/Materials/Textures/texture'),
    ]);
    scene.gravity = new Vector3(...[0, -9.81, 0]);
    scene.collisionsEnabled = true;
    scene.environmentTexture = new CubeTexture(
      'https://pan0.net/assets/env/default.env',
      scene
    );

    const skyMaterial = new PBRMaterial('sky_material', scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.reflectionTexture = scene.environmentTexture;
    skyMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyMaterial.disableLighting = true;
    skyMaterial.microSurface = 0.8;
    const sky = BoxBuilder.CreateBox('$sky', { size: 1000 }, scene);
    sky.material = skyMaterial;
  };
  return this;
}
