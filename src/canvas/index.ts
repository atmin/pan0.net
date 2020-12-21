import type { BabylonScene, Texture } from '../types';

export const canvas = (...objects) => async (
  scene: BabylonScene
): Promise<Texture> => {
  const { DynamicTexture } = await import(
    '@babylonjs/core/Materials/Textures/dynamicTexture'
  );
  const texture = new DynamicTexture(`canvas(${counter++})`, 512, scene, false);
  texture.drawText('AAAA', 100, 100, 'bold 60px Arial', 'green', 'white');
  return texture;
};

let counter = 1;
