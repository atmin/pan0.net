import { scene } from './scene';
import { canvas } from './canvas';
import { box } from './objects/box';
import { color } from './color';

(globalThis as any).scene = scene;
(globalThis as any).canvas = canvas;
(globalThis as any).box = box;
(globalThis as any).color = color;
