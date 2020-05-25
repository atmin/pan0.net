import { MultiMaterial } from "@babylonjs/core/Materials/multiMaterial";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { CSG } from "@babylonjs/core/Meshes/csg";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";

import {
  FlatPanObjects,
  PanObject,
  PanObjects,
  PanScene,
  PanStatement,
} from "./types";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";

export function box(size: number | [number, number, number] = 1): PanObject {
  return (_scene: PanScene) => {
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
      _scene
    );
    mesh.position =
      typeof size === "number"
        ? new Vector3(size / 2, size / 2, size / 2)
        : new Vector3(size[0] / 2, size[1] / 2, size[2] / 2);
    return mesh;
  };
}

export function sphere(diameter: number | { diameter: number } = 1): PanObject {
  return (_scene: PanScene) => {
    const mesh = MeshBuilder.CreateSphere(
      `sphere(${diameter})`,
      typeof diameter === "number"
        ? {
            diameter,
          }
        : diameter,
      _scene
    );
    const r =
      typeof diameter === "number" ? diameter / 2 : diameter.diameter / 2;
    mesh.position = new Vector3(r, r, r);
    return mesh;
  };
}

export function ico_sphere(options: any): PanObject {
  return (_scene: PanScene) => {
    const mesh = MeshBuilder.CreateIcoSphere(
      `ico_sphere(${JSON.stringify(options)})`,
      options,
      _scene
    );
    mesh.position = new Vector3(
      (options.diameter || options.diameterX) / 2,
      (options.diameter || options.diameterY) / 2,
      (options.diameter || options.diameterZ) / 2
    );
    return mesh;
  };
}

function csg(meshes: PanObjects, method: string, name: string) {
  return (_scene: PanScene) => {
    if (!meshes.length) return;
    const [first, ...rest] = [
      ...(meshes.length == 1 && Array.isArray(meshes[0]) ? meshes[0] : meshes),
    ] as FlatPanObjects;
    const firstMesh = first(_scene);
    const nameArgs = [firstMesh.id];
    const csg = CSG.FromMesh(firstMesh);
    const material = new MultiMaterial("multimat", _scene);
    material.subMaterials.push(firstMesh.material);
    firstMesh.dispose();
    while (rest.length) {
      const func = rest.shift();
      const mesh = func(_scene);
      (csg as any)[method](CSG.FromMesh(mesh));
      nameArgs.push(mesh.id);
      material.subMaterials.push(mesh.material);
      mesh.dispose();
    }
    const mesh = csg.toMesh(
      `${name}(${nameArgs.join(", ")})`,
      material,
      _scene,
      true
    );
    mesh.position = firstMesh.position;
    return mesh;
  };
}

export function group(...meshes: PanObjects) {
  return (_scene: PanScene) => {
    return Mesh.MergeMeshes(
      ((meshes.length == 1 && Array.isArray(meshes[0])
        ? meshes[0]
        : meshes) as FlatPanObjects).map((mesh: PanObject) => mesh(_scene)),
      true,
      false,
      null,
      false,
      true
    );
  };
}

export function union(...meshes: PanObjects) {
  return csg.call(this, meshes, "unionInPlace", "union");
}

export function difference(...meshes: PanObjects) {
  return csg.call(this, meshes, "subtractInPlace", "difference");
}

export function intersection(...meshes: PanObjects) {
  return csg.call(this, meshes, "intersectInPlace", "intersection");
}

export function image(url: string): PanObject {
  return (_scene: PanScene) => {
    const mesh = MeshBuilder.CreatePlane("image", {}, _scene);
    const material = new PBRMaterial("image", _scene);
    material.albedoTexture = new Texture(url, _scene);
    material.metallic = 0.3;
    material.roughness = 0.8;
    mesh.material = material;
    return mesh;
  };
}
