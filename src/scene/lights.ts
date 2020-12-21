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
      async (def: LightDefinition, i) => {
        switch (def.type) {
          case 'directional': {
            const [
              { Vector3 },
              { DirectionalLight },
              { ShadowGenerator },
            ] = await Promise.all([
              import('@babylonjs/core/Maths/math.vector'),
              import('@babylonjs/core/Lights/directionalLight'),
              import('@babylonjs/core/Lights/Shadows/shadowGenerator'),
            ]);
            const light = new DirectionalLight(
              `$directionalLight(${i + 1})`,
              new Vector3(...(def.direction || [0, 1, 0])),
              scene
            );
            light.position = new Vector3(...(def.position || [0, -4, 0]));
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

          case 'hemispheric': {
            const [{ Vector3 }, { HemisphericLight }] = await Promise.all([
              import('@babylonjs/core/Maths/math.vector'),
              import('@babylonjs/core/Lights/hemisphericLight'),
            ]);
            new HemisphericLight(
              `$hemisphericLight(${i + 1})`,
              new Vector3(...(def.direction || [0, 1, 0])),
              scene
            );
            return null;
          }
        }
      }
    );

    this.onInit(async () => {
      const shadowGeneratorsRaw = await Promise.all(shadowGeneratorPromises);
      const shadowCasters = scene.meshes.filter(
        (mesh) => !['$ground', '$sky'].includes(mesh.name)
      );
      const shadowGenerators = shadowGeneratorsRaw.filter(Boolean);
      shadowCasters.forEach((mesh) =>
        shadowGenerators.forEach((sg: ShadowGenerator) =>
          sg.addShadowCaster(mesh)
        )
      );
    });
  };

  return this;
}
