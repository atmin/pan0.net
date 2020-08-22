import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Vector3 } from '@babylonjs/core/Maths/math';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';

import { Scene } from './types';

/**
 * Create environment. TODO: Make configurable.
 */
export default () => (scene: Scene) => {
  scene.gravity = new Vector3(...[0, -9.81, 0]);
  scene.collisionsEnabled = true;
  scene.environmentTexture = new CubeTexture('/assets/env/default.env', scene);

  const skyMaterial = new PBRMaterial('sky_material', scene);
  skyMaterial.backFaceCulling = false;
  skyMaterial.reflectionTexture = scene.environmentTexture;
  skyMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyMaterial.disableLighting = true;
  skyMaterial.microSurface = 0.7;
  const sky = MeshBuilder.CreateBox('sky', { size: 1000 }, scene);
  sky.material = skyMaterial;

  scene.environmentApplied = true;
};
