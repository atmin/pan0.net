import type { BabylonScene, Scene } from '../types';

/**
 * Create environment. TODO: Make configurable.
 */
export function environment(): Scene {
  (this as Scene)._createEnvironment = async (scene: BabylonScene) => {
    const {
      PBRMaterial,
      CubeTexture,
      Texture,
      Vector3,
      MeshBuilder,
    } = await import('../common');
    scene.gravity = new Vector3(...[0, -9.81, 0]);
    scene.collisionsEnabled = true;
    scene.environmentTexture = new CubeTexture(
      '/assets/env/default.env',
      scene
    );

    const skyMaterial = new PBRMaterial('sky_material', scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.reflectionTexture = scene.environmentTexture;
    skyMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyMaterial.disableLighting = true;
    skyMaterial.microSurface = 0.7;
    const sky = MeshBuilder.CreateBox('sky', { size: 1000 }, scene);
    sky.material = skyMaterial;
  };
  return this;
}
