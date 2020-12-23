import { CanvasObject } from './CanvasObject';

export const image = (name: string) =>
  new CanvasObject(
    async function () {
      const { Image } = await import('@babylonjs/gui/2D/controls/image');
      return new Image(name || `image(${counter++})`, this._url);
    },

    {
      src(url) {
        this._url = url;
        return this;
      },
    }
  );

let counter = 1;
