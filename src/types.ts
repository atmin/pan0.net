import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import type {
  Color4,
  Plane,
  Vector3,
  Vector4,
} from '@babylonjs/core/Maths/math';
import type { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import type { Scene as BabylonScene } from '@babylonjs/core/scene';

export type {
  Mesh,
  Color4,
  Plane,
  Vector3,
  Vector4,
  BabylonScene,
  ShadowGenerator,
};

export type SceneDecorator = (scene: BabylonScene) => void;

export interface Scene {
  _createCamera: SceneDecorator;
  _createEnvironment: SceneDecorator;
  _createLights: SceneDecorator;
  _createGround: SceneDecorator;
  _createSceneObjects: SceneDecorator;
  _eventHandlers: {
    init: Array<() => void>;
  };

  _data: { [key: string]: any };

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

  data(initialData: { [key: string]: any }): Scene;

  onInit(handler: () => any): Scene;

  render(): void;
}

export type CreateMesh = (
  options: object,
  scene: BabylonScene
) => Promise<Mesh>;

export interface SceneObjectOperatorDependencies {
  Mesh: typeof Mesh;
  Vector3: typeof Vector3;
}

export type SceneObjectOperations = Array<
  (mesh: Mesh, dependencies: SceneObjectOperatorDependencies) => Mesh
>;

export enum SideOrientation {
  FRONTSIDE = 0,
  BACKSIDE = 1,
  DOUBLESIDE = 2,
}

type MaterialTexture = Promise<Blob | HTMLCanvasElement>;
type MaterialColor = [number, number, number];

interface StandardMaterialOptions {
  type: 'standard';

  diffuseTexture?: MaterialTexture;
  ambientTexture?: MaterialTexture;
  opacityTexture?: MaterialTexture;
  reflectionTexture?: MaterialTexture;
  emissiveTexture?: MaterialTexture;
  specularTexture?: MaterialTexture;
  bumpTexture?: MaterialTexture;
  lightmapTexture?: MaterialTexture;
  refractionTexture?: MaterialTexture;

  diffuseColor?: MaterialColor;
  ambientColor?: MaterialColor;
  specularColor?: MaterialColor;
  emissiveColor?: MaterialColor;

  specularPower?: number;
  useAlphaFromDiffuseTexture?: boolean;
  useEmissiveAsIllumination?: boolean;
  linkEmissiveWithDiffuse?: boolean;
  // TODO: rest of StandardMaterial props
}

interface PBRMaterialOptions {
  type: 'pbr';
  // TODO: rest PBRMaterial props
}

type MaterialOptions = StandardMaterialOptions | PBRMaterialOptions;

interface SceneObjectBase<T> {
  position: (v: [number, number, number]) => T;
  material: (opts: MaterialOptions) => T;
}
export interface SceneObject extends SceneObjectBase<SceneObject> {
  meshOptions: object;
  materialOptions: MaterialOptions;
  textures: Array<MaterialTexture>;
  operations: SceneObjectOperations;
  createMesh: CreateMesh;
  appendTo(scene: BabylonScene): void;
}

export interface MutableSceneObject extends SceneObjectBase<SceneObject> {
  mesh: AbstractMesh;
  replace: (...objects: SceneObject[]) => void;
  remove: () => void;
}

export interface Canvas {
  size(s: number): Canvas;
}

interface CanvasObjectBase<T> {
  position: (v: [number, number]) => T;
}

export interface CanvasObject extends CanvasObjectBase<CanvasObject> {
  createCanvasObject(): void;
}

export interface LightDefinition {
  type: 'hemispheric' | 'directional';
  position?: [number, number, number];
  direction?: [number, number, number];
  intensity?: number;
  shadowless?: boolean;
}
