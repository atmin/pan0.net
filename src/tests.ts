import * as jiff from "jiff";
import snapshots from "./snapshots";

const test_scenes = ["scene(box())", "scene(translate([1, 0, 0]).box())"];

async function obtain_snapshot(scene: string) {
  document.querySelector<HTMLInputElement>(
    '[name="script_src"]'
  ).value = document.querySelector<HTMLScriptElement>("#pan_script").src;
  document.querySelector("textarea").value = scene;
  document.querySelector<HTMLInputElement>("input[name=position]").value = "";
  document.querySelector<HTMLInputElement>("input[name=rotation]").value = "";
  document.querySelector("form").submit();
  const result = await new Promise(resolve => {
    document.querySelector("iframe").onload = () => {
      document.querySelector("iframe").onload = null;
      const { snapshot } = document.querySelector("iframe")
        .contentWindow as any;
      resolve(snapshot());
    };
  });
  return result;
}

(window as any).tests = async () => {
  const collected = {};
  for (let scene of test_scenes) {
    if (scene.startsWith("//")) {
      // Disabled test, just copy old snapshot
      collected[scene] = snapshots[scene] || {};
      continue;
    }

    const shot: any = await obtain_snapshot(scene);
    delete shot.useDelayedTextureLoading;
    collected[scene] = shot;

    if (!snapshots[scene]) {
      console.warn("New snapshot for ", scene);
      continue;
    }

    const diff = jiff.diff(snapshots[scene], shot);
    if (diff.length) {
      console.error(scene, diff);
    }
  }
  (window as any).snapshots = {
    ts: `// DO NOT EDIT. Auto-generated test snapshots file. From JS console:
// tests() -> run tests
// copy(snapshots.ts) -> copies snapshots to clipboard, paste into this file

export default ${JSON.stringify(collected, null, 2)}`
  };

  return collected;
};
