import { chain } from "./chain"
import { type Fn, type Predicate, ResultError } from "./utility"

export interface Result<T, E> {
  /**
   * Checks if `Result` is `Ok`.
   */
  isOk(): this is Ok<T, E>

  /**
   * Checks if `Result` is `Ok` and the value inside of it matches a predicate.
   */
  isOkAnd(f: Predicate<T>): boolean

  /**
   * Checks if `Result` is `Err`.
   */
  isErr(): this is Err<T, E>

  /**
   * Checks if `Result` is `Err` and the value inside of it matches a predicate.
   */
  isErrAnd(f: Predicate<E>): boolean

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function `f` to a
   * contained `Ok` value, leaving an `Err` value untouched.
   *
   * This function can be used to compose the results of two functions.
   */
  map<U>(f: Fn<T, U>): Result<U, E>

  /**
   * Works similar to the {@link Result.map} method, except that this method
   * returns `AsyncResult` instead of `Result`, and the function `f` has to
   * return `Promise`.
   *
   * @see {@link Result.map} for details.
   */
  asyncMap<U>(f: Fn<T, Promise<U>>): AsyncResult<U, E>

  /**
   * Returns the provided `value` (if `Err`), or applies a function to the
   * contained value (if `Ok`).
   */
  mapOr<U>(value: U, f: Fn<T, U>): U

  /**
   * Works similar to the {@link Result.mapOr} method, except that this method
   * returns `Promise`, and the function `f` has to return `Promise`.
   *
   * @see {@link Result.mapOr} for details.
   */
  asyncMapOr<U>(value: U, f: Fn<T, Promise<U>>): Promise<U>

  /**
   * Maps a `Result<T, E>` to `U` by applying function `fallbackFn` to a
   * contained `Err` value, or function `f` to a contained `Ok` value.
   *
   * This function can be used to unpack a successful result while handling an
   * error.
   */
  mapOrElse<U>(fallbackFn: Fn<E, U>, f: Fn<T, U>): U

  /**
   * Works similar to the {@link Result.mapOrElse} method, except that this
   * method returns `Promise`, and functions `fallbackFn` and `f` can return
   * `Promise`.
   *
   * @see {@link Result.mapOrElse} for details.
   */
  asyncMapOrElse<U>(
    fallbackFn: Fn<E, U | Promise<U>>,
    f: Fn<T, U | Promise<U>>
  ): Promise<U>

  /**
   * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a
   * contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while
   * handling an error.
   */
  mapErr<F>(f: Fn<E, F>): Result<T, F>

  /**
   * Works similar to the {@link Result.mapErr} method, except that this method
   * returns `AsyncResult` instead of `Result`, and the function `f` has to
   * return `Promise`.
   *
   * @see {@link Result.mapErr} for details.
   */
  asyncMapErr<F>(f: Fn<E, Promise<F>>): AsyncResult<T, F>

  /**
   * Calls the provided function `f` with the contained value (if `Ok`).
   */
  inspect(f: Fn<T, void>): Result<T, E>

  /**
   * Calls the provided function `f` with the contained error (if `Err`).
   */
  inspectErr(f: Fn<E, void>): Result<T, E>

  /**
   * Returns the contained `Ok` value.
   *
   * This function may throw `UnwrapError` (if `Err`).
   */
  expect(msg: string): T

  /**
   * Returns the contained `Ok` value.
   *
   * This function may throw `UnwrapError` (if `Err`).
   */
  unwrap(): T

  /**
   * Returns the contained `Err` value.
   *
   * This function may throw `UnwrapError` (if `Ok`).
   */
  expectErr(msg: string): E

  /**
   * Returns the contained `Err` value.
   *
   * This function may throw `UnwrapError` (if `Ok`).
   */
  unwrapErr(): E

  /**
   * Returns `res` if the result is `Ok`, otherwise returns the `Err` value.
   */
  and<U>(res: Result<U, E>): Result<U, E>

  /**
   * Calls `f` if the result is `Ok`, otherwise returns the `Err` value.
   *
   * This function can be used for control flow based on `Result` values.
   */
  andThen<U>(f: Fn<T, Result<U, E>>): Result<U, E>

