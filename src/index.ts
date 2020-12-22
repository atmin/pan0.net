import { scene } from './scene';
import { canvas } from './canvas';
import { image } from './canvas/image';
import { color } from './color';
import { box } from './objects/box';
import { plane } from './objects/plane';

(globalThis as any).scene = scene;
(globalThis as any).canvas = canvas;
(globalThis as any).image = image;
(globalThis as any).color = color;
(globalThis as any).box = box;
(globalThis as any).plane = plane;
