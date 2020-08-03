import box from './box';
import render from './render';
import scene from './scene';

render(
  document.querySelector('canvas') as HTMLCanvasElement,
  scene(box().translate([0, 0.5, 0])),
);
