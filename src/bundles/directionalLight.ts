export default async function () {
  const [{ DirectionalLight }, { ShadowGenerator }] = await Promise.all([
    import('@babylonjs/core/Lights/directionalLight'),
    import('@babylonjs/core/Lights/Shadows/shadowGenerator'),
  ]);
  return {
    DirectionalLight,
    ShadowGenerator,
  };
}
