import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { RenderTargetTexture } from '@babylonjs/core/Materials/Textures/renderTargetTexture';
import { Color3, Vector3 } from '@babylonjs/core/Maths/math';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import { ReflectionProbe } from '@babylonjs/core/Probes/reflectionProbe';

import {
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

    // TODO: move to scene
    this.eventMap = {
      frame: [],
      click: [],
      pointerenter: [],
      pointerleave: [],
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

  position(v: Vec3): this {
    this.operations.push((scene, mesh) => {
      mesh.position = new Vector3(...v);
      return mesh;
    });
    return this;
  }

  translate(v: Vec3): this {
    this.operations.push((scene, mesh) => {
      mesh.position = new Vector3(...v).addInPlace(mesh.position);
      return mesh;
    });
    return this;
  }

  rotateX(radians: number): this {
    this.operations.push((scene, mesh) => {
      // TODO: implement
      return mesh;
    });
    return this;
  }

  rotateY(radians: number): this {
    this.operations.push((scene, mesh) => {
      // TODO: implement
      return mesh;
    });
    return this;
  }

  rotateZ(radians: number): this {
    this.operations.push((scene, mesh) => {
      // TODO: implement
      return mesh;
    });
    return this;
  }

  color(c: Vec3): SceneObject {
    this.operations.push((scene, mesh) => {
      const $color = JSON.stringify(c);
      const $position = JSON.stringify(mesh.position.asArray());
      const name = `${mesh.name}.color(${$color},${$position})`;
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

  metallic(value = 1): this {
    this.operations.push((scene, mesh) => {
      const name = `${mesh.name}.metallic(${value})`;
      (mesh.material as PBRMaterial).metallic = value;
      mesh.name = name;
      return mesh;
    });
    return this;
  }

  roughness(value = 1): this {
    this.operations.push((scene, mesh) => {
      const name = `${mesh.name}.roughness(${value})`;
      (mesh.material as PBRMaterial).metallic = value;
      mesh.name = name;
      return mesh;
    });
    return this;
  }

  // TODO: extract outside SceneObject, remove ReflectionProbe dependency, make lazy
  env_snapshot(): this {
    this.operations.push((scene, mesh) => {
      scene.initializers.push(() => {
        const name = `reflection_probe([${mesh.position.toString}])`;
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
