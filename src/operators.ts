import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { StandardMaterial } from "@babylonjs/core/materials/standardMaterial";
import { RenderTargetTexture } from "@babylonjs/core/Materials/Textures/renderTargetTexture";
import {
  Color3,
  Color4,
  Quaternion,
  Vector3,
} from "@babylonjs/core/Maths/math";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { ReflectionProbe } from "@babylonjs/core/Probes/reflectionProbe";

import { PanScene, PanOperator } from "./types";

export function translate([x, y, z]: [number, number, number]): PanOperator {
  return (_scene: PanScene, mesh: Mesh) => {
    mesh.position = new Vector3(x, y, z).addInPlace(mesh.position);
    return mesh;
  };
}

export function rotation(
  angles: [number, number, number] | [number, number, number, number]
): PanOperator {
  return (_scene: PanScene, mesh: Mesh) => {
    if (angles.length === 3) {
      mesh.rotation = new Vector3(...angles.map((a) => (a * Math.PI) / 180));
    } else if (angles.length === 4) {
      mesh.rotationQuaternion = new Quaternion(...angles);
    }
    return mesh;
  };
}

export function edges({
  epsilon = 0.999,
  width = 1,
  color = [0.2, 0.2, 0.2, 1],
} = {}): PanOperator {
  return (_scene: PanScene, mesh: Mesh) => {
    mesh.enableEdgesRendering(epsilon);
    mesh.edgesWidth = width;
    mesh.edgesColor = new Color4(...color);
    return mesh;
  };
}

export function color(col: [number, number, number] = [0, 0, 0]): PanOperator {
  return (_scene: PanScene, mesh: Mesh) => {
    const name = "color(" + JSON.stringify(col) + ")";
    const material =
      (_scene.getMaterialByName(name) as StandardMaterial) ||
      new StandardMaterial(name, _scene);
    material.emissiveColor = new Color3(...col);
    mesh.material = material;
    return mesh;
  };
}

export function wireframe(): PanOperator {
  return (_scene: PanScene, mesh: Mesh) => {
    const name = "wireframe()";
    const material =
      (_scene.getMaterialByName(name) as StandardMaterial) ||
      new StandardMaterial(name, _scene);
    material.wireframe = true;
    mesh.material = material;
    return mesh;
  };
}

export function reflection(): PanOperator {
  return (_scene: PanScene, mesh: Mesh) => {
    _scene.initializers.push((_scene: PanScene) => {
      const name = `reflection([${mesh.position.toString}]).${mesh.name}`;
      const probe = new ReflectionProbe(name, 256, _scene);
      probe.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
      probe.position = mesh.position;
      _scene.meshes.forEach(
        (sceneMesh) => sceneMesh !== mesh && probe.renderList.push(sceneMesh)
      );
      // TODO: do not overwrite all instances of this material
      (mesh.material as PBRMaterial).reflectionTexture = probe.cubeTexture;
    });
    return mesh;
  };
}

export const COLOR_WHITE = [1, 1, 1];

export function material(color = COLOR_WHITE): PanOperator {
  return (_scene: PanScene, mesh: Mesh) => {
    const $color = JSON.stringify(color);
    const $position = JSON.stringify(mesh.position.asArray());
    const name = `material(${$color},${$position}).${mesh.name}`;
    const material =
      (_scene.getMaterialByName(name) as PBRMaterial) ||
      new PBRMaterial(name, _scene);
    material.albedoColor = new Color3(...color);
    material.metallic = 0;
    material.roughness = 1;
    _scene.initializers.push(() => {
      material.reflectionTexture = _scene.blurredReflectionTexture;
    });
    mesh.material = material;
    mesh.name = name;
    return mesh;
  };
}

export function metallic(value = 1): PanOperator {
  return (_scene: PanScene, mesh: Mesh) => {
    const name = `metallic(${value}).${mesh.name}`;
    (mesh.material as PBRMaterial).metallic = value;
    mesh.name = name;
    return mesh;
  };
}

export function roughness(value = 1): PanOperator {
  return (_scene: PanScene, mesh: Mesh) => {
    const name = `roughness(${value}).${mesh.name}`;
    (mesh.material as PBRMaterial).roughness = value;
    mesh.name = name;
    return mesh;
  };
}

export function microsurface(value = 1): PanOperator {
  return (_scene: PanScene, mesh: Mesh) => {
    const name = `microsurface(${value}).${mesh.name}`;
    (mesh.material as PBRMaterial).microSurface = value;
    mesh.name = name;
    return mesh;
  };
}

export function opacity(value = 1): PanOperator {
  return (_scene: PanScene, mesh: Mesh) => {
    const name = `visibility(${value}).${mesh.name}`;
    mesh.visibility = value;
    mesh.name = name;
    return mesh;
  };
}
