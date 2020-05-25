import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";

import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { BackgroundMaterial } from "@babylonjs/core/materials/Background";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Color3, Vector3 } from "@babylonjs/core/Maths/math";
import { GroundMesh } from "@babylonjs/core/Meshes/groundMesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";

import { PanScene, PanVector3 } from "./types";
import { Light } from "@babylonjs/core/Lights/light";

import "@babylonjs/core/Helpers/sceneHelpers";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";

export function environment() {
  return (scene: PanScene) => {
    scene.gravity = new Vector3(...[0, -9.81, 0]);
    scene.collisionsEnabled = true;
    scene.environmentTexture = new CubeTexture("/pan.env", scene);

    const skyMaterial = new PBRMaterial("sky_material", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.reflectionTexture = scene.environmentTexture;
    skyMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyMaterial.disableLighting = true;
    skyMaterial.microSurface = 0.7;
    const sky = MeshBuilder.CreateBox("sky", { size: 1000 }, scene);
    sky.material = skyMaterial;

    scene.environmentApplied = true;
  };
}

interface LightDefinition {
  type: "hemispheric" | "directional";
  position?: PanVector3;
  direction?: PanVector3;
  intensity?: number;
  shadowless?: boolean;
}
export function lights(arg: null | LightDefinition | Array<LightDefinition>) {
  const definitions =
    arg === null ? [] : Array.isArray(arg) ? arg : [arg || {}];

  return (scene: PanScene) => {
    const lights = definitions.map((def: LightDefinition, i) => {
      switch (def.type) {
        case "directional": {
          const light = new DirectionalLight(
            `dir${i}`,
            new Vector3(...(def.direction || [0, -1, 0])),
            scene
          );
          light.position = new Vector3(...(def.position || [0, 10, 0]));
          light.intensity = def.intensity || 1;
          light.lightmapMode = Light.LIGHTMAP_SHADOWSONLY;
          return light;
        }
        case "hemispheric": {
          const light = new HemisphericLight(
            `hemi${i}`,
            new Vector3(...(def.direction || [0, 1, 0])),
            scene
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

    scene.initializers.push((scene: PanScene) => {
      scene.meshes
        .filter(mesh => !(mesh instanceof GroundMesh || mesh.name === "sky"))
        .forEach(mesh =>
          shadowGenerators.forEach(sg => sg.addShadowCaster(mesh))
        );
    });

    scene.lightsApplied = true;
  };
}

export function ground({
  color = [0.6, 0.6, 0.6],
  checkCollisions = true
}: {
  color?: [number, number, number];
  checkCollisions?: boolean;
} = {}) {
  return (scene: PanScene) => {
    const ground = MeshBuilder.CreateGround(
      "ground",
      {
        width: 100,
        height: 100,
        subdivisions: 10
      },
      scene
    );
    const groundMaterial = new BackgroundMaterial("groundmat", scene);
    groundMaterial.shadowLevel = 0.4;
    groundMaterial.useRGBColor = false;
    groundMaterial.primaryColor = new Color3(...color);
    ground.material = groundMaterial;
    ground.checkCollisions = checkCollisions;
    ground.receiveShadows = true;
    return ground;
  };
}