  /**
   * Works similar to the {@link Result.andThen} method, except that this
   * method returns `AsyncResult` instead of `Result`, and the function `f`
   * has to return `Promise`.
   *
   * @see {@link Result.andThen} for details.
   */
  asyncAndThen<U>(f: Fn<T, Promise<Result<U, E>>>): AsyncResult<U, E>

  /**
   * Returns `res` if the result is `Err`, otherwise returns the `Ok` value.
   */
  or<F>(res: Result<T, F>): Result<T, F>

  /**
   * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * This function can be used for control flow based on result values.
   */
  orElse<F>(f: Fn<E, Result<T, F>>): Result<T, F>

  /**
   * Works similar to the {@link Result.orElse} method, except that this
   * method returns `AsyncResult` instead of `Result`, and the function `f`
   * has to return `Promise`.
   *
   * @see {@link Result.orElse} for details.
   */
  asyncOrElse<F>(f: Fn<E, Promise<Result<T, F>>>): AsyncResult<T, F>

  /**
   * Returns the contained `Ok` value or a provided `value`.
   */
  unwrapOr(value: T): T

  /**
   * Returns the contained `Ok `value or computes it from a `f`.
   */
  unwrapOrElse(f: Fn<E, T>): T

  /**
   * Works similar to the {@link Result.unwrapOrElse} method, except that this
   * method returns `Promise`, and the function `f` has to return `Promise`.
   *
   * @see {@link Result.unwrapOrElse} for details.
   */
  asyncUnwrapOrElse(f: Fn<E, Promise<T>>): Promise<T>

  /**
   * Calls `okFn` if the result is `Ok`, otherwise calls `errFn`.
   *
   * Both `okFn` and `errFn` must have the same return type.
   */
  match<U>(okFn: Fn<T, U>, errFn: Fn<E, U>): U

  /**
   * Works similar to the {@link Result.match} method, except that this
   * method returns `Promise`, and functions `okFn` and `errFn` can return
   * `Promise`.
   *
   * @see {@link Result.match} for details.
   */
  asyncMatch<U>(
    okFn: Fn<T, U | Promise<U>>,
    errFn: Fn<E, U | Promise<U>>
  ): Promise<U>
}

