import { REFLECT_TEMPLATE } from "./reflect";

addEventListener("fetch", (event) => {
  (event as any).respondWith(
    (async function () {
      const { request } = event as any;
      const url = new URL(request.url);

      if (url.pathname === "/" && request.method === "POST") {
        const formData = await request.formData();
        const scriptSrc = formData.get("script_src");
        const scene = formData.get("scene");
        const position = JSON.parse(formData.get("position") || false);
        const rotation = JSON.parse(formData.get("rotation") || false);
        if (!scriptSrc || !scene) {
          return new Response("script_src and scene are required parameters");
        }
        return new Response(
          REFLECT_TEMPLATE.replace("// SCRIPT_SRC", scriptSrc)
            .replace("// SCENE", scene)
            .replace(
              "// POSITION",
              position
                ? `
                    _scene.cameras[0].position.x = ${position[0]}
                    _scene.cameras[0].position.y = ${position[1]}
                    _scene.cameras[0].position.z = ${position[2]}
                  `
                : ""
            )
            .replace(
              "// ROTATION",
              rotation
                ? `
                    _scene.cameras[0].rotation.x = ${rotation[0]}
                    _scene.cameras[0].rotation.y = ${rotation[1]}
                    _scene.cameras[0].rotation.z = ${rotation[2]}
                  `
                : ""
            ),
          {
            headers: { "Content-Type": "text/html" },
          }
        );
      }

      return fetch(request);
    })()
  );
});
