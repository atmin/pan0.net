import { scene } from './scene';
import { color } from './color';
import { canvas, image } from './canvas';
import { empty, box, plane, sphere, gltf } from './objects';

for (const [name, func] of [
  ['scene', scene],
  ['canvas', canvas],
  ['image', image],
  ['color', color],
  ['empty', empty],
  ['box', box],
  ['plane', plane],
  ['sphere', sphere],
  ['gltf', gltf],
]) {
  (globalThis as any)[name as string] = func;
}
