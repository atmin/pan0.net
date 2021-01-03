import type { Canvas, Control } from '../types';

// https://doc.babylonjs.com/divingDeeper/gui/gui#position-and-size
const PROPERTIES = [
  'left',
  'top',
  'width',
  'height',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
] as const;

export class CanvasObject {
  static _counters = {};

  _name: string;
  _createControlOptions: object;
  _operations: Array<(control: Control) => void>;

  constructor(className: string, name?: string) {
    if (name) {
      this._name = name;
    } else {
      const counter = CanvasObject._counters[className] || 1;
      this._name = `${className}(${counter})`;
      CanvasObject._counters[className] = counter + 1;
    }
    this._createControlOptions = {};
    this._operations = [];

    for (let prop of PROPERTIES) {
      this[prop] = (arg: any) => {
        this._operations.push((control: Control) => (control[prop] = arg));
        return this;
      };
    }
  }

  async createControl(options: object): Promise<Control> {
    throw new Error('CanvasObject descendants must override createControl');
  }

  async appendTo(texture: any) {
    const control = await this.createControl(this._createControlOptions);
    for (let operation of this._operations) {
      operation(control);
    }
    texture.addControl(control);
  }
}
