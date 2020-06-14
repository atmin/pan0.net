import { Vector3 } from "@babylonjs/core/Maths/math";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";

import { PanObject, PanScene } from "./types";

export function box(size: number | [number, number, number] = 1): PanObject {
  return (_scene: PanScene) => {
    const mesh = MeshBuilder.CreateBox(
      `box(${JSON.stringify(size)})`,
      {
        ...(typeof size === "number" && { size }),
        ...(Array.isArray(size) && {
          width: size[0],
          height: size[1],
          depth: size[2]
        })
      },
      _scene
    );
    mesh.position =
      typeof size === "number"
        ? new Vector3(size / 2, size / 2, size / 2)
        : new Vector3(size[0] / 2, size[1] / 2, size[2] / 2);
    return mesh;
  };
}
