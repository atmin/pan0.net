export default async function () {
  const { SphereBuilder } = await import(
    '@babylonjs/core/Meshes/Builders/sphereBuilder'
  );
  return { SphereBuilder };
}
