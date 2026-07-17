import { build, emptyDir } from "@deno/dnt";
import denoJson from "./deno.json" with { type: "json" };

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {},
  test: false,
  package: {
    name: "resulto",
    version: denoJson.version,
    description:
      "A Rust-inspired Result and Option library for writing more correct TypeScript, with an ESLint plugin that helps catch ignored results.",
    author: "adjsky",
    repository: {
      "type": "git",
      "url": "git+https://github.com/adjsky/resulto.git",
    },
    keywords: [
      "result",
      "rust",
    ],
    license: "MIT",
  },
  postBuild() {
    Deno.copyFileSync("../LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
