import path from "node:path"
import { fileURLToPath } from "node:url"

import { includeIgnoreFile } from "@eslint/compat"
import js from "@eslint/js"
import prettier from "eslint-plugin-prettier/recommended"
import globals from "globals"
import ts from "typescript-eslint"

const baseDirectory = path.dirname(fileURLToPath(import.meta.url))

export default ts.config(
  includeIgnoreFile(path.resolve(baseDirectory, ".gitignore")),
  {
    ignores: ["dist"]
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.node
      },

      ecmaVersion: 2022,
      sourceType: "module",

      parserOptions: {
        project: true
      }
    },

    rules: {
      "prettier/prettier": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false
        }
      ]
    }
  }
)
