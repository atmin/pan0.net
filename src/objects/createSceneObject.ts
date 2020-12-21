import { Color3 } from '@babylonjs/core/Maths/math';
import { StandardMaterial, PBRMaterial, Texture } from '../common';
import type {
  CreateMesh,
  SceneObject,
  Material,
  MaterialOptions,
  BabylonScene,
} from '../types';

function createMaterial(
  options: MaterialOptions,
  scene: BabylonScene
): Material {
  const { type, ...opts } = options;
  const { material, colorProps, textureProps, otherProps } = ((): {
    material: Material;
    colorProps: string[];
    textureProps: string[];
    otherProps: string[];
  } => {
    const standardMaterialColorProps = [
      'diffuseColor',
      'ambientColor',
      'specularColor',
      'emissiveColor',
    ];
    const standardMaterialTextureProps = [
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
    const standardMaterialOtherProps = [
      'specularPower',
      'useAlphaFromDiffuseTexture',
      'useEmissiveAsIllumination',
      'linkEmissiveWithDiffuse',
    ];
    const standardMaterialProps = [
      ...standardMaterialColorProps,
      ...standardMaterialTextureProps,
      ...standardMaterialOtherProps,
    ];

    const pbrMaterialColorProps = ['albedoColor', 'reflectivityColor'];
    const pbrMaterialTextureProps = [
      'albedoTexture',
      'metallicTexture',
      'reflectionTexture',
      'bumpTexture',
      'ambientTexture',
      'microSurfaceTexture',
    ];
    const pbrMaterialOtherProps = [
      'ambientTextureStrength',
      'metallic',
      'roughness',
      'microSurface',
      'useAlphaFromAlbedoTexture',
      'useMicroSurfaceFromReflectivityMapAlpha',
      'useAmbientInGrayScale',
    ];
    // TODO: other props + subSurface, clearCoat, anisotropy, sheen, brdf

    const materialType: 'standard' | 'pbr' =
      type ||
      (Object.keys(opts).some((key) => !standardMaterialProps.includes(key))
        ? 'pbr'
        : 'standard');

    if (materialType === 'standard') {
      return {
        material: new StandardMaterial('TODO', scene),
        colorProps: standardMaterialColorProps,
        textureProps: standardMaterialTextureProps,
        otherProps: [],
      };
    }

    return {
      material: new PBRMaterial('TODO', scene),
      colorProps: pbrMaterialColorProps,
      textureProps: pbrMaterialTextureProps,
      otherProps: pbrMaterialOtherProps,
    };
  })();

  colorProps.forEach((prop) => {
    if (Array.isArray(opts[prop]) && opts[prop].length === 3) {
      material[prop] = new Color3(...opts[prop]);
    }
  });

  const textures = textureProps.map((prop) => opts[prop]);
  textures.forEach((texture, i) => {
    if (typeof texture === 'string') {
      material[textureProps[i]] = new Texture(texture, scene);
    }
    if (typeof texture === 'function') {
      material[textureProps[i]] = texture(scene);
    }
  });

  otherProps.forEach((option) => {
    material[option] = opts[option];
  });

  return material;
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
      mesh.material = createMaterial(self.materialOptions, scene);
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
