import { chain } from "./chain.js";
import { UnwrapError } from "./errors.ts";

type Predicate<T> = (value: T) => boolean;

type Fn<T, U> = (value: T) => U;
type NoneFn<U> = () => U;

/**
 * Declares the methods available on {@link Option}.
 *
 * This interface is exported only for API documentation and should not be used
 * directly. Use {@link Option} instead.
 */
export interface OptionDeclarations<T> {
  /**
   * Checks if {@link Option} is a {@link Some} value.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { none, some } from "@resulto/core";
   *
   * const a = some(2);
   * assertEquals(a.isSome(), true);
   *
   * const b = none();
   * assertEquals(b.isSome(), false);
   * ```
   */
  isSome(): this is Some<T>;

  /**
   * Checks if {@link Option} is a {@link Some} value and the value inside of it
   * matches a predicate.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const a: Option<number> = some(2);
   * assertEquals(a.isSomeAnd((v) => v > 1), true);
   *
   * const b: Option<number> = some(0);
   * assertEquals(b.isSomeAnd((v) => v > 1), false);
   *
   * const c: Option<number> = none();
   * assertEquals(c.isSomeAnd((v) => v > 1), false);
   * ```
   */
  isSomeAnd(f: Predicate<T>): boolean;

  /**
   * Checks if {@link Option} is a {@link None} value.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { none, some } from "@resulto/core";
   *
   * const a = some(2);
   * assertEquals(a.isNone(), false);
   *
   * const b = none();
   * assertEquals(b.isNone(), true);
   * ```
   */
  isNone(): this is None<T>;

  /**
   * Checks if {@link Option} is a {@link None} value or the value inside of it
   * matches a predicate.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const a: Option<number> = some(2);
   * assertEquals(a.isNoneOr((v) => v > 1), true);
   *
   * const b: Option<number> = some(0);
   * assertEquals(b.isNoneOr((v) => v > 1), false);
   *
   * const c: Option<number> = none();
   * assertEquals(c.isNoneOr((v) => v > 1), true);
   * ```
   */
  isNoneOr(f: Predicate<T>): boolean;

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function `f` to a
   * contained {@link Some} value.
   *
   * This function can be used to compose the options of two functions.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { some } from "@resulto/core";
   *
   * const a = some(2);
   * assertEquals(a.map((v) => v * 2), some(4));
   * ```
   */
  map<U>(f: Fn<T, U>): Option<U>;

  /**
   * Maps an `AsyncOption<T>` to `AsyncOption<U>` by applying a function
   * `f` to a contained {@link Some} value.
   *
   * This function can be used to compose the options of two functions.
   *
   * Use this method instead of {@link OptionDeclarations.map} when the provided
   * `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { some } from "@resulto/core";
   *
   * const a = some(2);
   * assertEquals(await a.asyncMap((v) => Promise.resolve(v * 2)), some(4));
   * ```
   */
  asyncMap<U>(f: Fn<T, Promise<U>>): AsyncOption<U>;

  /**
   * Returns the provided default `value` (if {@link None}), or applies a
   * function to the contained value (if {@link Some}).
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const a: Option<string> = some("foo");
   * assertEquals(a.mapOr(42, (v) => v.length), 3);
   *
   * const b: Option<string> = none();
   * assertEquals(b.mapOr(42, (v) => v.length), 42);
   * ```
   */
  mapOr<U>(value: U, f: Fn<T, U>): U;

  /**
   * Returns the provided default `value` (if {@link None}), or applies a
   * function to the contained value (if {@link Some}).
   *
   * Use this method instead of {@link OptionDeclarations.mapOr} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const a: Option<string> = some("foo");
   * assertEquals(await a.asyncMapOr(42, (v) => Promise.resolve(v.length)), 3);
   *
   * const b: Option<string> = none();
   * assertEquals(await b.asyncMapOr(42, (v) => Promise.resolve(v.length)), 42);
   * ```
   */
  asyncMapOr<U>(value: U, f: Fn<T, Promise<U>>): Promise<U>;

  /**
   * Maps an `Option<T>` to `Option<U>` by applying function `fallbackFn`
   * (if {@link None}), or function `f` to a contained {@link Some} value.
   *
   * This function can be used to unpack a successful option while handling an
   * error.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const k = 21;
   *
   * const a: Option<string> = some("foo");
   * assertEquals(a.mapOrElse(() => 2 * k, (v) => v.length), 3);
   *
   * const b: Option<string> = none();
   * assertEquals(b.mapOrElse(() => 2 * k, (v) => v.length), 42);
   * ```
   */
  mapOrElse<U>(fallbackFn: NoneFn<U>, f: Fn<T, U>): U;

