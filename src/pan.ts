import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture";
import { RenderTargetTexture } from "@babylonjs/core/Materials/Textures/renderTargetTexture";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { ReflectionProbe } from "@babylonjs/core/Probes/reflectionProbe";
import { Scene as BabylonScene } from "@babylonjs/core/scene";

export const box = (size: number | [number, number, number] = 1) =>
  new SceneObject(scene => {
    const mesh = MeshBuilder.CreateBox(
      `box(${JSON.stringify(size)})`,
      {
        ...(typeof size === "number" && { size }),
        ...(Array.isArray(size) && {
          width: size[0],
          height: size[1],
          depth: size[2]
        })
      },
      scene
    );
    mesh.position =
      typeof size === "number"
        ? new Vector3(size / 2, size / 2, size / 2)
        : new Vector3(size[0] / 2, size[1] / 2, size[2] / 2);
    return mesh;
  });

type EventHandler = (event: Event) => SceneObject | void;

interface EventMap {
  tick: Array<EventHandler>;
  click: Array<EventHandler>;
  pointerenter: Array<EventHandler>;
  pointerleave: Array<EventHandler>;
  pointerover: Array<EventHandler>;
  keyup: Array<EventHandler>;
  keydown: Array<EventHandler>;
  keypress: Array<EventHandler>;
}

interface Scene extends BabylonScene {
  initializers: Array<() => void>;
  environmentApplied: boolean;
  lightsApplied: boolean;
  blurredReflectionTexture: BaseTexture;
}

type LazyMesh = (scene: Scene) => Mesh;

/**
 * Scene object with transformations and event handlers.
 */
class SceneObject {
  lazyMesh: LazyMesh;
  operations: Array<(scene: Scene, mesh: Mesh) => Mesh>;
  eventMap: EventMap;

  constructor(lazyMesh: LazyMesh) {
    this.lazyMesh = lazyMesh;
    this.operations = [];
    this.eventMap = {
      tick: [],
      click: [],
      pointerenter: [],
      pointerleave: [],
      pointerover: [],
      keyup: [],
      keydown: [],
      keypress: []
    };
  }

  on(event: keyof EventMap, handler: EventHandler): SceneObject {
    return this;
  }

  env_snapshot(): SceneObject {
    this.operations.push((scene, mesh) => {
      scene.initializers.push(() => {
        const name = `reflection([${mesh.position.toString}]).${mesh.name}`;
        const probe = new ReflectionProbe(name, 256, scene);
        probe.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
        probe.position = mesh.position;
        scene.meshes.forEach(
          sceneMesh => sceneMesh !== mesh && probe.renderList.push(sceneMesh)
        );
        // TODO: do not overwrite all instances of this material
        (mesh.material as PBRMaterial).reflectionTexture = probe.cubeTexture;
      });
      return mesh;
    });

    return this;
  }
}

type SceneCreator = (scene: Scene) => void;

/**
 * Make a scene
 * @param objects Scene objects
 * @returns A function that can be passed to {@linkcode render}
 */
export const scene = (
  ...objects: Array<SceneObject>
): SceneCreator => scene => {};

/**
 * Render scene to canvas
 * @param canvas The canvas to render to, e.g. `document.querySelector('canvas')`
 * @param createScene Scene created by {@linkcode scene}
 */
export const render = (
  canvas: HTMLCanvasElement,
  createScene: SceneCreator
) => {};
