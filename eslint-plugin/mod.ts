import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import denoJson from "./deno.json" with { type: "json" };
import mustUseResult from "./rules/must_use_result.ts";

const plugin: FlatConfig.Plugin = {
  configs: {
    get recommended() {
      return recommended;
    },
  },
  meta: {
    name: "eslint-plugin-resulto",
    version: denoJson.version,
  },
  rules: {
    "must-use-result": mustUseResult,
  },
};

const recommended: FlatConfig.Config = {
  name: "name/recommended",
  plugins: {
    resulto: plugin,
  },
  rules: {
    "resulto/must-use-result": "error",
  },
};

export default plugin;
