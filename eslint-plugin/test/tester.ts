import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "@std/testing/bdd";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

export const tester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts"],
      },
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
