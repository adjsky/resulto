import { ESLintUtils } from "@typescript-eslint/utils"

import type { TSESTree } from "@typescript-eslint/utils"

const rule = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: "Result must be used to make sure errors are handled."
    },
    type: "problem",
    messages: {
      mustUse:
        "Result must be used, handle it with either unwrap, expect or match"
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