  /**
   * Maps an `AsyncOption<T, E>` to `Promise<U>` by applying function
   * `fallbackFn` (if {@link None}), or function `f` to a contained {@link Some}
   * value.
   *
   * This function can be used to unpack a successful option while handling an
   * error.
   *
   * Use this method instead of {@link OptionDeclarations.mapOrElse} when the
   * provided `fallbackFn` or `f` return promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const k = 21;
   *
   * const a: Option<string> = some("foo");
   * assertEquals(await a.asyncMapOrElse(
   *   () => Promise.resolve(2 * k),
   *   (v) => Promise.resolve(v.length)
   * ), 3);
   *
   * const b: Option<string> = none();
   * assertEquals(await b.asyncMapOrElse(
   *   () => Promise.resolve(2 * k),
   *   (v) => Promise.resolve(v.length)
   * ), 42);
   * ```
   */
  asyncMapOrElse<U>(
    fallbackFn: NoneFn<U | Promise<U>>,
    f: Fn<T, U | Promise<U>>,
  ): Promise<U>;

  /**
   * Calls the provided function `f` with the contained value (if {@link Some}).
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { some } from "@resulto/core";
   * import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
   *
   * const log = spy();
   *
   * assertEquals(some(4).inspect(log).map((v) => v ** 3), some(64));
   *
   * assertSpyCalls(log, 1);
   * assertSpyCall(log, 0, { args: [4] });
   * ```
   */
  inspect(f: Fn<T, void>): Option<T>;

  /**
   * Performs a side effect on the contained value (if {@link Some}).
   *
   * NOTE: `f` is awaited.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { some } from "@resulto/core";
   * import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
   *
   * const alert = spy(() => Promise.resolve());
   *
   * const _ = await some(4).tap(alert);
   *
   * assertSpyCalls(alert, 1);
   * assertSpyCall(alert, 0, { args: [4] });
   * ```
   */
  tap(f: Fn<T, Promise<void>>): AsyncOption<T>;

  /**
   * Returns the contained {@link Some} value.
   *
   * This function may throw {@link UnwrapError} (if {@link None}).
   *
   * @example
   *
   * ```ts
   * import { assertEquals, assertThrows } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const a: Option<string> = some("value");
   * assertEquals(a.expect("value should be present"), "value");
   *
   * const b: Option<string> = none();
   * assertThrows(
   *   () => b.expect("value should be present"),
   *   "value should be present",
   * );
   * ```
   */
  expect(msg: string): T;

  /**
   * Returns the contained {@link Some} value.
   *
   * This function may throw {@link UnwrapError} (if {@link None}).
   *
   * @example
   *
   * ```ts
   * import { assertEquals, assertThrows } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const a: Option<string> = some("air");
   * assertEquals(a.unwrap(), "air");
   *
   * const b: Option<string> = none();
   * assertThrows(
   *   () => b.unwrap(),
   *   "Called `unwrap` on a `None` value",
   * );
   * ```
   */
  unwrap(): T;

  /**
   * Returns {@link None} if the option is None, otherwise returns `optb`.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const a: Option<number> = some(2);
   * const b: Option<string> = none();
   * assertEquals(a.and(b), none());
   *
   * const c: Option<number> = none();
   * const d: Option<string> = some("foo");
   * assertEquals(c.and(d), none());
   *
   * const e: Option<number> = some(2);
   * const f: Option<string> = some("foo");
   * assertEquals(e.and(f), some("foo"));
   *
   * const g: Option<number> = none();
   * const h: Option<string> = none();
   * assertEquals(g.and(h), none());
   * ```
   */
  and<U>(optb: Option<U>): Option<U>;

  /**
   * Returns {@link None} if the option is None, otherwise calls `f` with the
   * wrapped value and returns the result.
   *
   * This function can be used for control flow based on {@link Option} values.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { none, some } from "@resulto/core";
   *
   * function sq(v: number) {
   *   if (v >= 1000) {
   *     return none();
   *   }
   *   return some(v * v);
   * }
   *
   * assertEquals(some(2).andThen(sq), some(4));
   * assertEquals(some(1_000_000).andThen(sq), none());
   * assertEquals(none().andThen(sq), none());
   * ```
   */
  andThen<U>(f: Fn<T, Option<U>>): Option<U>;

