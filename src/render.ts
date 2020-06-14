import "@babylonjs/core/Collisions/collisionCoordinator";
import "pepjs";
import "@babylonjs/core/Loading/loadingScreen";

import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Color3, Vector3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";

import { PanOperator, PanScene, PanStatement } from "./types";

export function render(canvas: HTMLCanvasElement) {
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

  return function(glb: Blob) {
    const engine = new Engine(canvas);
    const _scene = new Scene(engine);

    SceneLoader.AppendAsync(
      "",
      URL.createObjectURL(glb),
      _scene,
      null,
      ".glb"
    ).then(_scene => {
      console.log(_scene);

      if (!_scene.getCameraByName("camera")) {
        camera()(_scene as PanScene);
      }

      engine.runRenderLoop(() => {
        _scene.render();
      });

      window.addEventListener("resize", () => {
        engine.resize();
      });
    });
  };
}