// We have to duplicate declarations due to the TypeScript limitations.
// The only thing we do here is using `AsyncResult` instead of `Result` and
// wrapping other types in `Promise` to allow chaining and make autocompletion
// happy.
// Reference: https://github.com/sindresorhus/type-fest/issues/178
export type AsyncResult<T, E> = {
  /**
   * Works similar to the {@link Result.map} method, except that this method
   * returns `AsyncResult` instead of `Result`.
   *
   * @see {@link Result.map} for details.
   */
  map<U>(f: Fn<T, U>): AsyncResult<U, E>

  /**
   * Works the same as the {@link Result.asyncMap}.
   *
   * @see {@link Result.asyncMap} for details.
   */
  asyncMap<U>(f: Fn<T, Promise<U>>): AsyncResult<U, E>

  /**
   * Works similar to the {@link Result.mapErr} method, except that this method
   * returns `AsyncResult` instead of `Result`.
   *
   * @see {@link Result.mapErr} for details.
   */
  mapErr<F>(f: Fn<E, F>): AsyncResult<T, F>

  /**
   * Works the same as the {@link Result.asyncMapErr}.
   *
   * @see {@link Result.asyncMapErr} for details.
   */
  asyncMapErr<F>(f: Fn<E, Promise<F>>): AsyncResult<T, F>

  /**
   * Works similar to the {@link Result.mapOr} method, except that this method
   * returns `Promise`.
   *
   * @see {@link Result.mapOr} for details.
   */
  mapOr<U>(value: U, f: Fn<T, U>): Promise<U>

  /**
   * Works the same as the {@link Result.asyncMapOr}.
   *
   * @see {@link Result.asyncMapOr} for details.
   */
  asyncMapOr<U>(value: U, f: Fn<T, Promise<U>>): Promise<U>

  /**
   * Works similar to the {@link Result.mapOrElse} method, except that this
   * method returns `Promise`.
   *
   * @see {@link Result.mapOrElse} for details.
   */
  mapOrElse<U>(fallbackFn: Fn<E, U>, f: Fn<T, U>): Promise<U>

  /**
   * Works similar to the {@link Result.asyncMapOrElse} method, except that this
   * method returns `Promise`.
   *
   * @see {@link Result.asyncMapOrElse} for details.
   */
  asyncMapOrElse<U>(
    fallbackFn: Fn<E, U | Promise<U>>,
    f: Fn<T, U | Promise<U>>
  ): Promise<U>

  /**
   * Works similar to the {@link Result.inspect} method, except that this
   * method returns `AsyncResult` instead of `Result`.
   *
   * @see {@link Result.inspect} for details.
   */
  inspect(f: Fn<T, void>): AsyncResult<T, E>

  /**
   * Works similar to the {@link Result.inspectErr} method, except that this
   * method returns `AsyncResult` instead of `Result`.
   *
   * @see {@link Result.inspectErr} for details.
   */
  inspectErr(f: Fn<E, void>): AsyncResult<T, E>

  /**
   * Works similar to the {@link Result.expect} method, except that this method
   * returns `Promise`.
   *
   * @see {@link Result.expect} for details.
   */
  expect(msg: string): Promise<T>

  /**
   * Works similar to the {@link Result.unwrap} method, except that this method
   * returns `Promise`.
   *
   * @see {@link Result.unwrap} for details.
   */
  unwrap(): Promise<T>

  /**
   * Works similar to the {@link Result.expectErr} method, except that this
   * method returns `Promise`.
   *
   * @see {@link Result.expectErr} for details.
   */
  expectErr(msg: string): Promise<E>

  /**
   * Works similar to the {@link Result.unwrapErr} method, except that this
   * method returns `Promise`.
   *
   * @see {@link Result.unwrapErr} for details.
   */
  unwrapErr(): Promise<E>

  /**
   * Works similar to the {@link Result.and} method, except that this method
   * returns `AsyncResult` instead of `Result`.
   *
   * @see {@link Result.and} for details.
   */
  and<U>(res: Result<U, E>): AsyncResult<U, E>

  /**
   * Works similar to the {@link Result.andThen} method, except that this
   * method returns `AsyncResult` instead of `Result`.
   *
   * @see {@link Result.andThen} for details.
   */
  andThen<U>(f: Fn<T, Result<U, E>>): AsyncResult<U, E>

  /**
   * Works the same as the {@link Result.asyncAndThen}.
   *
   * @see {@link Result.asyncAndThen} for details.
   */
  asyncAndThen<U>(f: Fn<T, Promise<Result<U, E>>>): AsyncResult<U, E>

  /**
   * Works similar to the {@link Result.or} method, except that this method
   * returns `AsyncResult` instead of `Result`.
   *
   * @see {@link Result.or} for details.
   */
  or<F>(res: Result<T, F>): AsyncResult<T, F>

  /**
   * Works similar to the {@link Result.orElse} method, except that this method
   * returns `AsyncResult` instead of `Result`.
   *
   * @see {@link Result.orElse} for details.
   */
  orElse<F>(f: Fn<E, Result<T, F>>): AsyncResult<T, F>

  /**
   * Works the same as the {@link Result.asyncOrElse}.
   *
   * @see {@link Result.asyncOrElse} for details.
   */
  asyncOrElse<F>(f: Fn<E, Promise<Result<T, F>>>): AsyncResult<T, F>

  /**
   * Works similar to the {@link Result.unwrapOr} method, except that this
   * method returns `Promise`.
   *
   * @see {@link Result.unwrapOr} for details.
   */
  unwrapOr(value: T): Promise<T>

  /**
   * Works similar to the {@link Result.unwrapOrElse} method, except that this
   * method returns `Promise`.
   *
   * @see {@link Result.unwrapOrElse} for details.
   */
  unwrapOrElse(f: Fn<E, T>): Promise<T>

  /**
   * Works the same as the {@link Result.asyncUnwrapOrElse}.
   *
   * @see {@link Result.asyncUnwrapOrElse} for details.
   */
  asyncUnwrapOrElse(f: Fn<E, Promise<T>>): Promise<T>

  /**
   * Works similar to the {@link Result.match} method, except that this method
   * returns `Promise`.
   *
   * @see {@link Result.match} for details.
   */
  match<U>(okFn: Fn<T, U>, errFn: Fn<E, U>): Promise<U>

  /**
   * Works the same as the {@link Result.asyncMatch}.
   *
   * @see {@link Result.asyncMatch} for details.
   */
  asyncMatch<U>(
    okFn: Fn<T, U | Promise<U>>,
    errFn: Fn<E, U | Promise<U>>
  ): Promise<U>
} & Promise<Result<T, E>>

