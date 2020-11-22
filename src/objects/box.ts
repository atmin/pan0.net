import type { Scene as BabylonScene } from '@babylonjs/core/scene';

/**
 * Create a box.
 * @param size
 *   nothing: 1 meter cube
 *   integer: cube of `size` meters
 *   [x, y, z]: box of specified sizes
 *
 */
export function box(size: number | [number, number, number] = 1) {
  const promise = import(
    /* webpackChunkName: "sceneObject" */ './sceneObject'
  ).then(({ sceneObject, Vector3, MeshBuilder }) => ({
    ...sceneObject,

    meshCreator(scene: BabylonScene) {
      const mesh = MeshBuilder.CreateBox(
        `box(${JSON.stringify(size)})`,
        {
          ...(typeof size === 'number' && { size }),
          ...(Array.isArray(size) && {
            width: size[0],
            height: size[1],
            depth: size[2],
          }),
        },
        scene
      );
      mesh.position =
        typeof size === 'number'
          ? new Vector3(size / 2, size / 2, size / 2)
          : new Vector3(size[0] / 2, size[1] / 2, size[2] / 2);
      return mesh;
    },
  }));
  (promise as any).position = function (...args) {
    this.then((r) => r.position(...args));
    return this;
  };
  return promise;
  // const { sceneObject, Vector3, MeshBuilder } = await promise;
  // return {
  //   ...sceneObject,

  //   meshCreator(scene: BabylonScene) {
  //     const mesh = MeshBuilder.CreateBox(
  //       `box(${JSON.stringify(size)})`,
  //       {
  //         ...(typeof size === 'number' && { size }),
  //         ...(Array.isArray(size) && {
  //           width: size[0],
  //           height: size[1],
  //           depth: size[2],
  //         }),
  //       },
  //       scene
  //     );
  //     mesh.position =
  //       typeof size === 'number'
  //         ? new Vector3(size / 2, size / 2, size / 2)
  //         : new Vector3(size[0] / 2, size[1] / 2, size[2] / 2);
  //     return mesh;
  //   },
  // };
}
