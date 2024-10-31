import denoJson from "./deno.json" with { type: "json" };
import { $ } from "@david/dax";

for (const cwd of denoJson.workspace) {
  await $`cd ${cwd} && deno run -A ./build_npm.ts`;
  await $`cd ${cwd}/npm && npm publish`;
}
