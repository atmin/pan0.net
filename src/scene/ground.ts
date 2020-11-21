import '@babylonjs/core/Materials/standardMaterial';
import { BackgroundMaterial } from '@babylonjs/core/Materials/Background';
import { Color3 } from '@babylonjs/core/Maths/math';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Scene as BabylonScene } from '@babylonjs/core/scene';

import { Scene } from '../types';

export function ground({
  color = [0.6, 0.6, 0.6],
  checkCollisions = true,
}: {
  color?: [number, number, number];
  checkCollisions?: boolean;
} = {}): Scene {
  (this as Scene)._createGround = (scene: BabylonScene) => {
    const ground = MeshBuilder.CreateGround(
      'ground',
      {
        width: 100,
        height: 100,
        subdivisions: 10,
      },
      scene
    );
    const groundMaterial = new BackgroundMaterial('groundmat', scene);
    groundMaterial.shadowLevel = 0.4;
    groundMaterial.useRGBColor = false;
    groundMaterial.primaryColor = new Color3(...color);
    ground.material = groundMaterial;
    ground.checkCollisions = checkCollisions;
    ground.receiveShadows = true;
    return ground;
  };
  return this;
}
