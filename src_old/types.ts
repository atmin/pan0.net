import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene as BabylonScene } from "@babylonjs/core/scene";
import { BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture";

export type PanScene = BabylonScene & {
  initializers: Array<(scene: PanScene) => void>;
  environmentApplied: boolean;
  lightsApplied: boolean;
  blurredReflectionTexture: BaseTexture;
};

export type PanStatement = (scene: PanScene) => void;

export type PanObject = (scene: PanScene) => Mesh;

export type PanOperator = (scene: PanScene, mesh: Mesh) => Mesh;

export type FlatPanObjects = Array<PanObject>;
export type PanObjects = FlatPanObjects | Array<FlatPanObjects>;

export type PanVector3 = [number, number, number];
