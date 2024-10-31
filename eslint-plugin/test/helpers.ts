import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "@std/testing/bdd";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

export const tester = new RuleTester({
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: `${import.meta.dirname}/fixture`,
      project: "./tsconfig.json",
    },
  },
});

export function trimLeadingIndent(str: string) {
  const matched = str.match(/^[\r\n]?(\s+)/);

  if (!matched) {
    return str;
  }

  return str.replace(new RegExp("^" + matched[1], "gm"), "").trim();
}
