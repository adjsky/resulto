import { chain } from "./chain.js";
import { UnwrapError } from "./errors.ts";

type Predicate<T> = (value: T) => boolean;
type ErrPredicate<T> = (error: T) => boolean;

type Fn<T, U> = (value: T) => U;
type ErrFn<E, F> = (error: E) => F;

/**
 * Result is a type that represents either success `Ok` or failure `Err`.
 *
 * Typically it is used for returning and propagating errors. Functions should
 * return `Result` whenever errors are expected and recoverable instead of
 * throwing errors.
 */
export interface Result<T, E> {
  /**
   * Checks if `Result` is `Ok`.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { err, ok } from "@resulto/core";
   *
   * const a = ok(-3);
   * assertEquals(a.isOk(), true);
   *
   * const b = err("some error message");
   * assertEquals(b.isOk(), false);
   * ```
   */
  isOk(): this is Ok<T, E>;

  /**
   * Checks if `Result` is `Ok` and the value inside of it matches a predicate.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { ok } from "@resulto/core";
   *
   * const a = ok(2);
   * assertEquals(a.isOkAnd((v) => v > 1), true);
   *
   * const b = ok(0);
   * assertEquals(b.isOkAnd((v) => v > 1), false);
   * ```
   */
  isOkAnd(f: Predicate<T>): boolean;

  /**
   * Checks if `Result` is `Err`.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { err, ok } from "@resulto/core";
   *
   * const a = ok(-3);
   * assertEquals(a.isErr(), false);
   *
   * const b = err("some error message");
   * assertEquals(b.isErr(), true);
   * ```
   */
  isErr(): this is Err<T, E>;

  /**
   * Checks if `Result` is `Err` and the value inside of it matches a predicate.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Result, err, ok } from "@resulto/core";
   *
   * const a: Result<number, string> = err("not_found");
   * assertEquals(a.isErrAnd((e) => e == "not_found"), true);
   *
   * const b: Result<number, string> = err("permission_denied");
   * assertEquals(b.isErrAnd((e) => e == "not_found"), false);
   *
   * const c: Result<number, string> = ok(123);
   * assertEquals(c.isErrAnd((e) => e == "not_found"), false);
   * ```
   */
  isErrAnd(f: ErrPredicate<E>): boolean;

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function `f` to a
   * contained `Ok` value, leaving an `Err` value untouched.
   *
   * This function can be used to compose the results of two functions.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { ok } from "@resulto/core";
   *
   * const a = ok(2);
   * assertEquals(a.map((v) => v * 2), ok(4));
   * ```
   */
  map<U>(f: Fn<T, U>): Result<U, E>;

  /**
   * Maps an `AsyncResult<T, E>` to `AsyncResult<U, E>` by applying a function
   * `f` to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * This function can be used to compose the results of two functions.
   *
   * Use this method instead of {@link Result.map} when the provided
   * `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { ok } from "@resulto/core";
   *
   * const a = ok(2);
   * assertEquals(await a.asyncMap((v) => Promise.resolve(v * 2)), ok(4));
   * ```
   */
  asyncMap<U>(f: Fn<T, Promise<U>>): AsyncResult<U, E>;

  /**
   * Returns the provided default `value` (if `Err`), or applies a function to
   * the contained value (if `Ok`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Result, err, ok } from "@resulto/core";
   *
   * const a: Result<string, string> = ok("foo");
   * assertEquals(a.mapOr(42, (v) => v.length), 3);
   *
   * const b: Result<string, string> = err("bar");
   * assertEquals(b.mapOr(42, (v) => v.length), 42);
   * ```
   */
  mapOr<U>(value: U, f: Fn<T, U>): U;

