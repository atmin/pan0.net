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
      #panlogo {
        position: absolute;
        top: 1vh;
        left: 1.6vh;
        font-family: sans-serif;
        font-size: 2.5vmax;
        line-height: 2.5vmax;
        color: black;
        text-decoration: none;
        opacity: 0.5;
        text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
      }
      #panfps {
        display: inline-block;
        text-align: center;
        font-size: 1.4vmax;
        width: 2.5vmax;
        height: 2.5vmax;
        border: 1px solid #fff;
        border-radius: 50%;
        margin-left: 0.25vmax;
        vertical-align: middle;
        position: relative;
        text-shadow: none;
      }
      #panfps::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 0.2vmax solid #000;
        border-radius: 50%;
      }
    </style>
  </head>
  <body>
    <canvas></canvas>
    <a id="panlogo" href="https://pan0.com" target="_blank">
      pan<span id="panfps"></span>
    </a>
    <script src="// SCRIPT_SRC"></script>
    <script>
      pan().global()
      // SCENE
      // POSITION
      // ROTATION
    </script>
  </body>
</html>
`;
