import type { BabylonScene, Scene } from '../types';

export function ground({
  color = [0.6, 0.6, 0.6],
  checkCollisions = true,
}: {
  color?: [number, number, number];
  checkCollisions?: boolean;
} = {}): Scene {
  (this as Scene)._createGround = (scene: BabylonScene) => {
    import('../common').then(({ MeshBuilder, BackgroundMaterial, Color3 }) => {
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
    });
  };
  return this;
}
