import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Collisions/collisionCoordinator";
import "@babylonjs/core/Rendering/edgesRenderer";
import "pepjs";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/core/Helpers/sceneHelpers";

import { Color3, Vector3 } from "@babylonjs/core/Maths/math";

import { Scene as BabylonScene } from "@babylonjs/core/scene";
import { BackgroundMaterial } from "@babylonjs/core/materials/Background";
import { BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { Engine } from "@babylonjs/core/Engines/engine";
import { GroundMesh } from "@babylonjs/core/Meshes/groundMesh";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Light } from "@babylonjs/core/Lights/light";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { ReflectionProbe } from "@babylonjs/core/Probes/reflectionProbe";
import { RenderTargetTexture } from "@babylonjs/core/Materials/Textures/renderTargetTexture";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";

/**
 * ## Main functions
 */

/**
 * Render scene to canvas.
 * @param canvas The canvas to render to
 * @param createScene Scene created by {@linkcode scene}
 *
 * @example
 * ```
 * render(
 *   document.querySelector('canvas'),
 *   scene(box().translate([0, 0.5, 0]))
 * )
 * ```
 */
export const render = (
  canvas: HTMLCanvasElement,
  createScene: SceneCreator
) => {
  const engine = new Engine(canvas);
  const scene = new BabylonScene(engine) as Scene;
  scene.initializers = [];
  createScene(scene);
  engine.runRenderLoop(() => scene.render());
};

/**
 * Create a scene from list of objects
 * @param objects Scene objects
 * @returns A scene creator function
 *
 * @example
 * ```
 * // Reflective red sphere on a light gray box
 * scene(
 *   box([3, 1, 3]),
 *   sphere(1.5)
 *     .translate([0, 1, 0])
 *     .albedo_color(COLOR_RED)
 *     .metallic(1)
 *     .roughness(0)
 *     .env_snapshot(0)
 * )
 * ```
 */
export const scene = (...objects: Array<SceneObject>): SceneCreator => (
  scene: Scene
) => {
  objects
    .filter(Boolean)
    .flat()
    .forEach((obj) => obj.appendTo(scene));

  if (!scene.lightsApplied) {
    lights([
      {
        type: "hemispheric",
        direction: [0, 1, 0],
      },
      {
        type: "directional",
        direction: [0, -1, 0],
        position: [0, 10, 0],
      },
    ])(scene);
  }

  if (!scene.getCameraByName("camera")) {
    camera()(scene);
  }

  if (!scene.getMeshByName("ground")) {
    ground()(scene);
  }
};

export const camera = ({
  fov = 1,
  speed = 0.1,
  ellipsoid = [0.8, 0.9, 0.8],
  applyGravity = true,
  checkCollisions = true,
} = {}) => (scene: BabylonScene) => {
  const camera = new UniversalCamera("camera", new Vector3(0, 1.8, -10), scene);
  camera.applyGravity = applyGravity;
  camera.ellipsoid = new Vector3(...ellipsoid);
  camera.setTarget(Vector3.Zero());
  camera.speed = speed;
  camera.fov = fov;
  camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
  camera.checkCollisions = checkCollisions;
};

type Vec3 = [number, number, number];

interface LightDefinition {
  type: "hemispheric" | "directional";
  position?: Vec3;
  direction?: Vec3;
  intensity?: number;
  shadowless?: boolean;
}
export const lights = (
  arg: null | LightDefinition | Array<LightDefinition>
) => {
  const definitions =
    arg === null ? [] : Array.isArray(arg) ? arg : [arg || {}];

  return (scene: Scene) => {
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

    scene.initializers.push(() => {
      scene.meshes
        .filter((mesh) => !(mesh instanceof GroundMesh || mesh.name === "sky"))
        .forEach((mesh) =>
          shadowGenerators.forEach((sg) => sg.addShadowCaster(mesh))
        );
    });

    scene.lightsApplied = true;
  };
};

export const ground = ({
  color = [0.6, 0.6, 0.6],
  checkCollisions = true,
}: {
  color?: [number, number, number];
  checkCollisions?: boolean;
} = {}) => (scene: Scene) => {
  const ground = MeshBuilder.CreateGround(
    "ground",
    {
      width: 100,
      height: 100,
      subdivisions: 10,
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

/**
 * ## Scene object creators
 */

/**
 * Create a box.
 * @param size
 *   nothing: 1 meter cube
 *   integer: cube of `size` meters
 *   [x, y, z]: box of specified sizes
 *
 */
export const box = (size: number | [number, number, number] = 1) =>
  new SceneObject((scene) => {
    const mesh = MeshBuilder.CreateBox(
      `box(${JSON.stringify(size)})`,
      {
        ...(typeof size === "number" && { size }),
        ...(Array.isArray(size) && {
          width: size[0],
          height: size[1],
          depth: size[2],
        }),
      },
      scene
    );
    mesh.position =
      typeof size === "number"
        ? new Vector3(size / 2, size / 2, size / 2)
        : new Vector3(size[0] / 2, size[1] / 2, size[2] / 2);
    return mesh;
  });

type EventHandler = (event: Event) => SceneObject | void;

interface EventMap {
  tick: Array<EventHandler>;
  click: Array<EventHandler>;
  pointerenter: Array<EventHandler>;
  pointerleave: Array<EventHandler>;
  pointerover: Array<EventHandler>;
  keyup: Array<EventHandler>;
  keydown: Array<EventHandler>;
  keypress: Array<EventHandler>;
}

interface Scene extends BabylonScene {
  initializers: Array<() => void>;
  environmentApplied: boolean;
  lightsApplied: boolean;
  blurredReflectionTexture: BaseTexture;
}

type SceneCreator = (scene: Scene) => void;

type LazyMesh = (scene: Scene) => Mesh;

/**
 * Scene object with transformations and event handlers.
 */
class SceneObject {
  lazyMesh: LazyMesh;
  operations: Array<(scene: Scene, mesh: Mesh) => Mesh>;
  eventMap: EventMap;

  constructor(lazyMesh: LazyMesh) {
    this.lazyMesh = lazyMesh;
    this.operations = [];
    this.eventMap = {
      tick: [],
      click: [],
      pointerenter: [],
      pointerleave: [],
      pointerover: [],
      keyup: [],
      keydown: [],
      keypress: [],
    };
  }

  /** @internal */
  appendTo(scene: Scene) {
    const mesh = this.operations.reduce(
      (result, operation) => operation(scene, result),
      this.lazyMesh(scene)
    );
    if (!mesh.material) {
      mesh.material = scene.defaultMaterial;
    }
    mesh.receiveShadows = true;
    mesh.checkCollisions = true;
  }

  on(event: keyof EventMap, handler: EventHandler): SceneObject {
    return this;
  }

  env_snapshot(): SceneObject {
    this.operations.push((scene, mesh) => {
      scene.initializers.push(() => {
        const name = `reflection([${mesh.position.toString}]).${mesh.name}`;
        const probe = new ReflectionProbe(name, 256, scene);
        probe.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
        probe.position = mesh.position;
        scene.meshes.forEach(
          (sceneMesh) => sceneMesh !== mesh && probe.renderList.push(sceneMesh)
        );
        // TODO: do not overwrite all instances of this material
        (mesh.material as PBRMaterial).reflectionTexture = probe.cubeTexture;
      });
      return mesh;
    });

    return this;
  }
}
