# pan0.net

## Warning! Right now, it's just an experiment

## What

`pan0.net` is a CDN and a MIT-licensed library for rapid creation of interlinked, interactive 3D scenes.

Each scene is an HTML file consisting of two `script` tags:

```html
<!-- Bootstrap the library from the CDN, use `latest` version or pin one -->
<script src="https://pan0.net/latest"></script>

<!-- The scene is a single function call -->
<script>
  scene(
    // A box, that triggers color change of another object
    box().position([5, 5, 0.5]).id('box'),

    // GLTF loaded from URL
    gltf(fetch('https://pan0.net/assets/stanford-bunny.gltf'))
      .id('bunny')
      .href('https://pan0.net'),
  )
    // An event handler
    .onClick(() => {
      if (scene.object.id === 'box') {
        scene.objects.get('bunny').color(COLOR_RED);
      }
    })

    // Chain ends with render(), creates full-size canvas. Use iframe to embed a scene
    .render();
</script>
```

## Features

- available on global CDN (Cloudflare) or as an NPM package
- download only what you use
- high-level, compact, declarative scene code
- powered by BabylonJS

## Examples

Examples do not work yet, but check public/examples/ directory.