  /**
   * Returns the provided default `value` (if `Err`), or applies a function to
   * the contained value (if `Ok`).
   *
   * Use this method instead of {@link Result.mapOr} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Result, err, ok } from "@resulto/core";
   *
   * const a: Result<string, string> = ok("foo");
   * assertEquals(await a.asyncMapOr(42, (v) => Promise.resolve(v.length)), 3);
   *
   * const b: Result<string, string> = err("bar");
   * assertEquals(await b.asyncMapOr(42, (v) => Promise.resolve(v.length)), 42);
   * ```
   */
  asyncMapOr<U>(value: U, f: Fn<T, Promise<U>>): Promise<U>;

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying function `fallbackFn`
   * to a contained `Err` value, or function `f` to a contained `Ok` value.
   *
   * This function can be used to unpack a successful result while handling an
   * error.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Result, err, ok } from "@resulto/core";
   *
   * const a: Result<number, string> = ok(5);
   * assertEquals(a.mapOrElse((e) => e.length, (v) => v * 4), 20);
   *
   * const b: Result<number, string> = err("foo");
   * assertEquals(b.mapOrElse((e) => e.length, (v) => v * 4), 3);
   * ```
   */
  mapOrElse<U>(fallbackFn: ErrFn<E, U>, f: Fn<T, U>): U;

  /**
   * Maps an `AsyncResult<T, E>` to `Promise<U>` by applying function
   * `fallbackFn` to a contained `Err` value, or function `f` to a contained
   * `Ok` value.
   *
   * This function can be used to unpack a successful result while handling an
   * error.
   *
   * Use this method instead of {@link Result.mapOrElse} when the
   * provided `fallbackFn` or `f` return a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Result, err, ok } from "@resulto/core";
   *
   * const a: Result<number, string> = ok(5);
   * assertEquals(await a.asyncMapOrElse(
   *   (e) => Promise.resolve(e.length),
   *   (v) => Promise.resolve(v * 4)
   * ), 20);
   *
   * const b: Result<number, string> = err("foo");
   * assertEquals(await b.asyncMapOrElse(
   *   (e) => Promise.resolve(e.length),
   *   (v) => Promise.resolve(v * 4)
   * ), 3);
   * ```
   */
  asyncMapOrElse<U>(
    fallbackFn: ErrFn<E, U | Promise<U>>,
    f: Fn<T, U | Promise<U>>,
  ): Promise<U>;

  /**
   * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a
   * contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while
   * handling an error.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Result, err, ok } from "@resulto/core";
   *
   * const a: Result<number, number> = ok(2);
   * assertEquals(a.mapErr((v) => v * 2), ok(2));
   *
   * const b: Result<number, number> = err(2);
   * assertEquals(b.mapErr((v) => v * 2), err(4));
   * ```
   */
  mapErr<F>(f: ErrFn<E, F>): Result<T, F>;

  /**
   * Maps an `AsyncResult<T, E>` to `AsyncResult<T, F>` by applying a function
   * to a contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while
   * handling an error.
   *
   * Use this method instead of {@link Result.mapErr} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Result, err, ok } from "@resulto/core";
   *
   * const a: Result<number, number> = ok(2);
   * assertEquals(await a.asyncMapErr((v) => Promise.resolve(v * 2)), ok(2));
   *
   * const b: Result<number, number> = err(2);
   * assertEquals(await b.asyncMapErr((v) => Promise.resolve(v * 2)), err(4));
   * ```
   */
  asyncMapErr<F>(f: ErrFn<E, Promise<F>>): AsyncResult<T, F>;

  /**
   * Calls the provided function `f` with the contained value (if `Ok`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
   * import { ok } from "@resulto/core";
   *
   * const log = spy();
   *
   * assertEquals(ok(4).inspect(log).map((v) => v ** 3), ok(64));
   *
   * assertSpyCalls(log, 1);
   * assertSpyCall(log, 0, { args: [4] });
   * ```
   */
  inspect(f: Fn<T, void>): Result<T, E>;

  /**
   * Calls the provided function `f` with the contained error (if `Err`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
   * import { err } from "@resulto/core";
   *
   * const log = spy();
   *
   * const _ = err("failed to read file").inspectErr(log);
   *
   * assertSpyCalls(log, 1);
   * assertSpyCall(log, 0, { args: ["failed to read file"] });
   * ```
   */
  inspectErr(f: ErrFn<E, void>): Result<T, E>;

  /**
   * Performs a side effect on the contained value (if `Ok`).
   *
   * NOTE: `f` is awaited.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
   * import { ok } from "@resulto/core";
   *
   * const alert = spy(() => Promise.resolve());
   *
   * const _ = await ok(4).tap(alert);
   *
   * assertSpyCalls(alert, 1);
   * assertSpyCall(alert, 0, { args: [4] });
   * ```
   */
  tap(f: Fn<T, Promise<void>>): AsyncResult<T, E>;

  /**
   * Performs a side effect on the contained error (if `Err`).
   *
   * NOTE: `f` is awaited.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
   * import { err } from "@resulto/core";
   *
   * const alert = spy(() => Promise.resolve());
   *
   * const _ = await err("failed to read file").tapErr(alert);
   *
   * assertSpyCalls(alert, 1);
   * assertSpyCall(alert, 0, { args: ["failed to read file"] });
   * ```
   */
  tapErr(f: Fn<E, Promise<void>>): AsyncResult<T, E>;

  /**
   * Returns the contained `Ok` value.
   *
   * This function may throw {@link UnwrapError} (if `Err`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals, assertThrows } from "@std/assert";
   * import { err, ok } from "@resulto/core";
   *
   * const a = ok(2);
   * assertEquals(a.expect("value should be present"), 2);
   *
   * const b = err("emergency failure");
   * assertThrows(
   *   () => b.expect("value should be present"),
   *   "value should be present: emergency failure"
   * );
   * ```
   */
  expect(msg: string): T;

  /**
   * Returns the contained `Ok` value.
   *
   * This function may throw {@link UnwrapError} (if `Err`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals, assertThrows } from "@std/assert";
   * import { err, ok } from "@resulto/core";
   *
   * const a = ok(2);
   * assertEquals(a.unwrap(), 2);
   *
   * const b = err("emergency failure");
   * assertThrows(
   *   () => b.unwrap(),
   *   "Called `unwrap` on an `Err` value: emergency failure"
   * );
   * ```
   */
  unwrap(): T;

  /**
   * Returns the contained `Err` value.
   *
   * This function may throw {@link UnwrapError} (if `Ok`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals, assertThrows } from "@std/assert";
   * import { err, ok } from "@resulto/core";
   *
   * const a = ok(10);
   * assertThrows(
   *   () => a.expectErr("error should be present"),
   *   "error should be present: 10"
   * );
   *
   * const b = err("emergency failure");
   * assertEquals(b.expectErr("error should be present"), "emergency failure");
   * ```
   */
  expectErr(msg: string): E;

  /**
   * Returns the contained `Err` value.
   *
   * This function may throw {@link UnwrapError} (if `Ok`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals, assertThrows } from "@std/assert";
   * import { err, ok } from "@resulto/core";
   *
   * const a = ok(2);
   * assertThrows(
   *   () => a.unwrapErr(),
   *   "Called `unwrapErr` on an `Ok` value: 2"
   * );
   *
   * const b = err("emergency failure");
   * assertEquals(b.unwrapErr(), "emergency failure");
   * ```
   */
  unwrapErr(): E;

  /**
   * Returns `res` if the result is `Ok`, otherwise returns the `Err` value.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Result, err, ok } from "@resulto/core";
   *
   * const a: Result<number, string> = ok(2);
   * const b: Result<string, string> = err("late error");
   * assertEquals(a.and(b), err("late error"));
   *
   * const c: Result<number, string> = err("early error");
   * const d: Result<string, string> = ok("foo");
   * assertEquals(c.and(d), err("early error"));
   *
   * const e: Result<number, string> = ok(2);
   * const f: Result<string, string> = ok("different result type");
   * assertEquals(e.and(f), ok("different result type"));
   *
   * const g: Result<number, string> = err("not a 2");
   * const h: Result<string, string> = err("late error");
   * assertEquals(g.and(h), err("not a 2"));
   * ```
   */
  and<U>(res: Result<U, E>): Result<U, E>;

  /**
   * Calls `f` if the result is `Ok`, otherwise returns the `Err` value.
   *
   * This function can be used for control flow based on `Result` values.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { err, ok } from "@resulto/core";
   *
   * function sq(v: number) {
   *   if (v >= 1000) {
   *     return err("overflowed");
   *   }
   *   return ok(v * v);
   * }
   *
   * assertEquals(ok(2).andThen(sq), ok(4));
   * assertEquals(ok(1_000_000).andThen(sq), err("overflowed"));
   * assertEquals(err("NaN").andThen(sq), err("NaN"));
   * ```
   */
  andThen<U, F>(f: Fn<T, Result<U, F>>): Result<U, E | F>;

  /**
   * Calls `f` if the result is `Ok`, otherwise returns the `Err` value.
   *
   * This function can be used for control flow based on `AsyncResult` values.
   *
   * Use this method instead of {@link Result.andThen} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { err, errAsync, ok, okAsync } from "@resulto/core";
   *
   * function sq(v: number) {
   *   if (v >= 1000) {
   *     return errAsync("overflowed");
   *   }
   *   return okAsync(v * v);
   * }
   *
   * assertEquals(await ok(2).asyncAndThen(sq), ok(4));
   * assertEquals(await ok(1_000_000).asyncAndThen(sq), err("overflowed"));
   * assertEquals(await err("NaN").asyncAndThen(sq), err("NaN"));
   * ```
   */
  asyncAndThen<U, F>(f: Fn<T, Promise<Result<U, F>>>): AsyncResult<U, E | F>;

  /**
   * Returns `res` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Result, err, ok } from "@resulto/core";
   *
   * const a: Result<number, string> = ok(2);
   * const b: Result<number, string> = err("late error");
   * assertEquals(a.or(b), ok(2));
   *
   * const c: Result<number, string> = err("early error");
   * const d: Result<number, string> = ok(2);
   * assertEquals(c.or(d), ok(2));
   *
   * const e: Result<number, string> = ok(2);
   * const f: Result<number, string> = ok(100);
   * assertEquals(e.or(f), ok(2));
   *
   * const g: Result<number, string> = err("not a 2");
   * const h: Result<number, string> = err("late error");
   * assertEquals(g.or(h), err("late error"));
   * ```
   */
  or<F>(res: Result<T, F>): Result<T, F>;

  /**
   * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * This function can be used for control flow based on `Result` values.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { err, ok } from "@resulto/core";
   *
   * const sq = (v: number) => ok(v * v);
   * const fail = (v: number) => err(v);
   *
   * assertEquals(ok(2).orElse(sq).orElse(sq), ok(2));
   * assertEquals(ok(2).orElse(fail).orElse(sq), ok(2));
   * assertEquals(err(3).orElse(sq).orElse(fail), ok(9));
   * assertEquals(err(3).orElse(fail).orElse(fail), err(3));
   * ```
   */
  orElse<U, F>(f: ErrFn<E, Result<U, F>>): Result<U | T, F>;

  /**
   * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * This function can be used for control flow based on `AsyncResult` values.
   *
   * Use this method instead of {@link Result.orElse} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { err, errAsync, ok, okAsync } from "@resulto/core";
   *
   * const sq = (v: number) => okAsync(v * v);
   * const fail = (v: number) => errAsync(v);
   *
   * assertEquals(await ok(2).asyncOrElse(sq).asyncOrElse(sq), ok(2));
   * assertEquals(await ok(2).asyncOrElse(fail).asyncOrElse(sq), ok(2));
   * assertEquals(await err(3).asyncOrElse(sq).asyncOrElse(fail), ok(9));
   * assertEquals(await err(3).asyncOrElse(fail).asyncOrElse(fail), err(3));
   * ```
   */
  asyncOrElse<U, F>(
    f: ErrFn<E, Promise<Result<U, F>>>,
  ): AsyncResult<U | T, F>;

  /**
   * Returns the contained `Ok` value or a provided `value`.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { err, ok } from "@resulto/core";
   *
   * const a = ok(9);
   * assertEquals(a.unwrapOr(2), 9);
   *
   * const b = err("error");
   * assertEquals(b.unwrapOr(2), 2);
   * ```
   */
  unwrapOr<U>(value: U): U | T;

  /**
   * Returns the contained `Ok `value or computes it from a `f`.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Result, err, ok } from "@resulto/core";
   *
   * const a: Result<number, string> = ok(2);
   * assertEquals(a.unwrapOrElse((e) => e.length), 2);
   *
   * const b: Result<number, string> = err("foo");
   * assertEquals(b.unwrapOrElse((e) => e.length), 3);
   * ```
   */
  unwrapOrElse<U>(f: ErrFn<E, U>): U | T;

  /**
   * Returns the contained `Ok `value or computes it from a `f`.
   *
   * Use this method instead of {@link Result.unwrapOrElse} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Result, err, ok } from "@resulto/core";
   *
   * const a: Result<number, string> = ok(2);
   * assertEquals(await a.asyncUnwrapOrElse((e) => Promise.resolve(e.length)), 2);
   *
   * const b: Result<number, string> = err("foo");
   * assertEquals(await b.asyncUnwrapOrElse((e) => Promise.resolve(e.length)), 3);
   * ```
   */
  asyncUnwrapOrElse<U>(f: ErrFn<E, Promise<U>>): Promise<U | T>;

  /**
   * Calls `okFn` if the result is `Ok`, otherwise calls `errFn`.
   *
   * Both `okFn` and `errFn` must have the same return type.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Result, err, ok } from "@resulto/core";
   *
   * const a: Result<number, string> = ok(2);
   * assertEquals(a.match(
   *   (v) => v * 2,
   *   (v) => v.length
   * ), 4);
   *
   * const b: Result<number, string> = err("foo");
   * assertEquals(b.match(
   *   (v) => v * 2,
   *   (v) => v.length
   * ), 3);
   * ```
   */
  match<U>(okFn: Fn<T, U>, errFn: ErrFn<E, U>): U;

  /**
   * Calls `okFn` if the result is `Ok`, otherwise calls `errFn`.
   *
   * Both `okFn` and `errFn` must have the same return type.
   *
   * Use this method instead of {@link Result.match} when the
   * provided `okFn` or `errFn` return promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Result, err, ok } from "@resulto/core";
   *
   * const a: Result<number, string> = ok(2);
   * assertEquals(await a.asyncMatch(
   *   (v) => Promise.resolve(v * 2),
   *   (v) => Promise.resolve(v.length)
   * ), 4);
   *
   * const b: Result<number, string> = err("foo");
   * assertEquals(await b.asyncMatch(
   *   (v) => Promise.resolve(v * 2),
   *   (v) => Promise.resolve(v.length)
   * ), 3);
   * ```
   */
  asyncMatch<U>(
    okFn: Fn<T, U | Promise<U>>,
    errFn: ErrFn<E, U | Promise<U>>,
  ): Promise<U>;
}

