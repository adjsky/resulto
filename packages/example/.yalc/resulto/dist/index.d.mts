type Predicate<T> = (value: T) => boolean;
type Fn<T, U> = (value: T) => U;
declare class ResultError extends Error {
    data: unknown;
    constructor(message: string, data: unknown);
}

interface Result<T, E> {
    /**
     * Checks if `Result` is `Ok`.
     */
    isOk(): this is Ok<T, E>;
    /**
     * Checks if `Result` is `Ok` and the value inside of it matches a predicate.
     */
    isOkAnd(f: Predicate<T>): boolean;
    /**
     * Checks if `Result` is `Err`.
     */
    isErr(): this is Err<T, E>;
    /**
     * Checks if `Result` is `Err` and the value inside of it matches a predicate.
     */
    isErrAnd(f: Predicate<E>): boolean;
    /**
     * Maps a `Result<T, E>` to `Result<U, E>` by applying a function `f` to a
     * contained `Ok` value, leaving an `Err` value untouched.
     *
     * This function can be used to compose the results of two functions.
     */
    map<U>(f: Fn<T, U>): Result<U, E>;
    /**
     * Works similar to the {@link Result.map} method, except that this method
     * returns `AsyncResult` instead of `Result`, and the function `f` has to
     * return `Promise`.
     *
     * @see {@link Result.map} for details.
     */
    asyncMap<U>(f: Fn<T, Promise<U>>): AsyncResult<U, E>;
    /**
     * Returns the provided `value` (if `Err`), or applies a function to the
     * contained value (if `Ok`).
     */
    mapOr<U>(value: U, f: Fn<T, U>): U;
    /**
     * Works similar to the {@link Result.mapOr} method, except that this method
     * returns `Promise`, and the function `f` has to return `Promise`.
     *
     * @see {@link Result.mapOr} for details.
     */
    asyncMapOr<U>(value: U, f: Fn<T, Promise<U>>): Promise<U>;
    /**
     * Maps a `Result<T, E>` to `U` by applying function `fallbackFn` to a
     * contained `Err` value, or function `f` to a contained `Ok` value.
     *
     * This function can be used to unpack a successful result while handling an
     * error.
     */
    mapOrElse<U>(fallbackFn: Fn<E, U>, f: Fn<T, U>): U;
    /**
     * Works similar to the {@link Result.mapOrElse} method, except that this
     * method returns `Promise`, and functions `fallbackFn` and `f` can return
     * `Promise`.
     *
     * @see {@link Result.mapOrElse} for details.
     */
    asyncMapOrElse<U>(fallbackFn: Fn<E, U | Promise<U>>, f: Fn<T, U | Promise<U>>): Promise<U>;
    /**
     * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a
     * contained `Err` value, leaving an `Ok` value untouched.
     *
     * This function can be used to pass through a successful result while
     * handling an error.
     */
    mapErr<F>(f: Fn<E, F>): Result<T, F>;
    /**
     * Works similar to the {@link Result.mapErr} method, except that this method
     * returns `AsyncResult` instead of `Result`, and the function `f` has to
     * return `Promise`.
     *
     * @see {@link Result.mapErr} for details.
     */
    asyncMapErr<F>(f: Fn<E, Promise<F>>): AsyncResult<T, F>;
    /**
     * Calls the provided function `f` with the contained value (if `Ok`).
     */
    inspect(f: Fn<T, void>): Result<T, E>;
    /**
     * Calls the provided function `f` with the contained error (if `Err`).
     */
    inspectErr(f: Fn<E, void>): Result<T, E>;
    /**
     * Returns the contained `Ok` value.
     *
     * This function may throw `UnwrapError` (if `Err`).
     */
    expect(msg: string): T;
    /**
     * Returns the contained `Ok` value.
     *
     * This function may throw `UnwrapError` (if `Err`).
     */
    unwrap(): T;
    /**
     * Returns the contained `Err` value.
     *
     * This function may throw `UnwrapError` (if `Ok`).
     */
    expectErr(msg: string): E;
    /**
     * Returns the contained `Err` value.
     *
     * This function may throw `UnwrapError` (if `Ok`).
     */
    unwrapErr(): E;
    /**
     * Returns `res` if the result is `Ok`, otherwise returns the `Err` value.
     */
    and<U>(res: Result<U, E>): Result<U, E>;
    /**
     * Calls `f` if the result is `Ok`, otherwise returns the `Err` value.
     *
     * This function can be used for control flow based on `Result` values.
     */
    andThen<U>(f: Fn<T, Result<U, E>>): Result<U, E>;
    /**
     * Works similar to the {@link Result.andThen} method, except that this
     * method returns `AsyncResult` instead of `Result`, and the function `f`
     * has to return `Promise`.
     *
     * @see {@link Result.andThen} for details.
     */
    asyncAndThen<U>(f: Fn<T, Promise<Result<U, E>>>): AsyncResult<U, E>;
    /**
     * Returns `res` if the result is `Err`, otherwise returns the `Ok` value.
     */
    or<F>(res: Result<T, F>): Result<T, F>;
    /**
     * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
     *
     * This function can be used for control flow based on result values.
     */
    orElse<F>(f: Fn<E, Result<T, F>>): Result<T, F>;
    /**
     * Works similar to the {@link Result.orElse} method, except that this
     * method returns `AsyncResult` instead of `Result`, and the function `f`
     * has to return `Promise`.
     *
     * @see {@link Result.orElse} for details.
     */
    asyncOrElse<F>(f: Fn<E, Promise<Result<T, F>>>): AsyncResult<T, F>;
    /**
     * Returns the contained `Ok` value or a provided `value`.
     */
    unwrapOr(value: T): T;
    /**
     * Returns the contained `Ok `value or computes it from a `f`.
     */
    unwrapOrElse(f: Fn<E, T>): T;
    /**
     * Works similar to the {@link Result.unwrapOrElse} method, except that this
     * method returns `Promise`, and the function `f` has to return `Promise`.
     *
     * @see {@link Result.unwrapOrElse} for details.
     */
    asyncUnwrapOrElse(f: Fn<E, Promise<T>>): Promise<T>;
    /**
     * Calls `okFn` if the result is `Ok`, otherwise calls `errFn`.
     *
     * Both `okFn` and `errFn` must have the same return type.
     */
    match<U>(okFn: Fn<T, U>, errFn: Fn<E, U>): U;
    /**
     * Works similar to the {@link Result.match} method, except that this
     * method returns `Promise`, and functions `okFn` and `errFn` can return
     * `Promise`.
     *
     * @see {@link Result.match} for details.
     */
    asyncMatch<U>(okFn: Fn<T, U | Promise<U>>, errFn: Fn<E, U | Promise<U>>): Promise<U>;
}
type AsyncResult<T, E> = {
    /**
     * Works similar to the {@link Result.map} method, except that this method
     * returns `AsyncResult` instead of `Result`.
     *
     * @see {@link Result.map} for details.
     */
    map<U>(f: Fn<T, U>): AsyncResult<U, E>;
    /**
     * Works the same as the {@link Result.asyncMap}.
     *
     * @see {@link Result.asyncMap} for details.
     */
    asyncMap<U>(f: Fn<T, Promise<U>>): AsyncResult<U, E>;
    /**
     * Works similar to the {@link Result.mapErr} method, except that this method
     * returns `AsyncResult` instead of `Result`.
     *
     * @see {@link Result.mapErr} for details.
     */
    mapErr<F>(f: Fn<E, F>): AsyncResult<T, F>;
    /**
     * Works the same as the {@link Result.asyncMapErr}.
     *
     * @see {@link Result.asyncMapErr} for details.
     */
    asyncMapErr<F>(f: Fn<E, Promise<F>>): AsyncResult<T, F>;
    /**
     * Works similar to the {@link Result.mapOr} method, except that this method
     * returns `Promise`.
     *
     * @see {@link Result.mapOr} for details.
     */
    mapOr<U>(value: U, f: Fn<T, U>): Promise<U>;
    /**
     * Works the same as the {@link Result.asyncMapOr}.
     *
     * @see {@link Result.asyncMapOr} for details.
     */
    asyncMapOr<U>(value: U, f: Fn<T, Promise<U>>): Promise<U>;
    /**
     * Works similar to the {@link Result.mapOrElse} method, except that this
     * method returns `Promise`.
     *
     * @see {@link Result.mapOrElse} for details.
     */
    mapOrElse<U>(fallbackFn: Fn<E, U>, f: Fn<T, U>): Promise<U>;
    /**
     * Works similar to the {@link Result.asyncMapOrElse} method, except that this
     * method returns `Promise`.
     *
     * @see {@link Result.asyncMapOrElse} for details.
     */
    asyncMapOrElse<U>(fallbackFn: Fn<E, U | Promise<U>>, f: Fn<T, U | Promise<U>>): Promise<U>;
    /**
     * Works similar to the {@link Result.inspect} method, except that this
     * method returns `AsyncResult` instead of `Result`.
     *
     * @see {@link Result.inspect} for details.
     */
    inspect(f: Fn<T, void>): AsyncResult<T, E>;
    /**
     * Works similar to the {@link Result.inspectErr} method, except that this
     * method returns `AsyncResult` instead of `Result`.
     *
     * @see {@link Result.inspectErr} for details.
     */
    inspectErr(f: Fn<E, void>): AsyncResult<T, E>;
    /**
     * Works similar to the {@link Result.expect} method, except that this method
     * returns `Promise`.
     *
     * @see {@link Result.expect} for details.
     */
    expect(msg: string): Promise<T>;
    /**
     * Works similar to the {@link Result.unwrap} method, except that this method
     * returns `Promise`.
     *
     * @see {@link Result.unwrap} for details.
     */
    unwrap(): Promise<T>;
    /**
     * Works similar to the {@link Result.expectErr} method, except that this
     * method returns `Promise`.
     *
     * @see {@link Result.expectErr} for details.
     */
    expectErr(msg: string): Promise<E>;
    /**
     * Works similar to the {@link Result.unwrapErr} method, except that this
     * method returns `Promise`.
     *
     * @see {@link Result.unwrapErr} for details.
     */
    unwrapErr(): Promise<E>;
    /**
     * Works similar to the {@link Result.and} method, except that this method
     * returns `AsyncResult` instead of `Result`.
     *
     * @see {@link Result.and} for details.
     */
    and<U>(res: Result<U, E>): AsyncResult<U, E>;
    /**
     * Works similar to the {@link Result.andThen} method, except that this
     * method returns `AsyncResult` instead of `Result`.
     *
     * @see {@link Result.andThen} for details.
     */
    andThen<U>(f: Fn<T, Result<U, E>>): AsyncResult<U, E>;
    /**
     * Works the same as the {@link Result.asyncAndThen}.
     *
     * @see {@link Result.asyncAndThen} for details.
     */
    asyncAndThen<U>(f: Fn<T, Promise<Result<U, E>>>): AsyncResult<U, E>;
    /**
     * Works similar to the {@link Result.or} method, except that this method
     * returns `AsyncResult` instead of `Result`.
     *
     * @see {@link Result.or} for details.
     */
    or<F>(res: Result<T, F>): AsyncResult<T, F>;
    /**
     * Works similar to the {@link Result.orElse} method, except that this method
     * returns `AsyncResult` instead of `Result`.
     *
     * @see {@link Result.orElse} for details.
     */
    orElse<F>(f: Fn<E, Result<T, F>>): AsyncResult<T, F>;
    /**
     * Works the same as the {@link Result.asyncOrElse}.
     *
     * @see {@link Result.asyncOrElse} for details.
     */
    asyncOrElse<F>(f: Fn<E, Promise<Result<T, F>>>): AsyncResult<T, F>;
    /**
     * Works similar to the {@link Result.unwrapOr} method, except that this
     * method returns `Promise`.
     *
     * @see {@link Result.unwrapOr} for details.
     */
    unwrapOr(value: T): Promise<T>;
    /**
     * Works similar to the {@link Result.unwrapOrElse} method, except that this
     * method returns `Promise`.
     *
     * @see {@link Result.unwrapOrElse} for details.
     */
    unwrapOrElse(f: Fn<E, T>): Promise<T>;
    /**
     * Works the same as the {@link Result.asyncUnwrapOrElse}.
     *
     * @see {@link Result.asyncUnwrapOrElse} for details.
     */
    asyncUnwrapOrElse(f: Fn<E, Promise<T>>): Promise<T>;
    /**
     * Works similar to the {@link Result.match} method, except that this method
     * returns `Promise`.
     *
     * @see {@link Result.match} for details.
     */
    match<U>(okFn: Fn<T, U>, errFn: Fn<E, U>): Promise<U>;
    /**
     * Works the same as the {@link Result.asyncMatch}.
     *
     * @see {@link Result.asyncMatch} for details.
     */
    asyncMatch<U>(okFn: Fn<T, U | Promise<U>>, errFn: Fn<E, U | Promise<U>>): Promise<U>;
} & Promise<Result<T, E>>;
declare class Ok<T, E> implements Result<T, E> {
    readonly value: T;
    private __internal_resulto;
    constructor(value: T);
    isOk(): this is Ok<T, E>;
    isOkAnd(f: Predicate<T>): boolean;
    isErr(): this is Err<T, E>;
    isErrAnd(): boolean;
    map<U>(f: Fn<T, U>): Result<U, E>;
    asyncMap<U>(f: Fn<T, Promise<U>>): AsyncResult<U, E>;
    mapOr<U>(_: U, f: Fn<T, U>): U;
    asyncMapOr<U>(_: U, f: Fn<T, Promise<U>>): Promise<U>;
    mapOrElse<U>(_: Fn<E, U>, f: Fn<T, U>): U;
    asyncMapOrElse<U>(_: Fn<E, U | Promise<U>>, f: Fn<T, U | Promise<U>>): Promise<U>;
    mapErr<F>(): Result<T, F>;
    asyncMapErr<F>(): AsyncResult<T, F>;
    inspect(f: Fn<T, void>): Result<T, E>;
    inspectErr(): Result<T, E>;
    expect(): T;
    unwrap(): T;
    expectErr(msg: string): never;
    unwrapErr(): never;
    and<U>(res: Result<U, E>): Result<U, E>;
    andThen<U>(f: Fn<T, Result<U, E>>): Result<U, E>;
    asyncAndThen<U>(f: Fn<T, Promise<Result<U, E>>>): AsyncResult<U, E>;
    or<F>(): Result<T, F>;
    orElse<F>(): Result<T, F>;
    asyncOrElse<F>(): AsyncResult<T, F>;
    unwrapOr(): T;
    unwrapOrElse(): T;
    asyncUnwrapOrElse(): Promise<T>;
    match<U>(okFn: Fn<T, U>): U;
    asyncMatch<U>(okFn: Fn<T, U | Promise<U>>): Promise<U>;
}
declare class Err<T, E> implements Result<T, E> {
    readonly error: E;
    private __internal_resulto;
    constructor(error: E);
    isOk(): this is Ok<T, E>;
    isOkAnd(): boolean;
    isErr(): this is Err<T, E>;
    isErrAnd(f: Predicate<E>): boolean;
    map<U>(): Result<U, E>;
    asyncMap<U>(): AsyncResult<U, E>;
    mapOr<U>(value: U): U;
    asyncMapOr<U>(value: U): Promise<U>;
    mapOrElse<U>(fallback: Fn<E, U>): U;
    asyncMapOrElse<U>(fallbackFn: Fn<E, U | Promise<U>>): Promise<U>;
    mapErr<F>(f: Fn<E, F>): Result<T, F>;
    asyncMapErr<F>(f: Fn<E, Promise<F>>): AsyncResult<T, F>;
    inspect(): Result<T, E>;
    inspectErr(f: Fn<E, void>): Result<T, E>;
    expect(msg: string): never;
    unwrap(): never;
    expectErr(): E;
    unwrapErr(): E;
    and<U>(): Result<U, E>;
    andThen<U>(): Result<U, E>;
    asyncAndThen<U>(): AsyncResult<U, E>;
    or<F>(res: Result<T, F>): Result<T, F>;
    orElse<F>(f: Fn<E, Result<T, F>>): Result<T, F>;
    asyncOrElse<F>(f: Fn<E, Promise<Result<T, F>>>): AsyncResult<T, F>;
    unwrapOr(value: T): T;
    unwrapOrElse(f: Fn<E, T>): T;
    asyncUnwrapOrElse(f: Fn<E, Promise<T>>): Promise<T>;
    match<U>(_: Fn<T, U>, errFn: Fn<E, U>): U;
    asyncMatch<U>(_: Fn<T, U | Promise<U>>, errFn: Fn<E, U | Promise<U>>): Promise<U>;
}
/**
 * Creates an `Ok` version of `Result`.
 */
