import { FlatConfig } from "@typescript-eslint/utils/ts-eslint"

import { name, version } from "../package.json"
import mustUseResult from "./rules/must-use-result"

const plugin = {
  configs: {
    get recommended() {
      return recommended
    }
  },
  meta: {
    name,
    version
  },
  rules: {
    "must-use-result": mustUseResult
  }
} satisfies FlatConfig.Plugin

const recommended: FlatConfig.Config = {
  name: "resulto:recommended",
  plugins: {
    resulto: plugin
  },
  rules: {
    "resulto/must-use-result": "error"
  }
}

export default plugin
