import { RuleTester } from "@typescript-eslint/rule-tester"

import rule from "../src/rules/must-use-result"
import { injectCode } from "./inject-code"

const tester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: `${__dirname}/fixture`,
    project: "./tsconfig.json"
  }
})

tester.run("must-use-result", rule, {
  valid: [{ code: injectCode("") }],
  invalid: [
    {
      code: injectCode("new Ok()"),
      errors: [
        {
          messageId: "mustUse"
        }
      ]
    }
  ]
})
