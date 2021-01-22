import groundBuilderBundle from '../bundles/groundBuilder';
import materialsBundle from '../bundles/materials';
import type { BabylonScene, Scene } from '../common/types';

export function ground({
  color = [0.6, 0.6, 0.6],
  checkCollisions = true,
  visible = true,
}: {
  color?: [number, number, number];
  checkCollisions?: boolean;
  visible?: boolean;
} = {}): Scene {
  (this as Scene)._createGround = async (scene: BabylonScene) => {
    const [
      { GroundBuilder },
      { BackgroundMaterial, Color3 },
    ] = await Promise.all([groundBuilderBundle(), materialsBundle()]);
    const ground = GroundBuilder.CreateGround(
      '$ground',
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
    ground.visibility = visible ? 1 : 0;
    return ground;
  };
  return this;
}