export class Ok<T, E> implements Result<T, E> {
  constructor(readonly value: T) {}

  isOk(): this is Ok<T, E> {
    return true
  }

  isOkAnd(f: Predicate<T>): boolean {
    return f(this.value)
  }

  isErr(): this is Err<T, E> {
    return false
  }

  isErrAnd(): boolean {
    return false
  }

  map<U>(f: Fn<T, U>): Result<U, E> {
    return ok(f(this.value))
  }

  asyncMap<U>(f: Fn<T, Promise<U>>): AsyncResult<U, E> {
    return chain(f(this.value).then(ok))
  }

  mapOr<U>(_: U, f: Fn<T, U>): U {
    return f(this.value)
  }

  asyncMapOr<U>(_: U, f: Fn<T, Promise<U>>): Promise<U> {
    return chain(f(this.value).then(ok))
  }

  mapOrElse<U>(_: Fn<E, U>, f: Fn<T, U>): U {
    return f(this.value)
  }

  asyncMapOrElse<U>(
    _: Fn<E, U | Promise<U>>,
    f: Fn<T, U | Promise<U>>
  ): Promise<U> {
    return Promise.resolve(f(this.value))
  }

  mapErr<F>(): Result<T, F> {
    return ok(this.value)
  }

  asyncMapErr<F>(): AsyncResult<T, F> {
    return chain(ok(this.value))
  }

  inspect(f: Fn<T, void>): Result<T, E> {
    f(this.value)

    return ok(this.value)
  }

  inspectErr(): Result<T, E> {
    return ok(this.value)
  }

  expect(): T {
    return this.value
  }

  unwrap(): T {
    return this.value
  }

  expectErr(msg: string): never {
    throw new ResultError(msg, this.value)
  }

  unwrapErr(): never {
    throw new ResultError("Called `unwrapErr` on `Ok`", this.value)
  }

  and<U>(res: Result<U, E>): Result<U, E> {
    return res
  }

  andThen<U>(f: Fn<T, Result<U, E>>): Result<U, E> {
    return f(this.value)
  }

  asyncAndThen<U>(f: Fn<T, Promise<Result<U, E>>>): AsyncResult<U, E> {
    return chain(f(this.value))
  }

  or<F>(): Result<T, F> {
    return ok(this.value)
  }

  orElse<F>(): Result<T, F> {
    return ok(this.value)
  }

  asyncOrElse<F>(): AsyncResult<T, F> {
    return chain(ok(this.value))
  }

  unwrapOr(): T {
    return this.value
  }

  unwrapOrElse(): T {
    return this.value
  }

  asyncUnwrapOrElse(): Promise<T> {
    return Promise.resolve(this.value)
  }

  match<U>(okFn: Fn<T, U>): U {
    return okFn(this.value)
  }

  asyncMatch<U>(okFn: Fn<T, U | Promise<U>>): Promise<U> {
    return Promise.resolve(okFn(this.value))
  }
}

export class Err<T, E> implements Result<T, E> {
  constructor(readonly error: E) {}

  isOk(): this is Ok<T, E> {
    return false
  }

  isOkAnd(): boolean {
    return false
  }

  isErr(): this is Err<T, E> {
    return true
  }

  isErrAnd(f: Predicate<E>): boolean {
    return f(this.error)
  }

  map<U>(): Result<U, E> {
    return err(this.error)
  }

  asyncMap<U>(): AsyncResult<U, E> {
    return chain(err(this.error))
  }

  mapOr<U>(value: U): U {
    return value
  }