  /**
   * Returns {@link None} if the option is None, otherwise calls `f` with the
   * wrapped value and returns the result.
   *
   * This function can be used for control flow based on {@link AsyncOption}
   * values.
   *
   * Use this method instead of {@link OptionDeclarations.andThen} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { none, noneAsync, some, someAsync } from "@resulto/core";
   *
   * function sq(v: number) {
   *   if (v >= 1000) {
   *     return noneAsync();
   *   }
   *   return someAsync(v * v);
   * }
   *
   * assertEquals(await some(2).asyncAndThen(sq), some(4));
   * assertEquals(await some(1_000_000).asyncAndThen(sq), none());
   * assertEquals(await none().asyncAndThen(sq), none());
   * ```
   */
  asyncAndThen<U>(f: Fn<T, Promise<Option<U>>>): AsyncOption<U>;

  /**
   * Returns the option if it contains a value, otherwise returns `optb`.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const a: Option<number> = some(2);
   * const b: Option<number> = none();
   * assertEquals(a.or(b), some(2));
   *
   * const c: Option<number> = none();
   * const d: Option<number> = some(100);
   * assertEquals(c.or(d), some(100));
   *
   * const e: Option<number> = some(2);
   * const f: Option<number> = some(100);
   * assertEquals(e.or(f), some(2));
   *
   * const g: Option<number> = none();
   * const h: Option<number> = none();
   * assertEquals(g.or(h), none());
   * ```
   */
  or(optb: Option<T>): Option<T>;

  /**
   * Returns the option if it contains a value, otherwise calls `f` and returns
   * the result.
   *
   * This function can be used for control flow based on {@link Option} values.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { none, some } from "@resulto/core";
   *
   * const nobody = () => none();
   * const vikings = () => some("vikings");
   *
   * assertEquals(some("barbarians").orElse(vikings), some("barbarians"));
   * assertEquals(none().orElse(vikings), some("vikings"));
   * assertEquals(none().orElse(nobody), none());
   * ```
   */
  orElse<U>(f: NoneFn<Option<U>>): Option<U | T>;

  /**
   * Calls `f` if the option is `Err`, otherwise returns the `Ok` value.
   *
   * This function can be used for control flow based on {@link AsyncOption}
   * values.
   *
   * Use this method instead of {@link OptionDeclarations.orElse} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { none, noneAsync, some, someAsync } from "@resulto/core";
   *
   * const nobody = () => noneAsync();
   * const vikings = () => someAsync("vikings");
   *
   * assertEquals(await some("barbarians").asyncOrElse(vikings), some("barbarians"));
   * assertEquals(await none().asyncOrElse(vikings), some("vikings"));
   * assertEquals(await none().asyncOrElse(nobody), none());
   * ```
   */
  asyncOrElse<U>(
    f: NoneFn<Promise<Option<U>>>,
  ): AsyncOption<U | T>;

  /**
   * Returns the contained {@link Some} value or a provided default `value`.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { none, some } from "@resulto/core";
   *
   * assertEquals(some("car").unwrapOr("bike"), "car");
   * assertEquals(none().unwrapOr("bike"), "bike");
   * ```
   */
  unwrapOr<U>(value: U): U | T;

  /**
   * Returns the contained {@link Some} value or computes it from a `f`.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const k = 10;
   *
   * const a: Option<number> = some(4);
   * assertEquals(a.unwrapOrElse(() => 2 * k), 4);
   *
   * const b: Option<number> = none();
   * assertEquals(b.unwrapOrElse(() => 2 * k), 20);
   * ```
   */
  unwrapOrElse<U>(f: NoneFn<U>): U | T;

  /**
   * Returns the contained {@link Some} value or computes it from a `f`.
   *
   * Use this method instead of {@link OptionDeclarations.unwrapOrElse} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const k = 10;
   *
   * const a: Option<number> = some(4);
   * assertEquals(await a.asyncUnwrapOrElse(() => Promise.resolve(2 * k)), 4);
   *
   * const b: Option<number> = none();
   * assertEquals(await b.asyncUnwrapOrElse(() => Promise.resolve(2 * k)), 20);
   * ```
   */
  asyncUnwrapOrElse<U>(f: NoneFn<Promise<U>>): Promise<U | T>;

