import { scene } from './scene';
import { color } from './color';
import { canvas, image } from './canvas';
import { box, plane, sphere, gltf } from './objects';

for (const [name, func] of [
  ['scene', scene],
  ['canvas', canvas],
  ['image', image],
  ['color', color],
  ['box', box],
  ['plane', plane],
  ['sphere', sphere],
  ['gltf', gltf],
]) {
  (globalThis as any)[name as string] = func;
}
