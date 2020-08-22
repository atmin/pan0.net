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

  let total = 0;
  let failed = 0;
  let passed = 0;
  let ignored = 0;
  let new_ = 0;

  for (let scene of test_scenes) {
    total++;

    if (scene.startsWith("//")) {
      console.warn("Ignored scene ", scene);
      ignored++;
      continue;
    }

    const shot: any = await obtain_snapshot(scene);
    delete shot.useDelayedTextureLoading;
    collected[scene] = shot;

    if (!snapshots[scene]) {
      console.warn("New snapshot for ", scene);
      new_++;
      continue;
    }

    const diff = jiff.diff(snapshots[scene], shot);
    if (diff.length) {
      console.error(scene);
      console.log(diff);
      failed++;
      continue;
    }

    passed++;
    continue;
  }

  const all = { ...snapshots, ...collected };
  (window as any).snapshots = {
    ts: `// DO NOT EDIT. Auto-generated test snapshots file. From JS console:
// tests() -> run tests
// copy(snapshots.ts) -> copies snapshots to clipboard, paste into this file

export default ${JSON.stringify(all, null, 2)}`
  };

  console.log("total: ", total);
  console.log("failed: ", failed);
  console.log("passed: ", passed);
  console.log("ignored: ", ignored);
  console.log("new: ", new_);

  if (failed || new_) {
    console.log("Type `copy(snapshots.ts)` to copy new snapshots");
  }

  return all;
};
