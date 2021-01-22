export default async function () {
  const [
    { StandardMaterial },
    { PBRMaterial },
    { BackgroundMaterial },
    { Texture },
    { Color3 },
    { CubeTexture },
    { ReflectionProbe },
  ] = await Promise.all([
    import('@babylonjs/core/Materials/standardMaterial'),
    import('@babylonjs/core/Materials/PBR/pbrMaterial'),
    import('@babylonjs/core/Materials/Background/backgroundMaterial'),
    import('@babylonjs/core/Materials/Textures/texture'),
    import('@babylonjs/core/Maths/math'),
    import('@babylonjs/core/Materials/Textures/cubeTexture'),
    import('@babylonjs/core/Probes/reflectionProbe'),
  ]);
  return {
    StandardMaterial,
    PBRMaterial,
    BackgroundMaterial,
    Texture,
    Color3,
    CubeTexture,
    ReflectionProbe,
  };
}