/**
 * Async version of `Result`.
 *
 * In fact this is just a regular `Result` wrapped in a proxy to allow chaining
 * promises without using `await` on every call.
 */
export interface AsyncResult<T, E> extends Promise<Result<T, E>> {
  // We have to duplicate declarations due to the TypeScript limitations.
  // The only thing we do here is using `AsyncResult` instead of `Result` and
  // wrapping other types in `Promise` to allow chaining and make autocompletion
  // happy.
  // Reference: https://github.com/sindresorhus/type-fest/issues/178

  /**
   * Maps an `AsyncResult<T, E>` to `AsyncResult<U, E>` by applying a function
   * `f` to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * This function can be used to compose the results of two functions.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { ok, okAsync } from "@resulto/core";
   *
   * const a = okAsync(2);
   * assertEquals(await a.map((v) => v * 2), ok(4));
   * ```
   */
  map<U>(f: Fn<T, U>): AsyncResult<U, E>;

  /**
   * Maps an `AsyncResult<T, E>` to `AsyncResult<U, E>` by applying a function
   * `f` to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * This function can be used to compose the results of two functions.
   *
   * Use this method instead of {@link AsyncResult.map} when the provided `f`
   * returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { ok, okAsync } from "@resulto/core";
   *
   * const a = okAsync(2);
   * assertEquals(await a.asyncMap((v) => Promise.resolve(v * 2)), ok(4));
   * ```
   */
  asyncMap<U>(f: Fn<T, Promise<U>>): AsyncResult<U, E>;

