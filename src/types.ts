import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene as BabylonScene } from '@babylonjs/core/scene';

export { BabylonScene };

export type SceneDecorator = (scene: BabylonScene) => void;

export interface Scene {
  _createCamera: SceneDecorator;
  _createEnvironment: SceneDecorator;
  _createLights: SceneDecorator;
  _createGround: SceneDecorator;
  _createSceneObjects: SceneDecorator;
  _eventHandlers: {
    init: Array<Function>;
  };

  camera(options?: {
    type?: 'fps';
    position?: [number, number, number];
    fov?: number;
    speed?: number;
    ellipsoid?: [number, number, number];
    applyGravity?: boolean;
    checkCollisions?: boolean;
  }): Scene;

  environment(): Scene;

  lights(definitions: null | LightDefinition | Array<LightDefinition>): Scene;

  ground(): Scene;

  onInit(handler: () => any): Scene;

  render(): void;
}

export type CreateMesh = (scene: BabylonScene) => Promise<Mesh>;

export interface SceneObjectOperatorDependencies {
  Mesh: typeof Mesh;
  Vector3: typeof Vector3;
}

export type SceneObjectOperations = Array<
  (mesh: Mesh, dependencies: SceneObjectOperatorDependencies) => Mesh
>;

export interface SceneObject {
  operations: SceneObjectOperations;
  createMesh: CreateMesh;
  appendTo(scene: BabylonScene): void;
  name: (newName: string) => SceneObject;
  position: (v: [number, number, number]) => SceneObject;
}

// import { BaseTexture } from '@babylonjs/core/Materials/Textures/baseTexture';
// import { Mesh } from '@babylonjs/core/Meshes/mesh';
// import { Scene as BabylonScene } from '@babylonjs/core/scene';

// export interface Scene extends BabylonScene {
//   initializers: Array<() => void>;
//   environmentApplied: boolean;
//   lightsApplied: boolean;
//   blurredReflectionTexture: BaseTexture;
// }

// export type SceneCreator = (scene: Scene) => void;

// export type LazyMesh = (scene: Scene) => Mesh;

// interface ISceneObject<T> {
//   position(v: Vec3): T;
//   translate(v: Vec3): T;
//   rotateX(radians: number): T;
//   rotateY(radians: number): T;
//   rotateZ(radians: number): T;
//   color(c: Vec3): T;
//   metallic(value: number): T;
//   roughness(value: number): T;
// }

// export type SceneObject = ISceneObject<SceneObject>;

// export type MutableSceneObject = {
//   replace: (...objects: SceneObject[]) => void;
//   remove: () => void;
// } & ISceneObject<MutableSceneObject>;

// export type EventHandler = (event: Event) => SceneObject | void;

// export interface EventMap {
//   frame: Array<EventHandler>;
//   click: Array<EventHandler>;
//   pointerenter: Array<EventHandler>;
//   pointerleave: Array<EventHandler>;
//   keyup: Array<EventHandler>;
//   keydown: Array<EventHandler>;
//   keypress: Array<EventHandler>;
// }

// export type Vec3 = [number, number, number];

export interface LightDefinition {
  type: 'hemispheric' | 'directional';
  position?: [number, number, number];
  direction?: [number, number, number];
  intensity?: number;
  shadowless?: boolean;
}
