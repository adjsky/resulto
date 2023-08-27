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
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a
   * contained `Ok` value, leaving an `Err` value untouched.
   *
   * This function can be used to compose the results of two functions.
   */
  map<U>(f: Fn<T, U>): Result<U, E>

  /**
   * Maps a `Result<T, E>` to `AsyncResult<U, E>>` by applying an async function
   * to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * This function can be used to compose the results of two functions.
   */
  asyncMap<U>(f: Fn<T, Promise<U>>): AsyncResult<U, E>

  /**
   * Returns the provided `value` (if `Err`), or applies a function to the
   * contained value (if `Ok`).
   */
  mapOr<U>(value: U, f: Fn<T, U>): U

  /**
   * Maps a `Result<T, E>` to `U` by applying function `fallbackFn` to a
   * contained `Err` value, or function `f` to a contained `Ok` value.
   *
   * This function can be used to unpack a successful result while handling an
   * error.
   */
  mapOrElse<U>(fallbackFn: Fn<E, U>, f: Fn<T, U>): U

  /**
   * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a
   * contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while
   * handling an error.
   */
  mapErr<F>(f: Fn<E, F>): Result<T, F>

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
   * This function may throw `UnwrapError`  (if `Ok`).
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
   * Returns the contained `Ok` value or a provided `value`.
   */
  unwrapOr(value: T): T

  /**
   * Returns the contained `Ok `value or computes it from a `f`.
   */
  unwrapOrElse(f: Fn<E, T>): T

  /**
   * Calls `okFn` if the result is `Ok`, otherwise calls `errFn`.
   *
   * Both `okFn` and `errFn` must have the same return type.
   */
  match<U>(okFn: Fn<T, U>, errFn: Fn<E, U>): U
}

//
// We have to duplicate declarations to due to the TypeScript limitations.
// The only thing we do here is wrapping return types in `Promise`
// to allow chaining and make autocompletion happy.
// Reference: https://github.com/sindresorhus/type-fest/issues/178
//
interface AsyncResultDeclarations<T, E> {
  /**
   * Async version of {@link Result.map}.
   */
  map<U>(f: Fn<T, U>): AsyncResult<U, E>

  /**
   * Async version of {@link Result.asyncMap}.
   */
  asyncMap<U>(f: Fn<T, Promise<U>>): AsyncResult<U, E>

  /**
   * Async version of {@link Result.mapErr}.
   */
  mapErr<F>(f: Fn<E, F>): AsyncResult<T, F>

  /**
   * Async version of {@link Result.mapOr}.
   */
  mapOr<U>(value: U, f: Fn<T, U>): Promise<U>

  /**
   * Async version of {@link Result.mapOrElse}.
   */
  mapOrElse<U>(fallbackFn: Fn<E, U>, f: Fn<T, U>): Promise<U>

  /**
   * Async version of {@link Result.inspect}.
   */
  inspect(f: Fn<T, void>): AsyncResult<T, E>

  /**
   * Async version of {@link Result.inspectErr}.
   */
  inspectErr(f: Fn<E, void>): AsyncResult<T, E>

  /**
   * Async version of {@link Result.expect}.
   */
  expect(msg: string): Promise<T>

  /**
   * Async version of {@link Result.unwrap}.
   */
  unwrap(): Promise<T>

  /**
   * Async version of {@link Result.expectErr}.
   */
  expectErr(msg: string): Promise<E>

  /**
   * Async version of {@link Result.unwrapErr}.
   */
  unwrapErr(): Promise<E>

  /**
   * Async version of {@link Result.and}.
   */
  and<U>(res: Result<U, E>): AsyncResult<U, E>

  /**
   * Async version of {@link Result.andThen}.
   */
  andThen<U>(f: Fn<T, Result<U, E>>): AsyncResult<U, E>

  /**
   * Async version of {@link Result.or}.
   */
  or<F>(res: Result<T, F>): AsyncResult<T, F>

  /**
   * Async version of {@link Result.orElse}.
   */
  orElse<F>(f: Fn<E, Result<T, F>>): AsyncResult<T, F>

  /**
   * Async version of {@link Result.unwrapOr}.
   */
  unwrapOr(value: T): Promise<T>

  /**
   * Async version of {@link Result.unwrapOrElse}.
   */
  unwrapOrElse(f: Fn<E, T>): Promise<T>

  /**
   * Async version of {@link Result.match}.
   */
  match<U>(okFn: Fn<T, U>, errFn: Fn<E, U>): Promise<U>
}

export type AsyncResult<T, E> = AsyncResultDeclarations<T, E> &
  Promise<Result<T, E>>

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

  mapOrElse<U>(_: Fn<E, U>, f: Fn<T, U>): U {
    return f(this.value)
  }

  mapErr<F>(): Result<T, F> {
    return ok(this.value)
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

  or<F>(): Result<T, F> {
    return ok(this.value)
  }

  orElse<F>(): Result<T, F> {
    return ok(this.value)
  }

  unwrapOr(): T {
    return this.value
  }

  unwrapOrElse(): T {
    return this.value
  }

  match<U>(okFn: Fn<T, U>): U {
    return okFn(this.value)
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

  mapOrElse<U>(fallback: Fn<E, U>): U {
    return fallback(this.error)
  }

  mapErr<F>(f: Fn<E, F>): Result<T, F> {
    return err(f(this.error))
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

  or<F>(res: Result<T, F>): Result<T, F> {
    return res
  }

  orElse<F>(f: Fn<E, Result<T, F>>): Result<T, F> {
    return f(this.error)
  }

  unwrapOr(value: T): T {
    return value
  }

  unwrapOrElse(f: Fn<E, T>): T {
    return f(this.error)
  }

  match<U>(_okFn: Fn<T, U>, errFn: Fn<E, U>): U {
    return errFn(this.error)
  }
}

export function ok<T = unknown, E = never>(value: T) {
  return new Ok<T, E>(value)
}

export function err<T = never, E = unknown>(error: E) {
  return new Err<T, E>(error)
}

export function fromPromise<T, E>(
  promise: Promise<T>,
  errorFn?: (error: unknown) => E
): AsyncResult<T, E> {
  return chain(
    promise.then(ok).catch((error) => err(errorFn ? errorFn(error) : error))
  )
}
