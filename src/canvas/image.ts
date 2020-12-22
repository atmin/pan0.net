import { Control } from '../types';

export function image(name: string) {
  return async (): Promise<Control> => {
    const { Image } = await import('@babylonjs/gui/2D/controls/image');
    return new Image(
      `image(${counter++})`,
      'https://upload.wikimedia.org/wikipedia/commons/1/13/Calgary_street_map.png'
    );
  };
}

let counter = 1;
