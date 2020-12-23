import { CanvasObject } from './CanvasObject';
import type { AbstractMesh, Canvas, Control, Texture } from '../types';

export const canvas = (...objects: Array<CanvasObject>): Canvas => ({
  _width: null,
  _height: null,
  _size: 512,

  size(s: number) {
    this._size = s;
    return this;
  },

  width(w: number) {
    this._width = w;
    return this;
  },

  height(h: number) {
    this._height = h;
    return this;
  },

  async createTexture(mesh: AbstractMesh): Promise<Texture> {
    const [{ AdvancedDynamicTexture }, { Image }] = await Promise.all([
      import('@babylonjs/gui/2D/advancedDynamicTexture'),
      import('@babylonjs/gui/2D/controls/image'),
    ]);
    const texture = AdvancedDynamicTexture.CreateForMeshTexture(
      mesh,
      this._width || this._size,
      this._height || this._size
    );

    for (let obj of objects) {
      texture.addControl(await obj.createControl());
    }

    return texture;
  },
});

let counter = 1;
