import { ESLintUtils } from "@typescript-eslint/utils"
import { TSESTree } from "@typescript-eslint/utils"

import type { TypeReference } from "typescript"

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
    const typeChecker = parserServices.program.getTypeChecker()

    return {
      CallExpression(node) {
        const tsNodeMap = parserServices.esTreeNodeToTSNodeMap.get(node)
        const type = typeChecker.getTypeAtLocation(tsNodeMap)

        const symbol = type.getSymbol()

        if (!symbol) {
          return
        }

        let symbolToCheck = typeChecker.symbolToString(symbol)

        if (symbolToCheck == "Promise") {
          const resolvedSymbol = (type as TypeReference)?.typeArguments?.[0]
            ?.symbol

          if (!resolvedSymbol) {
            return
          }

          symbolToCheck = typeChecker.symbolToString(resolvedSymbol)
        }

        if (symbolToCheck != "Result" && symbolToCheck != "AsyncResult") {
          return
        }

        if (
          isReturnedOrAssigned(node, node.parent) ||
          (node.parent.type == "AwaitExpression" &&
            isReturnedOrAssigned(node.parent, node.parent.parent))
        ) {
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

function isReturnedOrAssigned(
  node: TSESTree.CallExpression | TSESTree.AwaitExpression,
  parent: TSESTree.Node
) {
  return (
    (parent.type == "VariableDeclarator" && parent.init == node) ||
    (parent.type == "ReturnStatement" && parent.argument == node)
  )
}

export default rule
