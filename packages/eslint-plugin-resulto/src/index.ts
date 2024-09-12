import packageJson from "../package.json"
import recommended from "./configs/recommended"
import mustUseResult from "./rules/must-use-result"

import type { Linter } from "@typescript-eslint/utils/ts-eslint"

export default {
  configs: {
    recommended
  },
  meta: {
    name: packageJson.name,
    version: packageJson.version
  },
  rules: {
    "must-use-result": mustUseResult
  }
} satisfies Linter.Plugin
