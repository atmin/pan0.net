import materialsBundle from '../bundles/materials';
import {
  Material,
  MaterialOptions,
  PBRMaterialOptions,
  BabylonScene,
  AbstractMesh,
} from '../common/types';

export async function createMaterial(
  options: MaterialOptions,
  mesh: AbstractMesh,
  scene: BabylonScene
): Promise<Material> {
  const {
    StandardMaterial,
    PBRMaterial,
    Texture,
    Color3,
  } = await materialsBundle();
  const { type, ...opts } = options;
  const {
    materialType,
    material,
    colorProps,
    textureProps,
    otherProps,
  } = ((): {
    materialType: 'standard' | 'pbr';
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
        materialType,
        material: new StandardMaterial('TODO', scene),
        colorProps: standardMaterialColorProps,
        textureProps: standardMaterialTextureProps,
        otherProps: [],
      };
    }

    return {
      materialType,
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
  for (let i = 0; i < textureProps.length; i++) {
    const texture = textures[i];

    if (typeof texture === 'string') {
      material[textureProps[i]] = await Promise.resolve(
        new Texture(texture, scene)
      );
    }
    if (
      typeof texture === 'object' &&
      typeof texture.createTexture === 'function'
    ) {
      material[textureProps[i]] = await texture.createTexture(mesh);
    }
  }

  if (
    materialType === 'pbr' &&
    !opts.hasOwnProperty('metallic') &&
    !opts.hasOwnProperty('roughness')
  ) {
    (opts as PBRMaterialOptions).metallic = 0;
    (opts as PBRMaterialOptions).roughness = 1;
  }

  otherProps.forEach((option) => {
    material[option] = opts[option];
  });

  return material;
}
