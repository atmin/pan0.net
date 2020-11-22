import { Light } from '@babylonjs/core/Lights/light';
import { Vector3 } from '../common';

import type { BabylonScene, LightDefinition, Scene } from '../types';

export function lights(
  arg: null | LightDefinition | Array<LightDefinition>
): Scene {
  const definitions =
    arg === null ? [] : Array.isArray(arg) ? arg : [arg || {}];

  (this as Scene)._createLights = async (scene: BabylonScene) => {
    const shadowGeneratorPromises = definitions.map(
      (def: LightDefinition, i) => {
        switch (def.type) {
          case 'directional':
            return Promise.all([
              import('@babylonjs/core/Lights/directionalLight'),
              import('@babylonjs/core/Lights/Shadows/shadowGenerator'),
            ]).then(([{ DirectionalLight }, { ShadowGenerator }]) => {
              const light = new DirectionalLight(
                `dir${i}`,
                new Vector3(...(def.direction || [0, -1, 0])),
                scene
              );
              light.position = new Vector3(...(def.position || [0, 4, 0]));
              light.intensity = def.intensity || 0.1;
              light.lightmapMode = Light.LIGHTMAP_SHADOWSONLY;
              const shadowGenerator = def.shadowless
                ? null
                : (() => {
                    const result = new ShadowGenerator(1024, light);
                    result.useBlurExponentialShadowMap = true;
                    result.useKernelBlur = true;
                    result.blurKernel = 64;
                    return result;
                  })();
              return shadowGenerator;
            });

          case 'hemispheric':
            return import('@babylonjs/core/Lights/hemisphericLight').then(
              ({ HemisphericLight }) => {
                new HemisphericLight(
                  `hemi${i}`,
                  new Vector3(...(def.direction || [0, 1, 0])),
                  scene
                );
                return null;
              }
            );
        }
      }
    );

    this.onInit(() => {
      Promise.all([
        import('@babylonjs/core/Meshes/groundMesh'),
        Promise.all(shadowGeneratorPromises),
      ]).then(([{ GroundMesh }, shadowGenerators]) =>
        scene.meshes
          .filter(
            (mesh) => !(mesh instanceof GroundMesh || mesh.name === 'sky')
          )
          .forEach((mesh) =>
            shadowGenerators
              .filter(Boolean)
              .forEach((sg: any) => sg.addShadowCaster(mesh))
          )
      );
    });
  };

  return this;
}
