'use strict';

var utils = require('@typescript-eslint/utils');

var recommended = {
  plugins: ["resulto"],
  rules: {
    "resulto/must-use-result": "error"
  }
};

const rule = utils.ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: "Result must be used to make sure errors are handled."
    },
    type: "problem",
    messages: {
      mustUse: "Result must be used, handle it with either unwrap, expect or match"
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    const parserServices = utils.ESLintUtils.getParserServices(context);
    return {
      "NewExpression,CallExpression"(node) {
        const internalSymbol = parserServices.getTypeAtLocation(node).getProperty("__internal_resulto");
        if (!internalSymbol) {
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

module.exports = index;
