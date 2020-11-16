import scene from './scene';
export * as box from './box';
export * as sphere from './sphere';

interface Global extends Window {
  scene: any;
}
((globalThis as unknown) as Global).scene = scene;
