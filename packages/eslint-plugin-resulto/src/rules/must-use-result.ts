import { ESLintUtils } from "@typescript-eslint/utils"

import type { TSESTree } from "@typescript-eslint/utils"

const ruleCreator = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/adjsky/resulto/tree/master/packages/eslint-plugin-resulto/docs/rules/${name}`
)

const rule = ruleCreator({
  name: "must-use-result",
  meta: {
    docs: {
      description: "Result must be used to make sure errors are handled."
    },
    type: "problem",
    messages: {
      mustUse: "`Result` may be an `Err` variant, which should be handled."
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context)

    return {
      "NewExpression,CallExpression"(node: TSESTree.Node) {
        const internalSymbol = parserServices
          .getTypeAtLocation(node)
          .getProperty("__internal_resulto")

        if (!internalSymbol) {
          return
        }

        context.report({
          messageId: "mustUse",
          node
        })
      }
    }
  }
})

export default rule
