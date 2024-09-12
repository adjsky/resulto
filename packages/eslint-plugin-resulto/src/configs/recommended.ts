import type { ClassicConfig } from "@typescript-eslint/utils/ts-eslint"

export default {
  plugins: ["resulto"],
  rules: {
    "resulto/must-use-result": "error"
  }
} satisfies ClassicConfig.Config
