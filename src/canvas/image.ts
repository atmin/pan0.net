import canvasBundle from '../bundles/canvas';
import { CanvasObject } from './CanvasObject';

export const image = (name?: string) => new ImageCanvasObject('image', name);
class ImageCanvasObject extends CanvasObject {
  async createControl({ url }) {
    const { Image } = await canvasBundle();
    return new Image(this._name, url);
  }

  source(url) {
    (this._createControlOptions as ImageOptions).url = url;
    return this;
  }
}

interface ImageOptions {
  url: string;
}
