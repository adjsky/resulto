import { build, emptyDir } from "@deno/dnt";
import denoJson from "./deno.json" with { type: "json" };

await emptyDir("./npm");

await build({
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    shims: {},
    test: false,
    package: {
        name: "eslint-plugin-resulto",
        version: denoJson.version,
        description: "ESLint plugin for resulto",
        author: "adjsky",
        repository: {
            "type": "git",
            "url": "git+https://github.com/adjsky/resulto.git",
        },
        keywords: [
            "result",
            "rust",
            "eslint",
            "plugin",
        ],
        license: "MIT",
        peerDependencies: {
            "@typescript-eslint/parser": "8.x",
        },
        dependencies: {
            "@typescript-eslint/utils": "^8.5.0",
        },
    },
    postBuild() {
        Deno.copyFileSync("../LICENSE", "npm/LICENSE");
        Deno.copyFileSync("README.md", "npm/README.md");
    },
});
