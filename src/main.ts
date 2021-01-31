import { scene } from './scene';
import { color } from './misc/color';
import { canvas, image } from './canvas';
import { empty, box, plane, sphere, gltf } from './objects';

Object.assign(globalThis, {
  scene,
  canvas,
  image,
  color,
  empty,
  box,
  plane,
  sphere,
  gltf,
});
