import { ESLintUtils } from "@typescript-eslint/utils";

import type {
  ParserServicesWithTypeInformation,
  TSESTree,
} from "@typescript-eslint/utils";
import type { TypeChecker, TypeReference } from "typescript";

const ruleCreator = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/adjsky/resulto/tree/master/docs/eslint/${name}.md`,
);

const rule = ruleCreator({
  name: "must-use-result",
  meta: {
    docs: {
      description: "Result must be used to make sure errors are handled.",
    },
    type: "problem",
    messages: {
      mustUse: "`Result` may be an `Err` variant, which should be handled.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    const typeChecker = parserServices.program.getTypeChecker();

    return {
      "CallExpression,NewExpression"(
        node: TSESTree.CallExpression | TSESTree.NewExpression,
      ) {
        if (!isResult(node, parserServices, typeChecker)) {
          return;
        }

        if (isReturnedOrAssigned(node)) {
          return;
        }

        if (isMatched(node)) {
          return;
        }

        context.report({
          messageId: "mustUse",
          node,
        });
      },
    };
  },
});

function isResult(
  node: TSESTree.Node,
  parserServices: ParserServicesWithTypeInformation,
  typeChecker: TypeChecker,
) {
  const tsNodeMap = parserServices.esTreeNodeToTSNodeMap.get(node);
  const type = typeChecker.getTypeAtLocation(tsNodeMap);

  const symbol = type.getSymbol() ?? type.aliasSymbol;

  if (!symbol) {
    return false;
  }

  let symbolToCheck = typeChecker.symbolToString(symbol);

  if (symbolToCheck == "Promise") {
    const typeArgument = (type as TypeReference).typeArguments?.[0];

    if (!typeArgument) {
      return false;
    }

    const resolvedSymbol = typeArgument.getSymbol() ??
      typeArgument.aliasSymbol;

    if (!resolvedSymbol) {
      return false;
    }

    symbolToCheck = typeChecker.symbolToString(resolvedSymbol);
  }

  return (
    symbolToCheck == "Result" ||
    symbolToCheck == "AsyncResult" ||
    symbolToCheck == "Ok" ||
    symbolToCheck == "Err"
  );
}

function isReturnedOrAssigned(node: TSESTree.Node) {
  const { parent } = node;

  if (parent?.type == "AwaitExpression") {
    return isReturnedOrAssigned(parent);
  }

  if (
    parent?.type == "MemberExpression" ||
    (node.type == "MemberExpression" && parent)
  ) {
    return isReturnedOrAssigned(parent);
  }

  if (
    parent?.type == "LogicalExpression" ||
    parent?.type == "ConditionalExpression"
  ) {
    return isReturnedOrAssigned(parent);
  }

  return (
    (parent?.type == "VariableDeclarator" && parent.init == node) ||
    (parent?.type == "AssignmentExpression" && parent.right == node) ||
    (parent?.type == "ReturnStatement" && parent.argument == node) ||
    (parent?.type == "ArrowFunctionExpression" && parent.body == node) ||
    isArgument(node)
  );
}

function isArgument(node: TSESTree.Node) {
  const { parent } = node;

  return (
    parent?.type == "CallExpression" ||
    parent?.type == "ArrayExpression" ||
    (parent?.type == "Property" && parent.parent.type == "ObjectExpression")
  );
}

function isMatched({ parent }: TSESTree.Node) {
  if (
    parent?.type == "MemberExpression" &&
    parent.property.type == "Identifier" &&
    (parent.property.name == "match" ||
      parent.property.name == "asyncMatch")
  ) {
    return true;
  }

  if (!parent) {
    return false;
  }

  return isMatched(parent);
}

export default rule;
