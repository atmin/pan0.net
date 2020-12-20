import { StandardMaterial, PBRMaterial, Texture } from '../common';
import type {
  CreateMesh,
  SceneObject,
  Material,
  MaterialOptions,
  BabylonScene,
} from '../types';

async function createMaterial(
  options: MaterialOptions,
  scene: BabylonScene
): Promise<Material> {
  if (options.type === 'standard') {
    const material = new StandardMaterial('TODO', scene);
    const props = [
      'diffuseTexture',
      'ambientTexture',
      'opacityTexture',
      'reflectionTexture',
      'emissiveTexture',
      'specularTexture',
      'bumpTexture',
      'lightmapTexture',
      'refractionTexture',
    ];
    const textures = await Promise.all(props.map((prop) => options[prop]));
    textures.forEach((texture, i) => {
      if (typeof texture === 'string') {
        console.log(texture);
        options[props[i]] = new Texture(texture, scene);
      }
    });
    Object.keys(options).forEach((option) => {
      material[option] = options[option];
    });
    return material;
  }

  if (options.type === 'pbr') {
    const material = new PBRMaterial('todo', scene);
    return material;
  }
}

export function createSceneObject<
  TOperators = {
    [operator: string]: (
      arg?: string | boolean | number | [number, number, number]
    ) => SceneObject;
  }
>({
  createMesh,
  ...operators
}: {
  createMesh: CreateMesh;
} & TOperators): SceneObject & TOperators {
  return {
    meshOptions: {},
    materialOptions: { type: 'standard' },
    textures: {},
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
      mesh.material = await createMaterial(self.materialOptions, scene);
      // TODO: extract as mesh operators
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
