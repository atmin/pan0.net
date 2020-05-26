import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Collisions/collisionCoordinator";
import "@babylonjs/core/Rendering/edgesRenderer";
import "pepjs";

import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { RenderTargetTexture } from "@babylonjs/core/Materials/Textures/renderTargetTexture";
import { Color3, Vector3 } from "@babylonjs/core/Maths/math";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { ReflectionProbe } from "@babylonjs/core/Probes/reflectionProbe";
import { Scene } from "@babylonjs/core/scene";
import { SceneSerializer } from "@babylonjs/core/Misc/sceneSerializer";

import {
  box,
  difference,
  group,
  ico_sphere,
  intersection,
  sphere,
  union,
  image
} from "./objects";
import {
  color,
  edges,
  material,
  metallic,
  microsurface,
  reflection,
  rotation,
  roughness,
  translate,
  opacity,
  wireframe
} from "./operators";
import { environment, ground, lights } from "./statements";
import { PanOperator, PanScene, PanStatement } from "./types";

export default pan;

function pan(
  options: { canvasSelector: string; fpsSelector: string } = {
    canvasSelector: "canvas",
    fpsSelector: "#panfps"
  }
) {
  const canvas = document.querySelector(
    options.canvasSelector
  ) as HTMLCanvasElement;
  const fps = document.querySelector(options.fpsSelector) as HTMLElement;

  const statement = (func: (...args: any) => PanStatement) =>
    function(...args: []) {
      const context = this._operators
        ? this
        : { _operators: [], ...operators, ...objects };
      return func.apply(context, args);
    };

  const operator = (func: (...args: any) => PanOperator) =>
    function(...args: []) {
      const context = this._operators
        ? this
        : { _operators: [], ...operators, ...objects };
      const op = func.apply(context, args);
      context._operators.unshift(op);
      return context;
    };

  const transform = (
    mesh: Mesh,
    operators: PanOperator[],
    _scene: PanScene
  ): Mesh => {
    if (!mesh.material) {
      mesh.material = _scene.defaultMaterial;
    }
    mesh.receiveShadows = true;
    mesh.checkCollisions = true;
    return (operators || []).reduce(
      (result, operator) => operator(_scene, result),
      mesh
    );
  };

  const object_creator = (func: (...args: any) => PanStatement) =>
    function(...args: []) {
      const context = this._operators
        ? this
        : { _operators: [], ...operators, ...objects };
      const createMesh = func.apply(context, args);
      return (_scene: PanScene) =>
        transform(createMesh(_scene), context._operators, _scene);
    };

  const operators = {
    translate: operator(translate),
    rotation: operator(rotation),
    edges: operator(edges),
    color: operator(color),
    wireframe: operator(wireframe),
    material: operator(material),
    metallic: operator(metallic),
    roughness: operator(roughness),
    microsurface: operator(microsurface),
    reflection: operator(reflection),
    opacity: operator(opacity)
  };

  const objects = {
    ground: object_creator(ground),
    box: object_creator(box),
    sphere: object_creator(sphere),
    ico_sphere: object_creator(ico_sphere),
    group: object_creator(group),
    union: object_creator(union),
    difference: object_creator(difference),
    intersection: object_creator(intersection),
    image: object_creator(image)
  };

  const globals = {
    scene,
    environment: statement(environment),
    lights: statement(lights),
    ...operators,
    ...objects
  };

  function global() {
    for (const [key, value] of Object.entries(globals)) {
      (window as any)[key] = value;
    }
  }

  function camera({
    fov = 1,
    speed = 0.1,
    ellipsoid = [0.8, 0.9, 0.8],
    applyGravity = true,
    checkCollisions = true
  } = {}) {
    return (_scene: PanScene) => {
      const camera = new UniversalCamera(
        "camera",
        new Vector3(0, 1.8, -10),
        _scene
      );
      camera.applyGravity = applyGravity;
      camera.ellipsoid = new Vector3(...ellipsoid);
      camera.setTarget(Vector3.Zero());
      camera.speed = speed;
      camera.fov = fov;
      camera.attachControl(canvas, true);
      camera.checkCollisions = checkCollisions;
    };
  }

  function scene(...statements: PanStatement[]) {
    const engine = new Engine(canvas);
    const _scene = new Scene(engine) as PanScene;

    _scene.initializers = [];

    // TODO: make configurable
    _scene.defaultMaterial = new PBRMaterial("defaultPanMaterial", _scene);
    (_scene.defaultMaterial as PBRMaterial).albedoColor = new Color3(
      0.7,
      0.7,
      0.7
    );
    (_scene.defaultMaterial as PBRMaterial).metallic = 0;
    (_scene.defaultMaterial as PBRMaterial).roughness = 0.5;

    if (!_scene.environmentApplied) {
      environment()(_scene);
    }

    statements.flat().forEach(statement => statement(_scene));

    if (!_scene.lightsApplied) {
      lights([
        {
          type: "hemispheric",
          direction: [0, 1, 0]
        },
        {
          type: "directional",
          direction: [0, -1, 0],
          position: [0, 10, 0]
        }
      ])(_scene);
    }

    if (!_scene.getCameraByName("camera")) {
      camera()(_scene);
    }

    if (!_scene.getMeshByName("ground")) {
      ground()(_scene);
    }
    // larger size is slow
    const probe = new ReflectionProbe(name, 256, _scene);
    probe.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
    probe.position = new Vector3(0, 1, 0);
    probe.renderList.push(
      _scene.getMeshByName("sky"),
      _scene.getMeshByName("ground")
    );
    _scene.blurredReflectionTexture = probe.cubeTexture;
    (_scene.defaultMaterial as PBRMaterial).reflectionTexture =
      _scene.blurredReflectionTexture;

    _scene.initializers.forEach(initializer => initializer(_scene));

    engine.runRenderLoop(() => {
      _scene.render();
      if (fps) {
        const val = parseInt(engine.getFps().toFixed(), 10);
        if (isFinite(val)) fps.innerText = val.toString();
      }
    });

    window.addEventListener("resize", () => {
      engine.resize();
    });

    (window as any)._scene = _scene;

    // Instrument so scene can be serialized
    (_scene as any).isPhysicsEnabled = () => false;
    const hashCode = (s: string) => {
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };
    (window as any).snapshot = (hashLongData = true) => {
      let result = SceneSerializer.Serialize(_scene);
      if (hashLongData) {
        const walk = (root: Iterable<any>) => {
          Object.entries(root).forEach(([key, value]) => {
            if (
              Array.isArray(value) &&
              value.length > 4 &&
              !["meshes", "materials"].includes(key)
            ) {
              root[key] = hashCode(JSON.stringify(value));
              return;
            }
            if (typeof value === "string" && value.length > 42) {
              root[key] = hashCode(value);
              return;
            }
            if (Array.isArray(value)) {
              value.forEach(item => typeof item === "object" && walk(item));
            }
            if (!Array.isArray(value) && typeof value === "object" && value) {
              walk(value);
            }
          });
        };
        walk(result);
      }
      return result;
    };
  }

  return { global, ...globals };
}

(window as any).pan = pan;