  /**
   * Calls `someFn` if the option is {@link Some}, otherwise calls `noneFn`.
   *
   * Both `someFn` and `noneFn` must have the same return type.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const a: Option<number> = some(2);
   * assertEquals(a.match(
   *   (v) => v * 2,
   *   () => 0
   * ), 4);
   *
   * const b: Option<number> = none();
   * assertEquals(b.match(
   *   (v) => v * 2,
   *   () => 0
   * ), 0);
   * ```
   */
  match<U>(someFn: Fn<T, U>, noneFn: NoneFn<U>): U;

  /**
   * Calls `someFn` if the option is `Ok`, otherwise calls `noneFn`.
   *
   * Both `someFn` and `noneFn` must have the same return type.
   *
   * Use this method instead of {@link OptionDeclarations.match} when the
   * provided `someFn` or `noneFn` return a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type Option, none, some } from "@resulto/core";
   *
   * const a: Option<number> = some(2);
   * assertEquals(await a.asyncMatch(
   *   (v) => Promise.resolve(v * 2),
   *   () => Promise.resolve(0)
   * ), 4);
   *
   * const b: Option<number> = none();
   * assertEquals(await b.asyncMatch(
   *   (v) => Promise.resolve(v * 2),
   *   () => Promise.resolve(0)
   * ), 0);
   * ```
   */
  asyncMatch<U>(
    someFn: Fn<T, U | Promise<U>>,
    noneFn: NoneFn<U | Promise<U>>,
  ): Promise<U>;
}

/**
 * `Option` is a type that represents either a value {@link Some} or no value
 * {@link None}.
 *
 * Typically it is used when the absence of a value is expected and meaningful.
 *
 * See {@link OptionDeclarations} for available methods.
 */
export type Option<T> = Some<T> | None<T>;

/**
 * Async version of {@link Option}.
 *
 * In fact this is just a regular {@link Option} wrapped in a proxy to allow
 * chaining promises without using `await` on every call.
 */
export interface AsyncOption<T> extends Promise<Option<T>> {
  // We have to duplicate declarations due to the TypeScript limitations.
  // The only thing we do here is using `AsyncOption` instead of `Option` and
  // wrapping other types in `Promise` to allow chaining and make autocompletion
  // happy.
  // Reference: https://github.com/sindresorhus/type-fest/issues/178

  /**
   * Maps an `AsyncOption<T>` to `AsyncOption<U>` by applying a function `f` to
   * a contained {@link Some} value.
   *
   * This function can be used to compose the options of two functions.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { some, someAsync } from "@resulto/core";
   *
   * const a = someAsync(2);
   * assertEquals(await a.map((v) => v * 2), some(4));
   * ```
   */
  map<U>(f: Fn<T, U>): AsyncOption<U>;

  /**
   * Maps an `AsyncOption<T>` to `AsyncOption<U>` by applying a function
   * `f` to a contained {@link Some} value.
   *
   * This function can be used to compose the options of two functions.
   *
   * Use this method instead of {@link AsyncOption.map} when the provided
   * `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { some, someAsync } from "@resulto/core";
   *
   * const a = someAsync(2);
   * assertEquals(await a.asyncMap((v) => Promise.resolve(v * 2)), some(4));
   * ```
   */
  asyncMap<U>(f: Fn<T, Promise<U>>): AsyncOption<U>;

  /**
   * Returns the provided default `value` (if {@link None}), or applies a
   * function to the contained value (if {@link Some}).
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncOption, noneAsync, someAsync } from "@resulto/core";
   *
   * const a: AsyncOption<string> = someAsync("foo");
   * assertEquals(await a.mapOr(42, (v) => v.length), 3);
   *
   * const b: AsyncOption<string> = noneAsync();
   * assertEquals(await b.mapOr(42, (v) => v.length), 42);
   * ```
   */
  mapOr<U>(value: U, f: Fn<T, U>): Promise<U>;

  /**
   * Returns the provided default `value` (if {@link None}), or applies a
   * function to the contained value (if {@link Some}).
   *
   * Use this method instead of {@link AsyncOption.mapOr} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncOption, noneAsync, someAsync } from "@resulto/core";
   *
   * const a: AsyncOption<string> = someAsync("foo");
   * assertEquals(await a.asyncMapOr(42, (v) => Promise.resolve(v.length)), 3);
   *
   * const b: AsyncOption<string> = noneAsync();
   * assertEquals(await b.asyncMapOr(42, (v) => Promise.resolve(v.length)), 42);
   * ```
   */
  asyncMapOr<U>(value: U, f: Fn<T, Promise<U>>): Promise<U>;

