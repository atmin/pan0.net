import box from './box'
import ground from './ground'
import lights from './lights'
import render from './render'
import scene from './scene'
import sphere from './sphere'

render(
  document.querySelector(
    'canvas',
  ) as HTMLCanvasElement,

  scene(
    lights([
      { type: 'directional' },
      { type: 'hemispheric' },
    ]),

    ground(),

    sphere(2)
      .translate([0, 0, 2])
      .color([1.5, 1, 0.7])
      .metallic(1)
      .roughness(0)
      .env_snapshot(),

    box(0.5)
      .translate([-1, 0.1, -2])
      .color([0.5, 1, 0.5]),
    // .metallic(0)
    // .roughness(1),

    box()
      .translate([0, 0.1, 0])
      .color([1, 0.5, 1]),

    ...[1, 1.5, 2, 2.5, 3, 3.5].map(
      (a, i) =>
        box(a)
          .translate([
            a * 4 * (i % 2 ? -1 : 1),
            i % 2 ? 0 : 0.1,
            0,
          ])
          .color([a / 4, i / 5, 0]),
    ),
  ),
)