declare function ok<T = unknown, E = never>(value: T): Ok<T, E>;
/**
 * Creates an `Ok` version of `AsyncResult`.
 */
declare function okAsync<T = unknown, E = never>(value: T | Promise<T>): any;
/**
 * Creates an `Err` version of `Result`.
 */
declare function err<T = never, E = unknown>(error: E): Err<T, E>;
/**
 * Creates an `Err` version of `AsyncResult`.
 */
declare function errAsync<T = unknown, E = never>(error: E | Promise<E>): any;
/**
 * Accepts a promise and returns an `AsyncResult` containing either `Ok` with
 * the resolved value or `Err` with the rejected error.
 *
 * You can optionally pass `errorFn` as the second argument to map rejected
 * error from `unknown` to `E`.
 */
declare function fromPromise<T, E>(promise: Promise<T>, errorFn?: Fn<unknown, E>): AsyncResult<T, E>;
/**
 * Accepts a function `f` that may throw, and returns `Result` containing
 * either `Ok` with the value returned from `f` or `Err` with the thrown error.
 *
 * You can optionally pass `errorFn` as the second argument to map the thrown
 * error from `unknown` to `E`.
 */
declare function fromThrowable<T, E>(f: Fn<void, T>, errorFn?: Fn<unknown, E>): Result<T, E>;

export { AsyncResult, Result, ResultError, err, errAsync, fromPromise, fromThrowable, ok, okAsync };