  /**
   * Maps an `AsyncOption<T>` to `AsyncOption<U>` by applying function
   * `fallbackFn` (if {@link None}), or function `f` to a contained {@link Some}
   * value.
   *
   * This function can be used to unpack a successful option while handling an
   * error.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncOption, noneAsync, someAsync } from "@resulto/core";
   *
   * const k = 21;
   *
   * const a: AsyncOption<string> = someAsync("foo");
   * assertEquals(await a.mapOrElse(() => 2 * k, (v) => v.length), 3);
   *
   * const b: AsyncOption<string> = noneAsync();
   * assertEquals(await b.mapOrElse(() => 2 * k, (v) => v.length), 42);
   * ```
   */
  mapOrElse<U>(fallbackFn: NoneFn<U>, f: Fn<T, U>): Promise<U>;

  /**
   * Maps an `AsyncOption<T, E>` to `Promise<U>` by applying function
   * `fallbackFn` (if {@link None}), or function `f` to a contained {@link Some}
   * value.
   *
   * This function can be used to unpack a successful option while handling an
   * error.
   *
   * Use this method instead of {@link AsyncOption.mapOrElse} when the
   * provided `fallbackFn` or `f` return promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncOption, noneAsync, someAsync } from "@resulto/core";
   *
   * const k = 21;
   *
   * const a: AsyncOption<string> = someAsync("foo");
   * assertEquals(await a.asyncMapOrElse(
   *   () => Promise.resolve(2 * k),
   *   (v) => Promise.resolve(v.length)
   * ), 3);
   *
   * const b: AsyncOption<string> = noneAsync();
   * assertEquals(await b.asyncMapOrElse(
   *   () => Promise.resolve(2 * k),
   *   (v) => Promise.resolve(v.length)
   * ), 42);
   * ```
   */
  asyncMapOrElse<U>(
    fallbackFn: NoneFn<U | Promise<U>>,
    f: Fn<T, U | Promise<U>>,
  ): Promise<U>;

  /**
   * Calls the provided function `f` with the contained value (if {@link Some}).
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { some, someAsync } from "@resulto/core";
   * import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
   *
   * const log = spy();
   *
   * assertEquals(await someAsync(4).inspect(log).map((v) => v ** 3), some(64));
   *
   * assertSpyCalls(log, 1);
   * assertSpyCall(log, 0, { args: [4] });
   * ```
   */
  inspect(f: Fn<T, void>): Option<T>;

  /**
   * Performs a side effect on the contained value (if {@link Some}).
   *
   * NOTE: `f` is awaited.
   *
   * @example
   *
   * ```ts
   * import { someAsync } from "@resulto/core";
   * import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
   *
   * const alert = spy(() => Promise.resolve());
   *
   * const _ = await someAsync(4).tap(alert);
   *
   * assertSpyCalls(alert, 1);
   * assertSpyCall(alert, 0, { args: [4] });
   * ```
   */
  tap(f: Fn<T, Promise<void>>): AsyncOption<T>;

  /**
   * Returns the contained {@link Some} value.
   *
   * This function may throw {@link UnwrapError} (if {@link None}).
   *
   * @example
   *
   * ```ts
   * import { assertEquals, assertRejects } from "@std/assert";
   * import { type AsyncOption, noneAsync, someAsync } from "@resulto/core";
   *
   * const a: AsyncOption<string> = someAsync("value");
   * assertEquals(await a.expect("value should be present"), "value");
   *
   * const b: AsyncOption<string> = noneAsync();
   * await assertRejects(
   *   async () => await b.expect("value should be present"),
   *   "value should be present"
   * );
   * ```
   */
  expect(msg: string): Promise<T>;

  /**
   * Returns the contained {@link Some} value.
   *
   * This function may throw {@link UnwrapError} (if {@link None}).
   *
   * @example
   *
   * ```ts
   * import { assertEquals, assertRejects } from "@std/assert";
   * import { type AsyncOption, noneAsync, someAsync } from "@resulto/core";
   *
   * const a: AsyncOption<string> = someAsync("air");
   * assertEquals(await a.unwrap(), "air");
   *
   * const b: AsyncOption<string> = noneAsync();
   * await assertRejects(
   *   async () => await b.unwrap(),
   *   "Called `unwrap` on a `None` value"
   * );
   * ```
   */
  unwrap(): Promise<T>;

