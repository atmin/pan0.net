// import { Vector3 } from '@babylonjs/core/Maths/math';
// import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';

// import SceneObject from './SceneObject';

// export default (diameter: number | { diameter: number } = 1) =>
//   new SceneObject((scene) => {
//     const mesh = MeshBuilder.CreateSphere(
//       `sphere(${diameter})`,
//       typeof diameter === 'number'
//         ? {
//             diameter,
//           }
//         : diameter,
//       scene,
//     );
//     const r =
//       typeof diameter === 'number' ? diameter / 2 : diameter.diameter / 2;
//     mesh.position = new Vector3(r, r, r);
//     return mesh;
//   });
