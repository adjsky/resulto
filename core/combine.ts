import { chain } from "./chain.js";
import {
  type AsyncOption,
  None,
  none,
  type Option,
  Some,
  some,
} from "./option.ts";
import {
  type AsyncResult,
  Err,
  err,
  // deno-lint-ignore no-unused-vars -- used in jsdoc
  type Ok,
  ok,
  type Result,
} from "./result.ts";

export type UnwrapOks<
  T extends readonly (
    | Result<unknown, unknown>
    | AsyncResult<unknown, unknown>
  )[],
> = {
  [i in keyof T]: T[i] extends Result<infer U, unknown> ? U
    : T[i] extends AsyncResult<infer U, unknown> ? U
    : never;
};

export type UnwrapErrs<
  T extends readonly (
    | Result<unknown, unknown>
    | AsyncResult<unknown, unknown>
  )[],
> = {
  [i in keyof T]: T[i] extends Result<unknown, infer U> ? U
    : T[i] extends AsyncResult<unknown, infer U> ? U
    : never;
};

export type UnwrapOptions<
  T extends readonly (Option<unknown> | AsyncOption<unknown>)[],
> = {
  [i in keyof T]: T[i] extends Option<infer U> ? U
    : T[i] extends AsyncOption<infer U> ? U
    : never;
};

/**
 * Accepts an array of {@link Result}s and returns a Result.
 *
 * If each Result in the provided array is {@link Ok}, then the returned
 * Result will contain an array of Ok values, otherwise the
 * returned Result will contain the first {@link Err} error.
 *
 * @example
 *
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { combine, err, ok } from "@resulto/core";
 *
 * const a = combine([ok(1), ok("two")]);
 * assertEquals(a, ok([1, "two"]));
 *
 * const b = combine([ok(1), err("some error message")]);
 * assertEquals(b, err("some error message"));
 *
 * const c = combine([ok(1), err("error a"), err("error b")]);
 * assertEquals(c, err("error a"));
 * ```
 */
export function combine<T extends readonly Result<unknown, unknown>[]>(
  results: [...T],
): Result<UnwrapOks<T>, UnwrapErrs<T>[number]>;

/**
 * Accepts an array of {@link Option}s and returns an Option.
 *
 * If each Option in the provided array is {@link Some}, then the returned
 * Option will contain an array of Some values, otherwise the returned Option
 * will contain {@link None}.
 *
 * @example
 *
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { combine, none, some } from "@resulto/core";
 *
 * const a = combine([some(1), some("two")]);
 * assertEquals(a, some([1, "two"]));
 *
 * const b = combine([some(1), none()]);
 * assertEquals(b, none());
 * ```
 */
export function combine<T extends readonly Option<unknown>[]>(
  options: [...T],
): Option<UnwrapOptions<T>>;

export function combine(
  resultsOrOptions: (Result<unknown, unknown> | Option<unknown>)[],
): Result<unknown, unknown> | Option<unknown> {
  const unwrapped = [];

  for (const resultOrOption of resultsOrOptions) {
    if (resultOrOption instanceof Err) {
      return err(resultOrOption.error);
    }

    if (resultOrOption instanceof None) {
      return none();
    }

    unwrapped.push(resultOrOption.value);
  }

  if (resultsOrOptions[0] instanceof Some) {
    return some(unwrapped);
  } else {
    return ok(unwrapped);
  }
}

/**
 * Similar to {@link combine} but also accepts {@link AsyncResult}.
 *
 * @example
 *
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { combineAsync, err, errAsync, ok, okAsync } from "@resulto/core";
 *
 * const a = await combineAsync([okAsync(1), okAsync("two")]);
 * assertEquals(a, ok([1, "two"]));
 *
 * const b = await combineAsync([okAsync(1), errAsync("some error message")]);
 * assertEquals(b, err("some error message"));
 *
 * const c = await combineAsync([okAsync(1), errAsync("err a"), errAsync("err b")]);
 * assertEquals(c, err("err a"));
 * ```
 */
export function combineAsync<
  T extends readonly (
    | Result<unknown, unknown>
    | AsyncResult<unknown, unknown>
  )[],
>(results: [...T]): AsyncResult<UnwrapOks<T>, UnwrapErrs<T>[number]>;

/**
 * Similar to {@link combine} but also accepts {@link AsyncOption}.
 *
 * @example
 *
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { combineAsync, none, noneAsync, some, someAsync } from "@resulto/core";
 *
 * const a = await combineAsync([someAsync(1), someAsync("two")]);
 * assertEquals(a, some([1, "two"]));
 *
 * const b = await combineAsync([someAsync(1), noneAsync()]);
 * assertEquals(b, none());
 * ```
 */
export function combineAsync<
  T extends readonly (Option<unknown> | AsyncOption<unknown>)[],
>(
  options: [...T],
): AsyncOption<UnwrapOptions<T>>;

export function combineAsync(
  resultsOrOptions: (
    | Result<unknown, unknown>
    | AsyncResult<unknown, unknown>
    | Option<unknown>
    | AsyncOption<unknown>
  )[],
) {
  return chain(Promise.all(resultsOrOptions).then(combine));
}
