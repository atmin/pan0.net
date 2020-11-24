import type {
  BabylonScene,
  LightDefinition,
  Scene,
  ShadowGenerator,
} from '../types';

export function lights(
  arg: null | LightDefinition | Array<LightDefinition>
): Scene {
  const definitions =
    arg === null ? [] : Array.isArray(arg) ? arg : [arg || {}];

  (this as Scene)._createLights = (scene: BabylonScene) => {
    const shadowGeneratorPromises = definitions.map(
      (def: LightDefinition, i) => {
        switch (def.type) {
          case 'directional':
            return Promise.all([
              import('../common'),
              import('@babylonjs/core/Lights/directionalLight'),
              import('@babylonjs/core/Lights/Shadows/shadowGenerator'),
            ]).then(
              ([{ Vector3 }, { DirectionalLight }, { ShadowGenerator }]) => {
                const light = new DirectionalLight(
                  `dir${i}`,
                  new Vector3(...(def.direction || [0, -1, 0])),
                  scene
                );
                light.position = new Vector3(...(def.position || [0, 4, 0]));
                light.intensity = def.intensity || 0.1;
                light.lightmapMode = 2; // @babylonjs/core/Lights/light::Light.LIGHTMAP_SHADOWSONLY
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
              }
            );

          case 'hemispheric':
            return Promise.all([
              import('../common'),
              import('@babylonjs/core/Lights/hemisphericLight'),
            ]).then(([{ Vector3 }, { HemisphericLight }]) => {
              new HemisphericLight(
                `hemi${i}`,
                new Vector3(...(def.direction || [0, 1, 0])),
                scene
              );
              return null;
            });
        }
      }
    );

    this.onInit(() => {
      Promise.all(shadowGeneratorPromises).then((shadowGenerators) =>
        scene.meshes
          .filter((mesh) => !['$ground', '$sky'].includes(mesh.name))
          .forEach((mesh) =>
            shadowGenerators
              .filter(Boolean)
              .forEach((sg: ShadowGenerator) => sg.addShadowCaster(mesh))
          )
      );
    });
  };

  return this;
}
