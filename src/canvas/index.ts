import { DynamicTexture } from '../common';
import { BabylonScene } from '../types';

export const canvas = (...objects) => (scene: BabylonScene) => {
  const texture = new DynamicTexture(`canvas(${counter++})`, 512, scene, false);
  texture.drawText('AAAA', 100, 100, 'bold 60px Arial', 'green', 'white');
  return texture;
};

let counter = 1;