  /**
   * Returns the provided default `value` (if `Err`), or applies a function to
   * the contained value (if `Ok`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncResult, errAsync, okAsync } from "@resulto/core";
   *
   * const a: AsyncResult<string, string> = okAsync("foo");
   * assertEquals(await a.mapOr(42, (v) => v.length), 3);
   *
   * const b: AsyncResult<string, string> = errAsync("bar");
   * assertEquals(await b.mapOr(42, (v) => v.length), 42);
   * ```
   */
  mapOr<U>(value: U, f: Fn<T, U>): Promise<U>;

  /**
   * Returns the provided default `value` (if `Err`), or applies a function to
   * the contained value (if `Ok`).
   *
   * Use this method instead of {@link AsyncResult.mapOr} when the provided `f`
   * returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncResult, errAsync, okAsync } from "@resulto/core";
   *
   * const a: AsyncResult<string, string> = okAsync("foo");
   * assertEquals(await a.asyncMapOr(42, (v) => Promise.resolve(v.length)), 3);
   *
   * const b: AsyncResult<string, string> = errAsync("bar");
   * assertEquals(await b.asyncMapOr(42, (v) => Promise.resolve(v.length)), 42);
   * ```
   */
  asyncMapOr<U>(value: U, f: Fn<T, Promise<U>>): Promise<U>;

  /**
   * Maps an `AsyncResult<T, E>` to `Promise<U>` by applying function
   * `fallbackFn` to a contained `Err` value, or function `f` to a contained
   * `Ok` value.
   *
   * This function can be used to unpack a successful result while handling an
   * error.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncResult, errAsync, okAsync } from "@resulto/core";
   *
   * const a: AsyncResult<number, string> = okAsync(5);
   * assertEquals(await a.mapOrElse((e) => e.length, (v) => v * 4), 20);
   *
   * const b: AsyncResult<number, string> = errAsync("foo");
   * assertEquals(await b.mapOrElse((e) => e.length, (v) => v * 4), 3);
   * ```
   */
  mapOrElse<U>(fallbackFn: ErrFn<E, U>, f: Fn<T, U>): Promise<U>;

  /**
   * Maps an `AsyncResult<T, E>` to `Promise<U>` by applying function
   * `fallbackFn` to a contained `Err` value, or function `f` to a contained
   * `Ok` value.
   *
   * This function can be used to unpack a successful result while handling an
   * error.
   *
   * Use this method instead of {@link AsyncResult.mapOrElse} when the provided
   * `fallbackFn` or `f` return promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncResult, errAsync, okAsync } from "@resulto/core";
   *
   * const a: AsyncResult<number, string> = okAsync(5);
   * assertEquals(await a.asyncMapOrElse(
   *   (e) => Promise.resolve(e.length),
   *   (v) => Promise.resolve(v * 4)
   * ), 20);
   *
   * const b: AsyncResult<number, string> = errAsync("foo");
   * assertEquals(await b.asyncMapOrElse(
   *   (e) => Promise.resolve(e.length),
   *   (v) => Promise.resolve(v * 4)
   * ), 3);
   * ```
   */
  asyncMapOrElse<U>(
    fallbackFn: ErrFn<E, U | Promise<U>>,
    f: Fn<T, U | Promise<U>>,
  ): Promise<U>;

  /**
   * Maps an `AsyncResult<T, E>` to `AsyncResult<T, F>` by applying a function
   * to a contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while
   * handling an error.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncResult, err, errAsync, ok, okAsync } from "@resulto/core";
   *
   * const a: AsyncResult<number, number> = okAsync(2);
   * assertEquals(await a.mapErr((v) => v * 2), ok(2));
   *
   * const b: AsyncResult<number, number> = errAsync(2);
   * assertEquals(await b.mapErr((v) => v * 2), err(4));
   * ```
   */
  mapErr<F>(f: ErrFn<E, F>): AsyncResult<T, F>;

