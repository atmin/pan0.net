import type {
  Color4,
  Plane,
  Vector3,
  Vector4,
} from '@babylonjs/core/Maths/math';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { CSG } from '@babylonjs/core/Meshes/csg';
import type { Material } from '@babylonjs/core/Materials/material';
import type { MultiMaterial } from '@babylonjs/core/Materials/multiMaterial';
import type { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import type { Scene as BabylonScene } from '@babylonjs/core/scene';
import type { Control } from '@babylonjs/gui/2D/controls/control';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';

export type {
  AbstractMesh,
  Mesh,
  Material,
  Color4,
  Plane,
  Vector3,
  Vector4,
  BabylonScene,
  ShadowGenerator,
  Texture,
  Control,
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

export type CreateControl = () => Promise<Control>;

export enum SideOrientation {
  FRONTSIDE = 0,
  BACKSIDE = 1,
  DOUBLESIDE = 2,
}

export enum RefreshRate {
  RENDER_ONCE = 0,
  RENDER_ONEVERYFRAME = 1,
  RENDER_ONEVERYTWOFRAMES = 2,
}

type MaterialTexture = string | Promise<HTMLCanvasElement>;
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
  reflectionTexture?: MaterialTexture;
  // TODO: rest PBRMaterial props
}

export type MaterialOptions = StandardMaterialOptions | PBRMaterialOptions;

interface SceneObjectBase<T> {
  position: (
    v?: [number, number, number]
  ) => typeof v extends undefined ? [number, number, number] : T;
  material: (opts: MaterialOptions) => T;
}
export interface SceneObject extends SceneObjectBase<SceneObject> {
  meshOptions: object;
  materialOptions: MaterialOptions;
  textures: { [key: string]: MaterialTexture };
  operations: SceneObjectOperations;
  createMesh: CreateMesh;
  appendTo(scene: BabylonScene): void;
}

export interface MutableSceneObject extends SceneObjectBase<SceneObject> {
  readonly name: string;
  replace: (...objects: SceneObject[]) => void;
  remove: () => void;
}

export interface Canvas {
  _width: number | null;
  _height: number | null;
  _size: number;
  size(s: number): Canvas;
  width(w: number): Canvas;
  height(h: number): Canvas;
  createTexture(mesh: AbstractMesh): Promise<Texture>;
}

interface CanvasObjectBase<T> {
  position?: (v: [number, number]) => T;
  rotation?: (angle: number) => T;
  scale?: (s: number) => T;
}

export interface CanvasObject extends CanvasObjectBase<CanvasObject> {
  _op: 'text' | 'image' | 'circle' | 'rect';
  _text?: string;
  _width?: number;
  _height?: number;
  _position?: [number, number];
  _rotation?: number;
  _scale?: number;
}

export interface MutableCanvasObject
  extends CanvasObjectBase<MutableCanvasObject> {
  replace: (...objects: CanvasObject[]) => void;
  remove: () => void;
}
export interface LightDefinition {
  type: 'hemispheric' | 'directional';
  position?: [number, number, number];
  direction?: [number, number, number];
  intensity?: number;
  shadowless?: boolean;
}
