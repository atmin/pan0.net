export default async function () {
  const [_, { SceneLoader }] = await Promise.all([
    import('@babylonjs/loaders/glTF/2.0/glTFLoader'),
    import('@babylonjs/core/Loading/sceneLoader'),
  ]);
  return { SceneLoader };
}
