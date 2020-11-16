# pan0.net

## Warning! Right now, it's just an experiment

## What

`pan0.net` is a CDN and a MIT-licensed library for rapid creation of interlinked, interactive 3D scenes.

Each scene is an HTML file consisting of two `script` tags:

```html
<!--Bootstrap the library from the CDN, use `latest` version or pin one.
    Each global function or chain method triggers necessary imports-->
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

Or just one script tag on modern browsers, minimal example:

```html
<script type="module">
  import 'https://pan0.net/latest';
  scene(box()).render();
</script>
```

Or as an NPM module:

```shell
npm install --save pan0.net
```

```js
import box from 'pan0.net/box.js';
import scene from 'pan0.net/scene.js';

scene(box()).render();
```

## Features

- available on global CDN (Cloudflare) or as an NPM package
- download only what you use
- high-level, compact, declarative scene code
- fully typed, get editor hints and inline documentation
- powered by BabylonJS
- namespaced third party integrations

## Examples

Examples do not work yet, but check public/examples/ directory.