  /**
   * Maps an `AsyncResult<T, E>` to `AsyncResult<T, F>` by applying a function
   * to a contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while
   * handling an error.
   *
   * Use this method instead of {@link AsyncResult.mapErr} when the provided `f`
   * returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncResult, err, errAsync, ok, okAsync } from "@resulto/core";
   *
   * const a: AsyncResult<number, number> = okAsync(2);
   * assertEquals(await a.asyncMapErr((v) => Promise.resolve(v * 2)), ok(2));
   *
   * const b: AsyncResult<number, number> = errAsync(2);
   * assertEquals(await b.asyncMapErr((v) => Promise.resolve(v * 2)), err(4));
   * ```
   */
  asyncMapErr<F>(f: ErrFn<E, Promise<F>>): AsyncResult<T, F>;

  /**
   * Calls the provided function `f` with the contained value (if `Ok`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
   * import { ok, okAsync } from "@resulto/core";
   *
   * const log = spy();
   *
   * assertEquals(await okAsync(4).inspect(log).map((v) => v ** 3), ok(64));
   *
   * assertSpyCalls(log, 1);
   * assertSpyCall(log, 0, { args: [4] });
   * ```
   */
  inspect(f: Fn<T, void>): AsyncResult<T, E>;

  /**
   * Calls the provided function `f` with the contained error (if `Err`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
   * import { errAsync } from "@resulto/core";
   *
   * const log = spy()
   *
   * const _ = await errAsync("failed to read file").inspectErr(log);
   *
   * assertSpyCalls(log, 1);
   * assertSpyCall(log, 0, { args: ["failed to read file"] });
   * ```
   */
  inspectErr(f: ErrFn<E, void>): AsyncResult<T, E>;

  /**
   * Performs a side effect on the contained value (if `Ok`).
   *
   * NOTE: `f` is awaited.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
   * import { okAsync } from "@resulto/core";
   *
   * const alert = spy(() => Promise.resolve());
   *
   * const _ = await okAsync(4).tap(alert);
   *
   * assertSpyCalls(alert, 1);
   * assertSpyCall(alert, 0, { args: [4] });
   * ```
   */
  tap(f: Fn<T, Promise<void>>): AsyncResult<T, E>;

  /**
   * Performs a side effect on the contained error (if `Err`).
   *
   * NOTE: `f` is awaited.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
   * import { errAsync } from "@resulto/core";
   *
   * const alert = spy(() => Promise.resolve());
   *
   * const _ = await errAsync("failed to read file").tapErr(alert);
   *
   * assertSpyCalls(alert, 1);
   * assertSpyCall(alert, 0, { args: ["failed to read file"] });
   * ```
   */
  tapErr(f: Fn<E, Promise<void>>): AsyncResult<T, E>;

  /**
   * Returns the contained `Ok` value.
   *
   * This function may throw {@link UnwrapError} (if `Err`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals, assertRejects } from "@std/assert";
   * import { errAsync, okAsync } from "@resulto/core";
   *
   * const a = okAsync(2);
   * assertEquals(await a.expect("value should be present"), 2);
   *
   * const b = errAsync("emergency failure");
   * await assertRejects(
   *   async () => await b.expect("value should be present"),
   *   "value should be present: emergency failure"
   * );
   * ```
   */
  expect(msg: string): Promise<T>;

  /**
   * Returns the contained `Ok` value.
   *
   * This function may throw {@link UnwrapError} (if `Err`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals, assertRejects } from "@std/assert";
   * import { errAsync, okAsync } from "@resulto/core";
   *
   * const a = okAsync(2);
   * assertEquals(await a.unwrap(), 2);
   *
   * const b = errAsync("emergency failure");
   * await assertRejects(
   *   async () => await b.unwrap(),
   *   "Called `unwrap` on an `Err` value: emergency failure"
   * );
   * ```
   */
  unwrap(): Promise<T>;

  /**
   * Returns the contained `Err` value.
   *
   * This function may throw {@link UnwrapError} (if `Ok`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals, assertRejects } from "@std/assert";
   * import { errAsync, okAsync } from "@resulto/core";
   *
   * const a = okAsync(10);
   * await assertRejects(
   *   async () => await a.expectErr("error should be present"),
   *   "error should be present: 10"
   * );
   *
   * const b = errAsync("emergency failure");
   * assertEquals(await b.expectErr("error should be present"), "emergency failure");
   * ```
   */
  expectErr(msg: string): Promise<E>;

  /**
   * Returns the contained `Err` value.
   *
   * This function may throw {@link UnwrapError} (if `Ok`).
   *
   * @example
   *
   * ```ts
   * import { assertEquals, assertRejects } from "@std/assert";
   * import { errAsync, okAsync } from "@resulto/core";
   *
   * const a = okAsync(2);
   * await assertRejects(
   *   async () => await a.unwrapErr(),
   *   "Called `unwrapErr` on an `Ok` value: 2"
   * );
   *
   * const b = errAsync("emergency failure");
   * assertEquals(await b.unwrapErr(), "emergency failure");
   * ```
   */
  unwrapErr(): Promise<E>;

  /**
   * Returns `res` if the result is `Ok`, otherwise returns the `Err` value.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncResult, type Result, err, errAsync, ok, okAsync } from "@resulto/core";
   *
   * const a: AsyncResult<number, string> = okAsync(2);
   * const b: Result<string, string> = err("late error");
   * assertEquals(await a.and(b), err("late error"));
   *
   * const c: AsyncResult<number, string> = errAsync("early error");
   * const d: Result<string, string> = ok("foo");
   * assertEquals(await c.and(d), err("early error"));
   *
   * const e: AsyncResult<number, string> = okAsync(2);
   * const f: Result<string, string> = ok("different result type");
   * assertEquals(await e.and(f), ok("different result type"));
   *
   * const g: AsyncResult<number, string> = errAsync("not a 2");
   * const h: Result<string, string> = err("late error");
   * assertEquals(await g.and(h), err("not a 2"));
   * ```
   */
  and<U>(res: Result<U, E>): AsyncResult<U, E>;

