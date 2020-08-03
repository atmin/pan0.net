import box from './box'
import lights from './lights'
import render from './render'
import scene from './scene'

render(
  document.querySelector(
    'canvas',
  ) as HTMLCanvasElement,
  scene(
    lights([
      { type: 'directional' },
      { type: 'hemispheric' },
    ]),
    box()
      .translate([0, 0.5, 0])
      .color([0.5, 1, 0.5])
      .env_snapshot(),
  ),
)
