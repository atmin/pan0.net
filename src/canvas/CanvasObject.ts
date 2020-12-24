import type { Control, CreateControl } from '../types';

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
  _createControl: CreateControl;
  _operations: Array<(control: Control) => void>;

  constructor(
    createControl: CreateControl,
    properties?: { [key: string]: (...args: any) => void }
  ) {
    this._createControl = createControl;
    this._operations = [];

    for (let prop of PROPERTIES) {
      this[prop] = (arg: any) => {
        this._operations.push((control: Control) => (control[prop] = arg));
        return this;
      };
    }

    for (let prop of Object.keys(properties || {})) {
      this[prop] = properties[prop].bind(this);
    }
  }

  async createControl(): Promise<Control> {
    const control = await this._createControl();
    for (let operation of this._operations) {
      operation(control);
    }
    return control;
  }
}
