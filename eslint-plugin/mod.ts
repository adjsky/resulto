import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import { version } from "./deno.json" with { type: "json" };
import mustUseResult from "./rules/must-use-result.ts";

const plugin = {
  configs: {
    get recommended() {
      return recommended;
    },
  },
  meta: {
    name: "eslint-plugin-resulto",
    version,
  },
  rules: {
    "must-use-result": mustUseResult,
  },
} satisfies FlatConfig.Plugin;

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
