import type {
  Color4,
  Plane,
  Vector3,
  Vector4,
} from '@babylonjs/core/Maths/math';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import type { ActionEvent } from '@babylonjs/core/Actions/actionEvent';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { Material } from '@babylonjs/core/Materials/material';
import type { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import type { Scene as BabylonScene } from '@babylonjs/core/scene';
import type { Control } from '@babylonjs/gui/2D/controls/control';
import type { Texture } from '@babylonjs/core/Materials/Textures/texture';
import type { PointerInfo } from '@babylonjs/core/Events/pointerEvents';

export type {
  AbstractMesh,
  ActionEvent,
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
    frame: Array<() => void>;
    pointerdown: Array<(pointerInfo: PointerInfo) => void>;
    pointerup: Array<(pointerInfo: PointerInfo) => void>;
    pointermove: Array<(pointerInfo: PointerInfo) => void>;
    pointerwheel: Array<(pointerInfo: PointerInfo) => void>;
    pointerpick: Array<(pointerInfo: PointerInfo) => void>;
    pointertap: Array<(pointerInfo: PointerInfo) => void>;
    pointerdoubletap: Array<(pointerInfo: PointerInfo) => void>;
  };
  _showInspector: boolean;

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

  on(event: keyof Scene['_eventHandlers'], handler: () => any): Scene;

  inspect(): Scene;

  render(): void;
}

// https://doc.babylonjs.com/divingDeeper/events/actions#triggers
export const SceneObjectEvents = [
  'pick',
  'doublepick',
  'pickdown',
  'pickup',
  'pickout',
  'leftpick',
  'rightpick',
  'centerpick',
  'longpress',
  'pointerenter',
  'pointerleave',
] as const;

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

export interface PBRMaterialOptions {
  type: 'pbr';
  reflectionTexture?: MaterialTexture;
  metallic: number;
  roughness: number;
  // TODO: rest PBRMaterial props
}

export type MaterialOptions = StandardMaterialOptions | PBRMaterialOptions;

interface SceneObjectBase<T> {
  position: (
    v?: [number, number, number]
  ) => typeof v extends undefined ? [number, number, number] : T;
  scaling: (
    v?: [number, number, number]
  ) => typeof v extends undefined ? [number, number, number] : T;
  rotation: (
    v?: [number, number, number]
  ) => typeof v extends undefined ? [number, number, number] : T;
  material: (opts: MaterialOptions) => T;
}
export interface SceneObject extends SceneObjectBase<SceneObject> {
  createMesh: CreateMesh;
  appendTo(scene: BabylonScene): Promise<Mesh>;
}

export interface MutableSceneObject
  extends SceneObjectBase<MutableSceneObject> {
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
