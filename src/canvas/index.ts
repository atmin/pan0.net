import type { AbstractMesh, Canvas, Control, Texture } from '../types';

export const canvas = (...controls: Array<() => Control>): Canvas => ({
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

    for (let control of controls) {
      texture.addControl(await control());
    }
    // texture.addControl(
    //   new Image(
    //     'image',
    //     'https://upload.wikimedia.org/wikipedia/commons/1/13/Calgary_street_map.png'
    //   )
    // );

    return texture;
  },
});

let counter = 1;