  asyncMapOr<U>(value: U): Promise<U> {
    return Promise.resolve(value)
  }

  mapOrElse<U>(fallback: Fn<E, U>): U {
    return fallback(this.error)
  }

  asyncMapOrElse<U>(fallbackFn: Fn<E, U | Promise<U>>): Promise<U> {
    return Promise.resolve(fallbackFn(this.error))
  }

  mapErr<F>(f: Fn<E, F>): Result<T, F> {
    return err(f(this.error))
  }

  asyncMapErr<F>(f: Fn<E, Promise<F>>): AsyncResult<T, F> {
    return chain(f(this.error).then(ok))
  }

  inspect(): Result<T, E> {
    return err(this.error)
  }

  inspectErr(f: Fn<E, void>): Result<T, E> {
    f(this.error)

    return err(this.error)
  }

  expect(msg: string): never {
    throw new ResultError(msg, this.error)
  }

  unwrap(): never {
    throw new ResultError("Called `unwrap` on `Err`", this.error)
  }

  expectErr(): E {
    return this.error
  }

  unwrapErr(): E {
    return this.error
  }

  and<U>(): Result<U, E> {
    return err(this.error)
  }

  andThen<U>(): Result<U, E> {
    return err(this.error)
  }

  asyncAndThen<U>(): AsyncResult<U, E> {
    return chain(err(this.error))
  }

  or<F>(res: Result<T, F>): Result<T, F> {
    return res
  }

  orElse<F>(f: Fn<E, Result<T, F>>): Result<T, F> {
    return f(this.error)
  }

  asyncOrElse<F>(f: Fn<E, Promise<Result<T, F>>>): AsyncResult<T, F> {
    return chain(f(this.error).then(ok))
  }

  unwrapOr(value: T): T {
    return value
  }

  unwrapOrElse(f: Fn<E, T>): T {
    return f(this.error)
  }

  asyncUnwrapOrElse(f: Fn<E, Promise<T>>): Promise<T> {
    return f(this.error)
  }

  match<U>(_: Fn<T, U>, errFn: Fn<E, U>): U {
    return errFn(this.error)
  }

  asyncMatch<U>(
    _: Fn<T, U | Promise<U>>,
    errFn: Fn<E, U | Promise<U>>
  ): Promise<U> {
    return Promise.resolve(errFn(this.error))
  }
}

/**
 * Creates an `Ok` version of `Result`.
 */
export function ok<T = unknown, E = never>(value: T) {
  return new Ok<T, E>(value)
}

/**
 * Creates an `Ok` version of `AsyncResult`.
 */
export function okAsync<T = unknown, E = never>(value: T | Promise<T>) {
  return chain(Promise.resolve(value).then(ok<T, E>))
}

/**
 * Creates an `Err` version of `Result`.
 */
export function err<T = never, E = unknown>(error: E) {
  return new Err<T, E>(error)
}

/**
 * Creates an `Err` version of `AsyncResult`.
 */
export function errAsync<T = unknown, E = never>(error: E | Promise<E>) {
  return chain(Promise.resolve(error).then(err<T, E>))
}

/**
 * Accepts a promise and returns an `AsyncResult` containing either `Ok` with
 * the resolved value or `Err` with the rejected error.
 *
 * You can optionally pass `errorFn` as the second argument to map rejected
 * error from `unknown` to `E`.
 */
export function fromPromise<T, E>(
  promise: Promise<T>,
  errorFn?: Fn<unknown, E>
): AsyncResult<T, E> {
  return chain(promise.then(ok).catch((e) => err(errorFn ? errorFn(e) : e)))
}

/**
 * Accepts a function `f` that may throw, and returns `Result` containing
 * either `Ok` with the value returned from `f` or `Err` with the thrown error.
 *
 * You can optionally pass `errorFn` as the second argument to map the thrown
 * error from `unknown` to `E`.
 */
export function fromThrowable<T, E>(
  f: Fn<void, T>,
  errorFn?: Fn<unknown, E>
): Result<T, E> {
  try {
    return ok(f())
  } catch (e) {
    return err(errorFn ? errorFn(e) : (e as E))
  }
}