  /**
   * Calls `f` if the result is `Ok`, otherwise returns the `Err` value.
   *
   * This function can be used for control flow based on `AsyncResult` values.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { err, errAsync, ok, okAsync } from "@resulto/core";
   *
   * function sq(v: number) {
   *   if (v >= 1000) {
   *     return err("overflowed");
   *   }
   *   return ok(v * v);
   * }
   *
   * assertEquals(await okAsync(2).andThen(sq), ok(4));
   * assertEquals(await okAsync(1_000_000).andThen(sq), err("overflowed"));
   * assertEquals(await errAsync("NaN").andThen(sq), err("NaN"));
   * ```
   */
  andThen<U, F>(f: Fn<T, Result<U, F>>): AsyncResult<U, E | F>;

  /**
   * Calls `f` if the result is `Ok`, otherwise returns the `Err` value.
   *
   * This function can be used for control flow based on `AsyncResult` values.
   *
   * Use this method instead of {@link AsyncResult.andThen} when the provided
   * `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { err, errAsync, ok, okAsync } from "@resulto/core";
   *
   * function sq(v: number) {
   *   if (v >= 1000) {
   *     return errAsync("overflowed");
   *   }
   *   return okAsync(v * v);
   * }
   *
   * assertEquals(await okAsync(2).asyncAndThen(sq), ok(4));
   * assertEquals(await okAsync(1_000_000).asyncAndThen(sq), err("overflowed"));
   * assertEquals(await errAsync("NaN").asyncAndThen(sq), err("NaN"));
   * ```
   */
  asyncAndThen<U, F>(f: Fn<T, Promise<Result<U, F>>>): AsyncResult<U, E | F>;

  /**
   * Returns `res` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncResult, type Result, err, errAsync, ok, okAsync } from "@resulto/core";
   *
   * const a: AsyncResult<number, string> = okAsync(2);
   * const b: Result<number, string> = err("late error");
   * assertEquals(await a.or(b), ok(2));
   *
   * const c: AsyncResult<number, string> = errAsync("early error");
   * const d: Result<number, string> = ok(2);
   * assertEquals(await c.or(d), ok(2));
   *
   * const e: AsyncResult<number, string> = okAsync(2);
   * const f: Result<number, string> = ok(100);
   * assertEquals(await e.or(f), ok(2));
   *
   * const g: AsyncResult<number, string> = errAsync("not a 2");
   * const h: Result<number, string> = err("late error");
   * assertEquals(await g.or(h), err("late error"));
   * ```
   */
  or<F>(res: Result<T, F>): AsyncResult<T, F>;

  /**
   * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * This function can be used for control flow based on `AsyncResult` values.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { err, errAsync, ok, okAsync } from "@resulto/core";
   *
   * const sq = (v: number) => ok(v * v);
   * const fail = (v: number) => err(v);
   *
   * assertEquals(await okAsync(2).orElse(sq).orElse(sq), ok(2));
   * assertEquals(await okAsync(2).orElse(fail).orElse(sq), ok(2));
   * assertEquals(await errAsync(3).orElse(sq).orElse(fail), ok(9));
   * assertEquals(await errAsync(3).orElse(fail).orElse(fail), err(3));
   * ```
   */
  orElse<U, F>(f: ErrFn<E, Result<U, F>>): AsyncResult<U | T, F>;

  /**
   * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * This function can be used for control flow based on `AsyncResult` values.
   *
   * Use this method instead of {@link AsyncResult.orElse} when the provided `f`
   * returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { err, errAsync, ok, okAsync } from "@resulto/core";
   *
   * const sq = (v: number) => okAsync(v * v);
   * const fail = (v: number) => errAsync(v);
   *
   * assertEquals(await okAsync(2).asyncOrElse(sq).asyncOrElse(sq), ok(2));
   * assertEquals(await okAsync(2).asyncOrElse(fail).asyncOrElse(sq), ok(2));
   * assertEquals(await errAsync(3).asyncOrElse(sq).asyncOrElse(fail), ok(9));
   * assertEquals(await errAsync(3).asyncOrElse(fail).asyncOrElse(fail), err(3));
   * ```
   */
  asyncOrElse<U, F>(
    f: ErrFn<E, Promise<Result<U, F>>>,
  ): AsyncResult<U | T, F>;

  /**
   * Returns the contained `Ok` value or a provided `value`.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { errAsync, okAsync } from "@resulto/core";
   *
   * const a = okAsync(9);
   * assertEquals(await a.unwrapOr(2), 9);
   *
   * const b = errAsync("error");
   * assertEquals(await b.unwrapOr(2), 2);
   * ```
   */
  unwrapOr<U>(value: U): Promise<U | T>;

  /**
   * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * This function can be used for control flow based on `AsyncResult` values.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncResult, errAsync, okAsync } from "@resulto/core";
   *
   * const a: AsyncResult<number, string> = okAsync(2);
   * assertEquals(await a.unwrapOrElse((e) => e.length), 2);
   *
   * const b: AsyncResult<number, string> = errAsync("foo");
   * assertEquals(await b.unwrapOrElse((e) => e.length), 3);
   * ```
   */
  unwrapOrElse<U>(f: ErrFn<E, U>): Promise<U | T>;

  /**
   * Returns the contained `Ok `value or computes it from a `f`.
   *
   * Use this method instead of {@link AsyncResult.unwrapOrElse} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncResult, errAsync, okAsync } from "@resulto/core";
   *
   * const a: AsyncResult<number, string> = okAsync(2);
   * assertEquals(await a.asyncUnwrapOrElse((e) => Promise.resolve(e.length)), 2);
   *
   * const b: AsyncResult<number, string> = errAsync("foo");
   * assertEquals(await b.asyncUnwrapOrElse((e) => Promise.resolve(e.length)), 3);
   * ```
   */
  asyncUnwrapOrElse<U>(f: ErrFn<E, Promise<U>>): Promise<U | T>;

