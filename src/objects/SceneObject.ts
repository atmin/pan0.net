import { createMaterial } from './createMaterial';
import {
  BabylonScene,
  MaterialOptions,
  AbstractMesh,
  SceneObjectOperations,
  RefreshRate,
} from '../types';
import type { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';

export class SceneObject {
  static _counters = { environmentSnapshot: 1 };

  _name: string;
  _createMeshOptions: object;
  _createMaterialOptions: MaterialOptions;
  _operations: SceneObjectOperations;

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
  }

  async createMesh(
    _options: object,
    _scene: BabylonScene
  ): Promise<AbstractMesh | Array<AbstractMesh>> {
    throw new Error('SceneObject descendants must override createMesh');
  }

  async appendTo(scene: BabylonScene) {
    const [{ Mesh }, { Vector3 }] = await Promise.all([
      import('@babylonjs/core/Meshes/mesh'),
      import('@babylonjs/core/Maths/math.vector'),
    ]);
    const createdMeshes = await this.createMesh(this._createMeshOptions, scene);
    const meshes = Array.isArray(createdMeshes)
      ? createdMeshes
      : [createdMeshes];

    for (let mesh of meshes) {
      mesh.receiveShadows = true;
      mesh.checkCollisions = true;

      for (let operation of this._operations) {
        operation({ mesh, scene, Mesh, Vector3 });
      }
      if (this._createMaterialOptions) {
        mesh.material = await createMaterial(
          this._createMaterialOptions,
          mesh,
          scene
        );
      }
    }
  }

  position(v: [number, number, number]): SceneObject {
    this._operations.push(({ mesh, Vector3 }) => {
      mesh.position = new Vector3(...v);
    });
    return this;
  }

  scaling(v: [number, number, number]): SceneObject {
    this._operations.push(({ mesh, Vector3 }) => {
      mesh.scaling = new Vector3(...v);
    });
    return this;
  }

  rotation(v: [number, number, number]): SceneObject {
    this._operations.push(({ mesh, Vector3 }) => {
      mesh.rotation = new Vector3(...v);
    });
    return this;
  }

  material(options: MaterialOptions): SceneObject {
    this._createMaterialOptions = options;
    return this;
  }

  environmentSnapshot(): SceneObject {
    this._operations.push(({ mesh, scene, Vector3 }) => {
      scene.onAfterRenderObservable.addOnce(() => {
        import('@babylonjs/core/Probes/reflectionProbe').then(
          ({ ReflectionProbe }) => {
            const probe = new ReflectionProbe(
              `environmentSnapshot(${SceneObject._counters
                .environmentSnapshot++})`,
              256,
              scene
            );
            probe.refreshRate = RefreshRate.RENDER_ONCE;
            probe.position = mesh.position;
            scene.meshes.forEach(
              (sceneMesh) =>
                sceneMesh !== mesh && probe.renderList.push(sceneMesh)
            );
            if (mesh.material) {
              (mesh.material as StandardMaterial).reflectionTexture =
                probe.cubeTexture;
            }
          }
        );
      });
    });

    return this;
  }
}
