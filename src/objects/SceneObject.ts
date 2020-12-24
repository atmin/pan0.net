import { createMaterial } from './createMaterial';
import {
  BabylonScene,
  MaterialOptions,
  Mesh,
  SceneObjectOperations,
} from '../types';

export class SceneObject {
  static _counters = {};

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

  async createMesh(_options: object, _scene: BabylonScene): Promise<Mesh> {
    throw new Error('SceneObject descendants must override createMesh');
  }

  async appendTo(scene: BabylonScene) {
    const [{ Mesh }, { Vector3 }] = await Promise.all([
      import('@babylonjs/core/Meshes/mesh'),
      import('@babylonjs/core/Maths/math.vector'),
    ]);
    const mesh = await this.createMesh(this._createMeshOptions, scene);
    mesh.receiveShadows = true;
    mesh.checkCollisions = true;

    for (let operation of this._operations) {
      operation(mesh, { Mesh, Vector3 });
    }
    mesh.material = await createMaterial(
      this._createMaterialOptions,
      mesh,
      scene
    );
  }

  position(v: [number, number, number]) {
    this._operations.push((mesh, { Vector3 }) => {
      mesh.position = new Vector3(...v);
    });
    return this;
  }

  material(options: MaterialOptions) {
    this._createMaterialOptions = options;
    return this;
  }
}
