import type { CreateMesh, SceneObject } from '../types';

export function createSceneObject<
  TOperators = {
    [operator: string]: (
      arg?: string | boolean | number | [number, number, number]
    ) => SceneObject;
  }
>({
  createMesh,
  ...operators
}: { createMesh: CreateMesh } & TOperators): SceneObject & TOperators {
  return {
    meshOptions: {},
    materialOptions: { type: 'standard' },
    textures: [],
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
        await (this as SceneObject).createMesh(self.meshOptions, scene)
      );
      if (!mesh.material) {
        mesh.material = scene.defaultMaterial;
      }
      mesh.receiveShadows = true;
      mesh.checkCollisions = true;
    },

    position(v) {
      const self = this as SceneObject;
      self.operations.push((mesh, { Vector3 }) => {
        mesh.position = new Vector3(...v);
        return mesh;
      });
      return self;
    },

    material(options = { type: 'standard' }) {
      const self = this as SceneObject;
      self.materialOptions = options;
      return self;
    },

    ...((operators as unknown) as TOperators),
  };
}
