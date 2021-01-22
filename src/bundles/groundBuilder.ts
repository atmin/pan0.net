export default async function () {
  const { GroundBuilder } = await import(
    '@babylonjs/core/Meshes/Builders/groundBuilder'
  );
  return { GroundBuilder };
}
