import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { RenderTargetTexture } from '@babylonjs/core/Materials/Textures/renderTargetTexture';
import { Color3, Vector3 } from '@babylonjs/core/Maths/math';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { ReflectionProbe } from '@babylonjs/core/Probes/reflectionProbe';

import {
  EventHandler,
  EventMap,
  SceneObject as ISceneObject,
  LazyMesh,
  Scene,
  Vec3,
} from './types';

/**
 * Scene object with transformations and event handlers.
 */
export default class SceneObject implements ISceneObject {
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
      keypress: [],
    };
  }

  /** @internal */
  appendTo(scene: Scene) {
    const mesh = this.operations.reduce(
      (result, operation) => operation(scene, result),
      this.lazyMesh(scene),
    );
    if (!mesh.material) {
      mesh.material = scene.defaultMaterial;
    }
    mesh.receiveShadows = true;
    mesh.checkCollisions = true;
  }

  on(event: keyof EventMap, handler: EventHandler): SceneObject {
    return this;
  }

  translate(v: Vec3): this {
    this.operations.push((scene, mesh) => {
      mesh.position = new Vector3(...v).addInPlace(mesh.position);
      return mesh;
    });
    return this;
  }

  color(c: Vec3): this {
    this.operations.push((scene, mesh) => {
      const $color = JSON.stringify(c);
      const $position = JSON.stringify(mesh.position.asArray());
      const name = `material(${$color},${$position}).${mesh.name}`;
      const material =
        (scene.getMaterialByName(name) as PBRMaterial) ||
        new PBRMaterial(name, scene);
      material.albedoColor = new Color3(...c);
      material.metallic = 0;
      material.roughness = 1;
      scene.initializers.push(() => {
        material.reflectionTexture = scene.blurredReflectionTexture;
      });
      mesh.material = material;
      mesh.name = name;
      return mesh;
    });
    return this;
  }

  env_snapshot(): this {
    this.operations.push((scene, mesh) => {
      scene.initializers.push(() => {
        const name = `reflection([${mesh.position.toString}]).${mesh.name}`;
        const probe = new ReflectionProbe(name, 256, scene);
        probe.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
        probe.position = mesh.position;
        scene.meshes.forEach(
          (sceneMesh) =>
            sceneMesh !== mesh &&
            (probe.renderList as Array<AbstractMesh>).push(sceneMesh),
        );
        // TODO: do not overwrite all instances of this material
        (mesh.material as PBRMaterial).reflectionTexture = probe.cubeTexture;
      });
      return mesh;
    });

    return this;
  }
}
