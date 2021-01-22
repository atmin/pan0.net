export default async function () {
  const { PlaneBuilder } = await import(
    '@babylonjs/core/Meshes/Builders/planeBuilder'
  );
  return { PlaneBuilder };
}