  /**
   * Calls `okFn` if the result is `Ok`, otherwise calls `errFn`.
   *
   * Both `okFn` and `errFn` must have the same return type.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncResult, errAsync, okAsync } from "@resulto/core";
   *
   * const a: AsyncResult<number, string> = okAsync(2);
   * assertEquals(await a.match(
   *   (v) => v * 2,
   *   (v) => v.length
   * ), 4);
   *
   * const b: AsyncResult<number, string> = errAsync("foo");
   * assertEquals(await b.match(
   *   (v) => v * 2,
   *   (v) => v.length
   * ), 3);
   * ```
   */
  match<U>(okFn: Fn<T, U>, errFn: ErrFn<E, U>): Promise<U>;

  /**
   * Calls `okFn` if the result is `Ok`, otherwise calls `errFn`.
   *
   * Both `okFn` and `errFn` must have the same return type.
   *
   * Use this method instead of {@link AsyncResult.match} when the provided
   * `okFn` or `errFn` return promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncResult, errAsync, okAsync } from "@resulto/core";
   *
   * const a: AsyncResult<number, string> = okAsync(2);
   * assertEquals(await a.asyncMatch(
   *   (v) => Promise.resolve(v * 2),
   *   (v) => Promise.resolve(v.length)
   * ), 4);
   *
   * const b: AsyncResult<number, string> = errAsync("foo");
   * assertEquals(await b.asyncMatch(
   *   (v) => Promise.resolve(v * 2),
   *   (v) => Promise.resolve(v.length)
   * ), 3);
   * ```
   */
  asyncMatch<U>(
    okFn: Fn<T, U | Promise<U>>,
    errFn: ErrFn<E, U | Promise<U>>,
  ): Promise<U>;
}

export class Ok<T, E> implements Result<T, E> {
  constructor(readonly value: T) {}

  isOk(): this is Ok<T, E> {
    return true;
  }

  isOkAnd(f: Predicate<T>): boolean {
    return f(this.value);
  }

  isErr(): this is Err<T, E> {
    return false;
  }

  isErrAnd(): boolean {
    return false;
  }

  map<U>(f: Fn<T, U>): Result<U, E> {
    return ok(f(this.value));
  }

  asyncMap<U>(f: Fn<T, Promise<U>>): AsyncResult<U, E> {
    return chain(f(this.value).then(ok));
  }

  mapOr<U>(_: U, f: Fn<T, U>): U {
    return f(this.value);
  }

  asyncMapOr<U>(_: U, f: Fn<T, Promise<U>>): Promise<U> {
    return f(this.value);
  }

  mapOrElse<U>(_: ErrFn<E, U>, f: Fn<T, U>): U {
    return f(this.value);
  }

  asyncMapOrElse<U>(
    _: ErrFn<E, U | Promise<U>>,
    f: Fn<T, U | Promise<U>>,
  ): Promise<U> {
    return Promise.resolve(f(this.value));
  }

  mapErr<F>(): Result<T, F> {
    return ok(this.value);
  }

  asyncMapErr<F>(): AsyncResult<T, F> {
    return chain(ok(this.value));
  }

  inspect(f: Fn<T, void>): Result<T, E> {
    f(this.value);

    return ok(this.value);
  }

  inspectErr(): Result<T, E> {
    return ok(this.value);
  }

  tap(f: Fn<T, Promise<void>>): AsyncResult<T, E> {
    return chain(f(this.value).then(() => ok(this.value)));
  }

  tapErr(): AsyncResult<T, E> {
    return okAsync(this.value);
  }

  expect(): T {
    return this.value;
  }

  unwrap(): T {
    return this.value;
  }

  expectErr(msg: string): never {
    throw new UnwrapError(msg, this.value);
  }

  unwrapErr(): never {
    throw new UnwrapError("Called `unwrapErr` on an `Ok` value", this.value);
  }

  and<U>(res: Result<U, E>): Result<U, E> {
    return res;
  }

  andThen<U, F>(f: Fn<T, Result<U, F>>): Result<U, E | F> {
    return f(this.value);
  }

  asyncAndThen<U, F>(f: Fn<T, Promise<Result<U, F>>>): AsyncResult<U, E | F> {
    return chain(f(this.value));
  }

  or<F>(): Result<T, F> {
    return ok(this.value);
  }

  orElse<U, F>(): Result<U | T, F> {
    return ok(this.value);
  }

  asyncOrElse<U, F>(): AsyncResult<U | T, F> {
    return chain(ok(this.value));
  }

  unwrapOr<U>(): U | T {
    return this.value;
  }

  unwrapOrElse<U>(): U | T {
    return this.value;
  }

  asyncUnwrapOrElse(): Promise<T> {
    return Promise.resolve(this.value);
  }

  match<U>(okFn: Fn<T, U>): U {
    return okFn(this.value);
  }

  asyncMatch<U>(okFn: Fn<T, U | Promise<U>>): Promise<U> {
    return Promise.resolve(okFn(this.value));
  }
}

export class Err<T, E> implements Result<T, E> {
  constructor(readonly error: E) {}

  isOk(): this is Ok<T, E> {
    return false;
  }

  isOkAnd(): boolean {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }

  isErrAnd(f: Predicate<E>): boolean {
    return f(this.error);
  }

  map<U>(): Result<U, E> {
    return err(this.error);
  }

  asyncMap<U>(): AsyncResult<U, E> {
    return chain(err(this.error));
  }

  mapOr<U>(value: U): U {
    return value;
  }

  asyncMapOr<U>(value: U): Promise<U> {
    return Promise.resolve(value);
  }

  mapOrElse<U>(fallback: ErrFn<E, U>): U {
    return fallback(this.error);
  }

  asyncMapOrElse<U>(fallbackFn: ErrFn<E, U | Promise<U>>): Promise<U> {
    return Promise.resolve(fallbackFn(this.error));
  }

  mapErr<F>(f: ErrFn<E, F>): Result<T, F> {
    return err(f(this.error));
  }

