import {
  Material,
  MaterialOptions,
  BabylonScene,
  AbstractMesh,
} from '../types';

export async function createMaterial(
  options: MaterialOptions,
  mesh: AbstractMesh,
  scene: BabylonScene
): Promise<Material> {
  const [
    { StandardMaterial },
    { PBRMaterial },
    { Texture },
    { Color3 },
  ] = await Promise.all([
    import('@babylonjs/core/Materials/standardMaterial'),
    import('@babylonjs/core/Materials/PBR/pbrMaterial'),
    import('@babylonjs/core/Materials/Textures/texture'),
    import('@babylonjs/core/Maths/math'),
  ]);
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

  otherProps.forEach((option) => {
    material[option] = opts[option];
  });

  return material;
}
