import { ESLintUtils } from '@typescript-eslint/utils';

var recommended = {
  plugins: ["resulto"],
  rules: {
    "resulto/must-use-result": "error"
  }
};

const ruleCreator = ESLintUtils.RuleCreator(
  (name) => `https://github.com/adjsky/resulto/tree/master/packages/eslint-plugin-resulto/docs/rules/${name}`
);
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
    const parserServices = ESLintUtils.getParserServices(context);
    const typeChecker = parserServices.program.getTypeChecker();
    return {
      CallExpression(node) {
        const tsNodeMap = parserServices.esTreeNodeToTSNodeMap.get(node);
        const type = typeChecker.getTypeAtLocation(tsNodeMap);
        const name = typeChecker.getFullyQualifiedName(type.symbol);
        if (name != "Result" && name != "AsyncResult") {
          return;
        }
        const { parent } = node;
        if ((parent == null ? void 0 : parent.type) === "VariableDeclarator" && parent.init === node || (parent == null ? void 0 : parent.type) === "ReturnStatement" && parent.argument === node) {
          return;
        }
        context.report({
          messageId: "mustUse",
          node
        });
      }
    };
  }
});

var index = {
  configs: {
    recommended
  },
  rules: {
    "must-use-result": rule
  }
};

export { index as default };