  asyncMapErr<F>(f: ErrFn<E, Promise<F>>): AsyncResult<T, F> {
    return chain(f(this.error).then(err));
  }

  inspect(): Result<T, E> {
    return err(this.error);
  }

  inspectErr(f: ErrFn<E, void>): Result<T, E> {
    f(this.error);

    return err(this.error);
  }

  tap(): AsyncResult<T, E> {
    return chain(err(this.error));
  }

  tapErr(f: Fn<E, Promise<void>>): AsyncResult<T, E> {
    return chain(f(this.error).then(() => errAsync(this.error)));
  }

  expect(msg: string): never {
    throw new UnwrapError(msg, this.error);
  }

  unwrap(): never {
    throw new UnwrapError("Called `unwrap` on an `Err` value", this.error);
  }

  expectErr(): E {
    return this.error;
  }

  unwrapErr(): E {
    return this.error;
  }

  and<U>(): Result<U, E> {
    return err(this.error);
  }

  andThen<U, F>(): Result<U, E | F> {
    return err(this.error);
  }

  asyncAndThen<U, F>(): AsyncResult<U, E | F> {
    return chain(err(this.error));
  }

  or<F>(res: Result<T, F>): Result<T, F> {
    return res;
  }

  orElse<U, F>(f: ErrFn<E, Result<U, F>>): Result<U | T, F> {
    return f(this.error);
  }

  asyncOrElse<U, F>(
    f: ErrFn<E, Promise<Result<U, F>>>,
  ): AsyncResult<U | T, F> {
    return chain(f(this.error));
  }

  unwrapOr<U>(value: U): U | T {
    return value;
  }

  unwrapOrElse<U>(f: ErrFn<E, U>): U | T {
    return f(this.error);
  }

  asyncUnwrapOrElse<U>(f: ErrFn<E, Promise<U>>): Promise<U | T> {
    return f(this.error);
  }

  match<U>(_: Fn<T, U>, errFn: ErrFn<E, U>): U {
    return errFn(this.error);
  }

  asyncMatch<U>(
    _: Fn<T, U | Promise<U>>,
    errFn: ErrFn<E, U | Promise<U>>,
  ): Promise<U> {
    return Promise.resolve(errFn(this.error));
  }
}

/**
 * Creates an `Ok` variant of `Result`.
 */
export function ok<T = unknown, E = never>(value: T): Result<T, E> {
  return new Ok<T, E>(value);
}

/**
 * Creates an `Ok` variant of `AsyncResult`.
 */
export function okAsync<T = unknown, E = never>(
  value: T | Promise<T>,
): AsyncResult<T, E> {
  return chain(Promise.resolve(value).then(ok<T, E>));
}

/**
 * Creates an `Err` variant of `Result`.
 */
export function err<T = never, E = unknown>(error: E): Result<T, E> {
  return new Err<T, E>(error);
}

/**
 * Creates an `Err` variant of `AsyncResult`.
 */
export function errAsync<T = never, E = unknown>(
  error: E | Promise<E>,
): AsyncResult<T, E> {
  return chain(Promise.resolve(error).then(err<T, E>));
}

/**
 * Accepts a promise and returns an `AsyncResult` containing either `Ok` with
 * the resolved value or `Err` with the rejected error.
 *
 * You can optionally pass `errorFn` as the second argument to map rejected
 * error from `unknown` to `E`.
 *
 * @example
 *
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { err, fromPromise, ok } from "@resulto/core";
 *
 * const users = [
 *   { id: 1, name: "John Doe" },
 *   { id: 2, name: "Taro Yamada" }
 * ];
 *
 * async function findUser(id: number) {
 *   return users.find((user) => user.id == id);
 * }
 *
 * const user = await fromPromise(
 *   findUser(1),
 *   (cause) => ({ code: "db_error", cause }),
 * ).andThen((user) => {
 *   if (!user) {
 *     return err({ code: "not_found" });
 *   }
 *
 *   return ok(user);
 * });
 *
 * assertEquals(user.unwrap(), { id: 1, name: "John Doe"});
 * ```
 */
export function fromPromise<T, E>(
  promise: Promise<T | Result<T, E>>,
  errorFn?: ErrFn<unknown, E>,
): AsyncResult<T, E> {
  return chain(
    promise.then((v) => {
      if (v instanceof Ok || v instanceof Err) {
        return v;
      }

      return ok(v);
    }).catch((e) => err(errorFn ? errorFn(e) : e)),
  );
}

/**
 * Same as {@link fromPromise} except that it does not handle the rejection of the
 * promise.
 *
 * **Ensure you know what you're doing, otherwise a thrown exception within this
 * promise will cause `AsyncResult` to reject.**
 */
export function fromSafePromise<T, E = never>(
  promise: Promise<T | Result<T, E>>,
): AsyncResult<T, E> {
  return chain(promise.then((v) => {
    if (v instanceof Ok || v instanceof Err) {
      return v;
    }

    return ok(v);
  }));
}

/**
 * Accepts a function `f` that may throw, and returns `Result` containing
 * either `Ok` with the value returned from `f` or `Err` with the thrown error.
 *
 * You can optionally pass `errorFn` as the second argument to map the thrown
 * error from `unknown` to `E`.
 *
 * @example
 *
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { fromThrowable } from "@resulto/core";
 *
 * const a = fromThrowable(
 *   () => JSON.parse('{ "foo": "bar" }'),
 *   (cause) => ({ code: "invalid_json", cause })
 * );
 * assertEquals(a.unwrap(), { foo: "bar" });
 *
 * const b = fromThrowable(
 *   () => JSON.parse("\/"),
 *   (cause) => ({ code: "invalid_json", cause })
 * );
 * assertEquals(b.unwrapErr().code, "invalid_json");
 * ```
 */
export function fromThrowable<T, E>(
  f: Fn<void, T>,
  errorFn?: ErrFn<unknown, E>,
): Result<T, E> {
  try {
    return ok(f());
  } catch (e) {
    return err(errorFn ? errorFn(e) : (e as E));
  }
}