  /**
   * Returns {@link None} if the option is None, otherwise returns `optb`.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncOption, type Option, none, noneAsync, some, someAsync } from "@resulto/core";
   *
   * const a: AsyncOption<number> = someAsync(2);
   * const b: Option<string> = none();
   * assertEquals(await a.and(b), none());
   *
   * const c: AsyncOption<number> = noneAsync();
   * const d: Option<string> = some("foo");
   * assertEquals(await c.and(d), none());
   *
   * const e: AsyncOption<number> = someAsync(2);
   * const f: Option<string> = some("foo");
   * assertEquals(await e.and(f), some("foo"));
   *
   * const g: AsyncOption<number> = noneAsync();
   * const h: Option<string> = none();
   * assertEquals(await g.and(h), none());
   * ```
   */
  and<U>(optb: Option<U>): AsyncOption<U>;

  /**
   * Returns {@link None} if the option is None, otherwise calls `f` with the
   * wrapped value and returns the result.
   *
   * This function can be used for control flow based on {@link Option} values.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { none, noneAsync, some, someAsync } from "@resulto/core";
   *
   * function sq(v: number) {
   *   if (v >= 1000) {
   *     return none();
   *   }
   *   return some(v * v);
   * }
   *
   * assertEquals(await someAsync(2).andThen(sq), some(4));
   * assertEquals(await someAsync(1_000_000).andThen(sq), none());
   * assertEquals(await noneAsync().andThen(sq), none());
   * ```
   */
  andThen<U>(f: Fn<T, Option<U>>): Option<U>;

  /**
   * Returns {@link None} if the option is None, otherwise calls `f` with the
   * wrapped value and returns the result.
   *
   * This function can be used for control flow based on {@link AsyncOption}
   * values.
   *
   * Use this method instead of {@link AsyncOption.andThen} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { none, noneAsync, some, someAsync } from "@resulto/core";
   *
   * function sq(v: number) {
   *   if (v >= 1000) {
   *     return noneAsync();
   *   }
   *   return someAsync(v * v);
   * }
   *
   * assertEquals(await someAsync(2).asyncAndThen(sq), some(4));
   * assertEquals(await someAsync(1_000_000).asyncAndThen(sq), none());
   * assertEquals(await noneAsync().asyncAndThen(sq), none());
   * ```
   */
  asyncAndThen<U>(f: Fn<T, Promise<Option<U>>>): AsyncOption<U>;

  /**
   * Returns the option if it contains a value, otherwise returns `optb`.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncOption, type Option, none, noneAsync, some, someAsync } from "@resulto/core";
   *
   * const a: AsyncOption<number> = someAsync(2);
   * const b: Option<number> = none();
   * assertEquals(await a.or(b), some(2));
   *
   * const c: AsyncOption<number> = noneAsync();
   * const d: Option<number> = some(100);
   * assertEquals(await c.or(d), some(100));
   *
   * const e: AsyncOption<number> = noneAsync();
   * const f: Option<number> = none();
   * assertEquals(await e.or(f), none());
   *
   * const g: AsyncOption<number> = noneAsync();
   * const h: Option<number> = none();
   * assertEquals(await g.or(h), none());
   * ```
   */
  or(optb: Option<T>): AsyncOption<T>;

  /**
   * Returns the option if it contains a value, otherwise calls `f` and returns
   * the result.
   *
   * This function can be used for control flow based on {@link Option} values.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { none, noneAsync, some, someAsync } from "@resulto/core";
   *
   * const nobody = () => none();
   * const vikings = () => some("vikings");
   *
   * assertEquals(await someAsync("barbarians").orElse(vikings), some("barbarians"));
   * assertEquals(await noneAsync().orElse(vikings), some("vikings"));
   * assertEquals(await noneAsync().orElse(nobody), none());
   * ```
   */
  orElse<U>(f: NoneFn<Option<U>>): AsyncOption<U | T>;

  /**
   * Calls `f` if the option is `Err`, otherwise returns the `Ok` value.
   *
   * This function can be used for control flow based on {@link AsyncOption}
   * values.
   *
   * Use this method instead of {@link AsyncOption.orElse} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { none, noneAsync, some, someAsync } from "@resulto/core";
   *
   * const nobody = () => noneAsync();
   * const vikings = () => someAsync("vikings");
   *
   * assertEquals(await someAsync("barbarians").asyncOrElse(vikings), some("barbarians"));
   * assertEquals(await noneAsync().asyncOrElse(vikings), some("vikings"));
   * assertEquals(await noneAsync().asyncOrElse(nobody), none());
   * ```
   */
  asyncOrElse<U>(
    f: NoneFn<Promise<Option<U>>>,
  ): AsyncOption<U | T>;

