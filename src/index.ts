import { scene } from './scene';
import { color } from './color';
import { canvas, image } from './canvas';
import { box, plane, sphere, gltf } from './objects';

for (let func of [scene, canvas, image, color, box, plane, sphere, gltf]) {
  (globalThis as any)[func.name] = func;
}
