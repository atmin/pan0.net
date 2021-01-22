export default async function () {
  const [{ AdvancedDynamicTexture }, { Image }] = await Promise.all([
    import('@babylonjs/gui/2D/advancedDynamicTexture'),
    import('@babylonjs/gui/2D/controls/image'),
  ]);
  return {
    AdvancedDynamicTexture,
    Image,
  };
}
