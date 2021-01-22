export default async function () {
  const [
    { Vector3 },
    { Mesh },
    { CSG },
    { MultiMaterial },
  ] = await Promise.all([
    import('@babylonjs/core/Maths/math.vector'),
    import('@babylonjs/core/Meshes/mesh'),
    import('@babylonjs/core/Meshes/csg'),
    import('@babylonjs/core/Materials/multiMaterial'),
  ]);
  return {
    Vector3,
    Mesh,
    CSG,
    MultiMaterial,
  };
}
