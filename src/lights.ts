import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Light } from '@babylonjs/core/Lights/light';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { Vector3 } from '@babylonjs/core/Maths/math';
import { GroundMesh } from '@babylonjs/core/Meshes/groundMesh';

import { LightDefinition, Scene } from './types';

export default (arg: null | LightDefinition | Array<LightDefinition>) => {
  const definitions =
    arg === null ? [] : Array.isArray(arg) ? arg : [arg || {}];

  return (scene: Scene) => {
    const lights = definitions.map((def: LightDefinition, i) => {
      switch (def.type) {
        case 'directional': {
          const light = new DirectionalLight(
            `dir${i}`,
            new Vector3(...(def.direction || [0, -1, 0])),
            scene,
          );
          light.position = new Vector3(...(def.position || [0, 4, 0]));
          light.intensity = def.intensity || 0.1;
          light.lightmapMode = Light.LIGHTMAP_SHADOWSONLY;
          return light;
        }
        case 'hemispheric': {
          const light = new HemisphericLight(
            `hemi${i}`,
            new Vector3(...(def.direction || [0, 1, 0])),
            scene,
          );
          return light;
        }
      }
    });

    const shadowGenerators = lights
      .map((light, i) => {
        if (
          !(definitions[i] as LightDefinition).shadowless &&
          light instanceof DirectionalLight
        ) {
          const shadowGenerator = new ShadowGenerator(1024, light);
          shadowGenerator.useBlurExponentialShadowMap = true;
          shadowGenerator.useKernelBlur = true;
          shadowGenerator.blurKernel = 64;
          return shadowGenerator;
        }
      })
      .filter(Boolean);

    (scene as any).shadowGenerators = shadowGenerators;

    scene.initializers.push(() => {
      scene.meshes
        .filter((mesh) => !(mesh instanceof GroundMesh || mesh.name === 'sky'))
        .forEach((mesh) =>
          shadowGenerators.forEach((sg) =>
            (sg as ShadowGenerator).addShadowCaster(mesh),
          ),
        );
    });

    scene.lightsApplied = true;
  };
};
