import { BaseTexture } from '@babylonjs/core/Materials/Textures/baseTexture';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Scene as BabylonScene } from '@babylonjs/core/scene';

export interface Scene extends BabylonScene {
  initializers: Array<() => void>;
  environmentApplied: boolean;
  lightsApplied: boolean;
  blurredReflectionTexture: BaseTexture;
}

export type SceneCreator = (scene: Scene) => void;

export type LazyMesh = (scene: Scene) => Mesh;

export interface SceneObject {
  on(event: keyof EventMap, handler: EventHandler): SceneObject;
  translate(v: Vec3): SceneObject;
  color(c: Vec3): SceneObject;
  env_snapshot(): SceneObject;
}

export type EventHandler = (event: Event) => SceneObject | void;

export interface EventMap {
  tick: Array<EventHandler>;
  click: Array<EventHandler>;
  pointerenter: Array<EventHandler>;
  pointerleave: Array<EventHandler>;
  pointerover: Array<EventHandler>;
  keyup: Array<EventHandler>;
  keydown: Array<EventHandler>;
  keypress: Array<EventHandler>;
}

export type Vec3 = [number, number, number];

export interface LightDefinition {
  type: 'hemispheric' | 'directional';
  position?: Vec3;
  direction?: Vec3;
  intensity?: number;
  shadowless?: boolean;
}
