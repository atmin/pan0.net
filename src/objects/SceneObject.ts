import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { CSG } from '@babylonjs/core/Meshes/csg';
import { MultiMaterial } from '@babylonjs/core/Materials/multiMaterial';
import type { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';

import { createMaterial } from './createMaterial';
import {
  BabylonScene,
  SceneObjectEvents,
  MaterialOptions,
  Mesh,
  RefreshRate,
} from '../types';

export class SceneObject {
  static _counters = { environmentSnapshot: 1 };

  _name: string;
  _mesh: Mesh;
  _scene: BabylonScene;
  _opacity: number;
  _createMeshOptions: object;
  _createMaterialOptions: MaterialOptions;
  _operations: Array<() => Promise<void>>;

  constructor(className: string, name?: string) {
    if (name) {
      this._name = name;
    } else {
      const counter = SceneObject._counters[className] || 1;
      this._name = `${className}(${counter})`;
      SceneObject._counters[className] = counter + 1;
    }
    this._createMeshOptions = {};
    this._operations = [];
    this._opacity = 1;
  }

  async createMesh(_options: object, _scene: BabylonScene): Promise<Mesh> {
    throw new Error('SceneObject descendants must override createMesh');
  }

  async applyOperations() {
    for (let operation of this._operations) {
      await operation();
    }
  }

  async appendTo(scene: BabylonScene): Promise<Mesh> {
    const setVisibility = () => (this._mesh.visibility = this._opacity);
    this._scene = scene;
    this._mesh = await this.createMesh(this._createMeshOptions, scene);
    this._mesh.visibility = 0;
    this._mesh.receiveShadows = true;
    if (this._createMaterialOptions) {
      createMaterial(this._createMaterialOptions, this._mesh, scene).then(
        (material) => {
          this._mesh.material = material;
          this.applyOperations().then(setVisibility);
        }
      );
    } else {
      this.applyOperations().then(setVisibility);
    }
    return this._mesh;
  }

  position(v: [number, number, number]): SceneObject {
    this._operations.push(async () => {
      this._mesh.position = new Vector3(...v);
    });
    return this;
  }

  scaling(v: [number, number, number]): SceneObject {
    this._operations.push(async () => {
      this._mesh.scaling = new Vector3(...v);
    });
    return this;
  }

  rotation(v: [number, number, number]): SceneObject {
    this._operations.push(async () => {
      this._mesh.rotation = new Vector3(...v);
    });
    return this;
  }

  receiveShadows(b: boolean | ((mesh: Mesh) => boolean) = true): SceneObject {
    this._operations.push(async () => {
      this._mesh.receiveShadows = typeof b === 'function' ? b(this._mesh) : b;
    });
    return this;
  }

  checkCollisions(b: boolean | ((mesh: Mesh) => boolean) = false): SceneObject {
    this._operations.push(async () => {
      this._mesh.checkCollisions = typeof b === 'function' ? b(this._mesh) : b;
    });
    return this;
  }

  opacity(o: number): SceneObject {
    this._opacity = o;
    return this;
  }

  material(options: MaterialOptions): SceneObject {
    this._createMaterialOptions = options;
    return this;
  }

  environmentSnapshot(): SceneObject {
    this._operations.push(async () => {
      this._scene.onAfterRenderObservable.addOnce(async () => {
        const { ReflectionProbe } = await import(
          /* webpackChunkName: "reflectionProbe" */
          '@babylonjs/core/Probes/reflectionProbe'
        );
        const probe = new ReflectionProbe(
          `environmentSnapshot(${SceneObject._counters.environmentSnapshot++})`,
          256,
          this._scene
        );
        probe.refreshRate = RefreshRate.RENDER_ONCE;
        probe.position = this._mesh.position;
        this._scene.meshes.forEach(
          (sceneMesh) =>
            sceneMesh !== this._mesh && probe.renderList.push(sceneMesh)
        );
        if (this._mesh.material) {
          const materials = (this._mesh.material as MultiMaterial)
            .subMaterials || [this._mesh.material];
          for (let material of materials)
            (material as StandardMaterial).reflectionTexture =
              probe.cubeTexture;
        }
      });
    });

    return this;
  }

  children(...objects: Array<SceneObject>): SceneObject {
    this._operations.push(async () => {
      for (let object of objects) {
        this._mesh.addChild(await object.appendTo(this._scene));
      }
    });
    return this;
  }

  _csg(
    sceneObjects: Array<SceneObject>,
    method: 'unionInPlace' | 'subtractInPlace' | 'intersectInPlace'
  ): SceneObject {
    this._operations.push(async () => {
      const csg = CSG.FromMesh(this._mesh);
      const material = new MultiMaterial(
        `material(${this._name})`,
        this._scene
      );
      material.subMaterials.push(this._mesh.material);
      this._mesh.dispose();
      for (let sceneObject of sceneObjects) {
        sceneObject._mesh = await sceneObject.createMesh(
          sceneObject._createMeshOptions,
          this._scene
        );
        await sceneObject.applyOperations();
        csg[method](CSG.FromMesh(sceneObject._mesh));
        material.subMaterials.push(
          await createMaterial(
            sceneObject._createMaterialOptions,
            sceneObject._mesh,
            this._scene
          )
        );
        sceneObject._mesh.dispose();
      }
      this._mesh = csg.toMesh(this._name, material, this._scene, true);
    });
    return this;
  }

  union(...sceneObjects: Array<SceneObject>): SceneObject {
    return this._csg(sceneObjects, 'unionInPlace');
  }

  subtract(...sceneObjects: Array<SceneObject>): SceneObject {
    return this._csg(sceneObjects, 'subtractInPlace');
  }

  intersect(...sceneObjects: Array<SceneObject>): SceneObject {
    return this._csg(sceneObjects, 'intersectInPlace');
  }

  on(event: typeof SceneObjectEvents[number], handler: () => void) {}

  onIntersectionEnter(
    otherMeshName: string,
    handler: (otherMesh: SceneObject) => void
  ) {}
}
