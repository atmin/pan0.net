import type { CreateMesh, SceneObject, SceneObjectOperations } from '../types';

export function createObject(
  createMesh: CreateMesh,
  operators: {} = {}
): SceneObject {
  return {
    operations: [],
    createMesh,

    async appendTo(scene) {
      const [{ Mesh }, { Vector3 }] = await Promise.all([
        import('@babylonjs/core/Meshes/mesh'),
        import('@babylonjs/core/Maths/math.vector'),
      ]);
      const mesh = (this.operations as SceneObjectOperations).reduce(
        (result, operation) => operation(result, { Mesh, Vector3 }),
        await (this as SceneObject).createMesh(scene)
      );
      if (!mesh.material) {
        mesh.material = scene.defaultMaterial;
      }
      mesh.receiveShadows = true;
      mesh.checkCollisions = true;
    },

    name(newName) {
      if (String(newName).startsWith('$')) {
        throw 'object names cannot start with $';
      }
      (this.operations as SceneObjectOperations).push((mesh) => {
        mesh.name = newName;
        return mesh;
      });
      return this;
    },

    position(v) {
      (this.operations as SceneObjectOperations).push((mesh, { Vector3 }) => {
        mesh.position = new Vector3(...v);
        return mesh;
      });
      return this;
    },

    ...operators,
  };
}