  /**
   * Returns the contained {@link Some} value or a provided default `value`.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { noneAsync, someAsync } from "@resulto/core";
   *
   * assertEquals(await someAsync("car").unwrapOr("bike"), "car");
   * assertEquals(await noneAsync().unwrapOr("bike"), "bike");
   * ```
   */
  unwrapOr<U>(value: U): Promise<U | T>;

  /**
   * Returns the contained {@link Some} value or computes it from a `f`.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncOption, noneAsync, someAsync } from "@resulto/core";
   *
   * const k = 10;
   *
   * const a: AsyncOption<number> = someAsync(4);
   * assertEquals(await a.unwrapOrElse(() => 2 * k), 4);
   *
   * const b: AsyncOption<number> = noneAsync();
   * assertEquals(await b.unwrapOrElse(() => 2 * k), 20);
   * ```
   */
  unwrapOrElse<U>(f: NoneFn<U>): Promise<U | T>;

  /**
   * Returns the contained {@link Some} value or computes it from a `f`.
   *
   * Use this method instead of {@link AsyncOption.unwrapOrElse} when the
   * provided `f` returns a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncOption, noneAsync, someAsync } from "@resulto/core";
   *
   * const k = 10;
   *
   * const a: AsyncOption<number> = someAsync(4);
   * assertEquals(await a.asyncUnwrapOrElse(() => Promise.resolve(2 * k)), 4);
   *
   * const b: AsyncOption<number> = noneAsync();
   * assertEquals(await b.asyncUnwrapOrElse(() => Promise.resolve(2 * k)), 20);
   * ```
   */
  asyncUnwrapOrElse<U>(f: NoneFn<Promise<U>>): Promise<U | T>;

  /**
   * Calls `someFn` if the option is {@link Some}, otherwise calls `noneFn`.
   *
   * Both `someFn` and `noneFn` must have the same return type.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncOption, noneAsync, someAsync } from "@resulto/core";
   *
   * const a: AsyncOption<number> = someAsync(2);
   * assertEquals(await a.match(
   *   (v) => v * 2,
   *   () => 0
   * ), 4);
   *
   * const b: AsyncOption<number> = noneAsync();
   * assertEquals(await b.match(
   *   (v) => v * 2,
   *   () => 0
   * ), 0);
   * ```
   */
  match<U>(someFn: Fn<T, U>, noneFn: NoneFn<U>): Promise<U>;

  /**
   * Calls `someFn` if the option is `Ok`, otherwise calls `noneFn`.
   *
   * Both `someFn` and `noneFn` must have the same return type.
   *
   * Use this method instead of {@link AsyncOption.match} when the
   * provided `someFn` or `noneFn` return a promise.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "@std/assert";
   * import { type AsyncOption, noneAsync, someAsync } from "@resulto/core";
   *
   * const a: AsyncOption<number> = someAsync(2);
   * assertEquals(await a.asyncMatch(
   *   (v) => Promise.resolve(v * 2),
   *   () => Promise.resolve(0)
   * ), 4);
   *
   * const b: AsyncOption<number> = noneAsync();
   * assertEquals(await b.asyncMatch(
   *   (v) => Promise.resolve(v * 2),
   *   () => Promise.resolve(0)
   * ), 0);
   * ```
   */
  asyncMatch<U>(
    someFn: Fn<T, U | Promise<U>>,
    noneFn: NoneFn<U | Promise<U>>,
  ): Promise<U>;
}

export class Some<T> implements OptionDeclarations<T> {
  constructor(readonly value: T) {}

  isSome(): this is Some<T> {
    return true;
  }

  isSomeAnd(f: Predicate<T>): boolean {
    return f(this.value);
  }

  isNone(): this is None<T> {
    return false;
  }

  isNoneOr(f: Predicate<T>): boolean {
    return f(this.value);
  }

  map<U>(f: Fn<T, U>): Option<U> {
    return some(f(this.value));
  }

  asyncMap<U>(f: Fn<T, Promise<U>>): AsyncOption<U> {
    return chain(f(this.value).then(some));
  }

  mapOr<U>(_: U, f: Fn<T, U>): U {
    return f(this.value);
  }

  asyncMapOr<U>(_: U, f: Fn<T, Promise<U>>): Promise<U> {
    return f(this.value);
  }

