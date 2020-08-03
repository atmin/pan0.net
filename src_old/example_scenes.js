scene(
  camera().on(KeyboardEvent, event =>
    event.code === KEY_W
      ? camera.translate([0, 0, 1])
      : event.code === KEY_S
      ? camera.translate([0, 0, -1])
      : event.code === KEY_A
      ? camera.translate([-1, 0, 0])
      : event.code === KEY_D
      ? camera.translate([1, 0, 0])
      : null
  ),

  box()
    .env_snapshot()
    .albedo_color(LIGHT_GREEN)
    .metallic(1)
    .roughness(0.1)
    .opacity(0.4),

  alias(
    "moving_sphere",
    sphere()
      .env_snapshot()
      .on(TickEvent, event =>
        sphere.translate([
          Math.sin(event.timestamp),
          0,
          0
        ])
      )
  ),

  range(100).map(i =>
    alias("moving_sphere").position([
      i / 2,
      0,
      0
    ])
  ),

  range(100).map(i =>
    alias("moving_sphere").position([
      0,
      i / 2,
      0
    ])
  )
)
