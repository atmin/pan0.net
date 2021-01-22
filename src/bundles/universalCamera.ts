export default async function () {
  const { UniversalCamera } = await import(
    '@babylonjs/core/Cameras/universalCamera'
  );
  return { UniversalCamera };
}