  mapOrElse<U>(_: NoneFn<U>, f: Fn<T, U>): U {
    return f(this.value);
  }

  asyncMapOrElse<U>(
    _: NoneFn<U | Promise<U>>,
    f: Fn<T, U | Promise<U>>,
  ): Promise<U> {
    return Promise.resolve(f(this.value));
  }

  inspect(f: Fn<T, void>): Option<T> {
    f(this.value);

    return some(this.value);
  }

  tap(f: Fn<T, Promise<void>>): AsyncOption<T> {
    return chain(f(this.value).then(() => some(this.value)));
  }

  expect(): T {
    return this.value;
  }

  unwrap(): T {
    return this.value;
  }

  and<U>(optb: Option<U>): Option<U> {
    return optb;
  }

  andThen<U>(f: Fn<T, Option<U>>): Option<U> {
    return f(this.value);
  }

  asyncAndThen<U>(f: Fn<T, Promise<Option<U>>>): AsyncOption<U> {
    return chain(f(this.value));
  }

  or(): Option<T> {
    return some(this.value);
  }

  orElse<U>(): Option<U | T> {
    return some(this.value);
  }

  asyncOrElse<U>(): AsyncOption<U | T> {
    return chain(some(this.value));
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

  match<U>(someFn: Fn<T, U>): U {
    return someFn(this.value);
  }

  asyncMatch<U>(someFn: Fn<T, U | Promise<U>>): Promise<U> {
    return Promise.resolve(someFn(this.value));
  }
}

export class None<T> implements OptionDeclarations<T> {
  isSome(): this is Some<T> {
    return false;
  }

  isSomeAnd(): boolean {
    return false;
  }

  isNone(): this is None<T> {
    return true;
  }

  isNoneOr(): boolean {
    return true;
  }

  map<U>(): Option<U> {
    return none();
  }

  asyncMap<U>(): AsyncOption<U> {
    return chain(none());
  }

  mapOr<U>(value: U): U {
    return value;
  }

  asyncMapOr<U>(value: U): Promise<U> {
    return Promise.resolve(value);
  }

  mapOrElse<U>(fallback: NoneFn<U>): U {
    return fallback();
  }

  asyncMapOrElse<U>(fallbackFn: NoneFn<U | Promise<U>>): Promise<U> {
    return Promise.resolve(fallbackFn());
  }

  inspect(): Option<T> {
    return none();
  }

  tap(): AsyncOption<T> {
    return chain(none());
  }

  expect(msg: string): never {
    throw new UnwrapError(msg);
  }

  unwrap(): never {
    throw new UnwrapError("Called `unwrap` on a `None` value");
  }

  and<U>(): Option<U> {
    return none();
  }

  andThen<U>(): Option<U> {
    return none();
  }

  asyncAndThen<U>(): AsyncOption<U> {
    return chain(none());
  }

  or(optb: Option<T>): Option<T> {
    return optb;
  }

  orElse<U>(f: NoneFn<Option<U>>): Option<U | T> {
    return f();
  }

  asyncOrElse<U>(
    f: NoneFn<Promise<Option<U>>>,
  ): AsyncOption<U | T> {
    return chain(f());
  }

  unwrapOr<U>(value: U): U | T {
    return value;
  }

  unwrapOrElse<U>(f: NoneFn<U>): U | T {
    return f();
  }

  asyncUnwrapOrElse<U>(f: NoneFn<Promise<U>>): Promise<U | T> {
    return f();
  }

  match<U>(_: Fn<T, U>, noneFn: NoneFn<U>): U {
    return noneFn();
  }

  asyncMatch<U>(
    _: Fn<T, U | Promise<U>>,
    noneFn: NoneFn<U | Promise<U>>,
  ): Promise<U> {
    return Promise.resolve(noneFn());
  }
}

/**
 * Creates a {@link Some} variant of {@link Option}.
 */
export function some<T>(value: T): Option<T> {
  return new Some(value);
}

/**
 * Creates a {@link Some} variant of {@link AsyncOption}.
 */
export function someAsync<T>(
  value: T | Promise<T>,
): AsyncOption<T> {
  return chain(Promise.resolve(value).then(some));
}

/**
 * Creates a {@link None} variant of {@link Option}.
 */
export function none<T = never>(): Option<T> {
  return new None();
}

/**
 * Creates a {@link None} variant of {@link AsyncOption}.
 */
export function noneAsync<T = never>(): AsyncOption<T> {
  return chain(Promise.resolve().then(none));
}
