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
  valid: [{ code: "" }],
  invalid: [
    {
      code: injectCode(`ok(5)`),
      errors: [
        {
          messageId: "mustUse"
        }
      ]
    },
    {
      code: injectCode(`
function get() {
  return ok(4)
}

get()
`),
      errors: [
        {
          messageId: "mustUse"
        }
      ]
    }
  ]
})
