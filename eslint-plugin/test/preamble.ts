import type {
  InvalidTestCase,
  ValidTestCase,
} from "@typescript-eslint/rule-tester";

const preamble = `
import {
  type AsyncResult,
  Err,
  err,
  errAsync,
  Ok,
  ok,
  okAsync,
  type Result,
} from "../../core/mod.ts";

const noop = () => {};
`.trim();

export function withPreamble<
  T extends ValidTestCase<unknown[]> | InvalidTestCase<string, unknown[]>,
>(tests: T[]) {
  return tests.map((test) => {
    const testObject = typeof test == "string" ? { code: test } : test;

    return {
      ...testObject,
      code: `${preamble}\n\n${testObject.code.trim()}`,
    };
  }) as T[];
}
