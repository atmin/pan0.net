# pan0.net

## Warning! Right now, it's just an experiment

## What

`pan0.net` is a CDN and a MIT-licensed library for rapid creation of interlinked, interactive 3D scenes.

Focus is on ease of use, consistency and sensible defaults, without sacrificing performance and advanced capabilities.

## Features

- available on global CDN (Cloudflare) or as an NPM package
- dynamically download only what you use (in CDN mode)
- high-level, compact, declarative scene code
- fully typed, get editor hints and inline documentation
- powered by [BabylonJS](https://www.babylonjs.com/)
- integrated bi-directional source⇔visual editor. Add `?edit` to any scene URL
- integrated debugger. Add `?debug` to any scene URL

<!--
## Examples

### Minimal

On [most browsers](https://caniuse.com/?search=modules), a scene can be HTML file of single `script` tag:

```html
<script type="module">
  import 'https://pan0.net/latest/main.js'; // TODO: remove the "/main.js" part
  scene(box()).render();
</script>
```

[(TODO image of minimal scene)](https://pan0.net/examples/readme-minimal-example.html)

<!--
### Capability demonstration, annotated

Recommended production usage, a scene of HTML file of two `script` tags:

```html
<!--Bootstrap the library from the CDN, use `latest` version or pin one.
    Each global function or chain method dynamically imports capabilities--/>
<script src="https://pan0.net/latest"></script>

<!--The scene is a single function call--/>
<script>
  scene(
    box() // A box with autogenerated name (no parameter)
      .size(1.5) // 1.5m size of each dimension, thus a cube (default 1)
      .position([5, 5, 0.5]) // Center position in meters (default [0, 0, 0])
      // Front texture. There's also back, left, right, top, bottom
      .front(
        // Create dynamic texture. Or you can `fetch('url_of_image')`
        // TODO: work on text(), convert pixels to [0..1] for resolution independence
        canvas(
          text().content('Click red circle below'),
          circle('circle') // A circle with name="circle"
            .position([128, 128]) // Center position in pixels
            .radius(120) // Radius in pixels
            .fill('red') // Fill in red
            .stroke('orange') // Stroke in orange
            .strokeWidth(3) // Stroke width in pixels
        ).size(256) // Size of canvas square in pixels (default 512)
      ),

    gltf('bunny') // A GLTF object with name="bunny"
      .fetch('https://pan0.net/assets/stanford-bunny.gltf') // Load from URL
      .href('https://pan0.net') // Make it link to
  )
    // An event handler
    .onClick(() => {
      // Check object, that triggered this event is "circle"
      if (scene.object.name === 'circle') {
        // "circle" triggers color change on another object
        // `scene.objects.get(name)` returns mutable object
        scene.objects.get('bunny').color('red');
      }
    })

    // `scene` chain ends with .render(), creates full-size canvas. Use iframe to embed a scene
    .render();
</script>
```

[(TODO image of capabilities scene)](https://pan0.net/examples/readme-capabilities-example.html)

### Usage as NPM module (TODO)

```shell
npm install --save pan0.net
```

Then:

```js
import { box } from 'pan0.net/objects';
import { scene } from 'pan0.net/scene';

scene(box()).render();
```
-->

If you bundle, your bundler of choice must be capable of code-splitting. [`import` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports) is used liberally.

### Examples

(NB automatic tests will use these examples to prevent regressions)

#### Primitives

- [Hello, world](https://pan0.net/examples/hello-world.html)
- [Three balls, different PBR materials](https://pan0.net/examples/materials.html)

#### External resources

- [Sponza scene, loaded from large gltf](https://pan0.net/examples/gltf-sponza.html)

#### Events

- [Pointer events](https://pan0.net/examples/pointer-events.html)
