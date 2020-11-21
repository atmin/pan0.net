// import { BackgroundMaterial } from '@babylonjs/core/Materials/Background';
// import { Color3 } from '@babylonjs/core/Maths/math';
// import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';

// import { Scene } from '../types';

// export default ({
//   color = [0.6, 0.6, 0.6],
//   checkCollisions = true,
// }: {
//   color?: [number, number, number];
//   checkCollisions?: boolean;
// } = {}) => (scene: Scene) => {
//   const ground = MeshBuilder.CreateGround(
//     'ground',
//     {
//       width: 100,
//       height: 100,
//       subdivisions: 10,
//     },
//     scene
//   );
//   const groundMaterial = new BackgroundMaterial('groundmat', scene);
//   groundMaterial.shadowLevel = 0.4;
//   groundMaterial.useRGBColor = false;
//   groundMaterial.primaryColor = new Color3(...color);
//   ground.material = groundMaterial;
//   ground.checkCollisions = checkCollisions;
//   ground.receiveShadows = true;
//   return ground;
// };
