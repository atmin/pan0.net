export default async function () {
  const { BoxBuilder } = await import(
    '@babylonjs/core/Meshes/Builders/boxBuilder'
  );
  return { BoxBuilder };
}
