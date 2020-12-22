import type { BabylonScene, Canvas, CanvasObject, Texture } from '../types';

export const canvas = (...objects: Array<CanvasObject>): Canvas => ({
  _size: 512,

  size(s: number) {
    this._size = s;
    return this;
  },

  async createMaterial(scene: BabylonScene): Promise<Texture> {
    const { AdvancedDynamicTexture } = await import(
      '@babylonjs/gui/2D/advancedDynamicTexture'
    );
    const texture = new AdvancedDynamicTexture(
      `canvas(${counter++})`,
      this._size,
      scene,
      false
    );

    for (let obj of objects) {
      const [x, y] = obj._position
        ? [obj._position[0] * this._size, obj._position[1] * this._size]
        : [0, 0];

      switch (obj._op) {
        case 'text':
          texture.drawText(
            obj._text || '',
            x,
            y,
            'bold 60px Arial',
            'green',
            'black'
          );
          break;
        default:
          break;
      }
    }

    return texture;
  },
});

let counter = 1;
