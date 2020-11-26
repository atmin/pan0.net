import type { CreateMesh, SceneObject, SceneObjectOperations } from '../types';

export function createObject<
  TOperators = {
    [operator: string]: (
      arg?: string | boolean | number | [number, number, number]
    ) => SceneObject;
  }
>(createMesh: CreateMesh, operators?: TOperators): SceneObject & TOperators {
  return {
    options: { name: '' },
    operations: [],
    createMesh,

    async appendTo(scene) {
      const [{ Mesh }, { Vector3 }] = await Promise.all([
        import('@babylonjs/core/Meshes/mesh'),
        import('@babylonjs/core/Maths/math.vector'),
      ]);
      const self = this as SceneObject;
      const mesh = self.operations.reduce(
        (result, operation) => operation(result, { Mesh, Vector3 }),
        await (this as SceneObject).createMesh(self.options, scene)
      );
      if (!mesh.material) {
        mesh.material = scene.defaultMaterial;
      }
      mesh.receiveShadows = true;
      mesh.checkCollisions = true;
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
