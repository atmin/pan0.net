export const REFLECT_TEMPLATE = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      html,
      body {
        overflow: hidden;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }
      canvas {
        width: 100%;
        height: 100%;
        touch-action: none;
      }
      #panfps {
        position: absolute;
        top: 1vh;
        left: 1.6vh;
        font-family: sans-serif;
        font-size: 1.5vmax;
        line-height: 1.5vmax;
        color: black;
        text-decoration: none;
        opacity: 0.5;
        text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
      }
    </style>
  </head>
  <body>
    <canvas></canvas>
    <span id="panfps">♾️</span>
    <script src="// SCRIPT_SRC"></script>
    <script>
      pan().global()
      window._scene = // SCENE
      // POSITION
      // ROTATION
    </script>
  </body>
</html>
`;
