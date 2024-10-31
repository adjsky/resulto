import { chain } from "./chain.js";

export type Predicate<T> = (value: T) => boolean;
export type ErrPredicate<T> = (error: T) => boolean;

export type Fn<T, U> = (value: T) => U;
export type ErrFn<E, F> = (error: E) => F;

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

export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

export class ResultError extends Error {
	data: unknown;

	constructor(message: string, data: unknown) {
		super(message);

		this.data = data;
	}
}

export interface ResultDeclarations<T, E> {
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
	isErrAnd(f: ErrPredicate<E>): boolean;

	/**
	 * Maps a `Result<T, E>` to `Result<U, E>` by applying a function `f` to a
	 * contained `Ok` value, leaving an `Err` value untouched.
	 *
	 * This function can be used to compose the results of two functions.
	 */
	map<U>(f: Fn<T, U>): Result<U, E>;

	/**
	 * Maps an `AsyncResult<T, E>` to `AsyncResult<U, E>` by applying a function
	 * `f` to a contained `Ok` value, leaving an `Err` value untouched.
	 *
	 * This function can be used to compose the results of two functions.
	 *
	 * Use this method instead of {@link ResultDeclarations.map} when the provided
	 * `f` returns promise.
	 */
	asyncMap<U>(f: Fn<T, Promise<U>>): AsyncResult<U, E>;

	/**
	 * Returns the provided `value` (if `Err`), or applies a function to the
	 * contained value (if `Ok`).
	 */
	mapOr<U>(value: U, f: Fn<T, U>): U;

	/**
	 * Returns the provided `value` (if `Err`), or applies a function to the
	 * contained value (if `Ok`).
	 *
	 * Use this method instead of {@link ResultDeclarations.mapOr} when the
	 * provided `f` returns promise.
	 */
	asyncMapOr<U>(value: U, f: Fn<T, Promise<U>>): Promise<U>;

	/**
	 * Maps a `Result<T, E>` to `U` by applying function `fallbackFn` to a
	 * contained `Err` value, or function `f` to a contained `Ok` value.
	 *
	 * This function can be used to unpack a successful result while handling an
	 * error.
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
	 * Use this method instead of {@link ResultDeclarations.mapOrElse} when the
	 * provided `fallbackFn` or `f` return promise.
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
	 */
	mapErr<F>(f: ErrFn<E, F>): Result<T, F>;

	/**
	 * Maps an `AsyncResult<T, E>` to `AsyncResult<T, F>` by applying a function
	 * to a contained `Err` value, leaving an `Ok` value untouched.
	 *
	 * This function can be used to pass through a successful result while
	 * handling an error.
	 *
	 * Use this method instead of {@link ResultDeclarations.mapErr} when the
	 * provided `f` returns promise.
	 */
	asyncMapErr<F>(f: ErrFn<E, Promise<F>>): AsyncResult<T, F>;

	/**
	 * Calls the provided function `f` with the contained value (if `Ok`).
	 */
	inspect(f: Fn<T, void>): Result<T, E>;

	/**
	 * Calls the provided function `f` with the contained error (if `Err`).
	 */
	inspectErr(f: ErrFn<E, void>): Result<T, E>;

	/**
	 * Performs a side effect on the contained value (if `Ok`).
	 *
	 * NOTE: `f` is awaited.
	 */
	tap(f: Fn<T, Promise<void>>): AsyncResult<T, E>;

	/**
	 * Performs a side effect on the contained error (if `Err`).
	 *
	 * NOTE: `f` is awaited.
	 */
	tapErr(f: Fn<E, Promise<void>>): AsyncResult<T, E>;

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
	andThen<U, F>(f: Fn<T, Result<U, F>>): Result<U, E | F>;

	/**
	 * Calls `f` if the result is `Ok`, otherwise returns the `Err` value.
	 *
	 * This function can be used for control flow based on `AsyncResult` values.
	 *
	 * Use this method instead of {@link ResultDeclarations.andThen} when the
	 * provided `f` returns promise.
	 */
	asyncAndThen<U, F>(f: Fn<T, Promise<Result<U, F>>>): AsyncResult<U, E | F>;

	/**
	 * Returns `res` if the result is `Err`, otherwise returns the `Ok` value.
	 */
	or<F>(res: Result<T, F>): Result<T, F>;

	/**
	 * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
	 *
	 * This function can be used for control flow based on `Result` values.
	 */
	orElse<U, F>(f: ErrFn<E, Result<U, F>>): Result<U | T, F>;

	/**
	 * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
	 *
	 * This function can be used for control flow based on `AsyncResult` values.
	 *
	 * Use this method instead of {@link ResultDeclarations.orElse} when the
	 * provided `f` returns promise.
	 */
	asyncOrElse<U, F>(
		f: ErrFn<E, Promise<Result<U, F>>>,
	): AsyncResult<U | T, F>;

	/**
	 * Returns the contained `Ok` value or a provided `value`.
	 */
	unwrapOr<U>(value: U): U | T;

	/**
	 * Returns the contained `Ok `value or computes it from a `f`.
	 */
	unwrapOrElse<U>(f: ErrFn<E, U>): U | T;

	/**
	 * Returns the contained `Ok `value or computes it from a `f`.
	 *
	 * Use this method instead of {@link ResultDeclarations.unwrapOrElse} when the
	 * provided `f` returns promise.
	 */
	asyncUnwrapOrElse<U>(f: ErrFn<E, Promise<U>>): Promise<U | T>;

	/**
	 * Calls `okFn` if the result is `Ok`, otherwise calls `errFn`.
	 *
	 * Both `okFn` and `errFn` must have the same return type.
	 */
	match<U>(okFn: Fn<T, U>, errFn: ErrFn<E, U>): U;

	/**
	 * Calls `okFn` if the result is `Ok`, otherwise calls `errFn`.
	 *
	 * Both `okFn` and `errFn` must have the same return type.
	 *
	 * Use this method instead of {@link ResultDeclarations.match} when the
	 * provided `okFn` or `errFn` return promise.
	 */
	asyncMatch<U>(
		okFn: Fn<T, U | Promise<U>>,
		errFn: ErrFn<E, U | Promise<U>>,
	): Promise<U>;
}

/**
 * Result is a type that represents either success `Ok` or failure `Err`.
 *
 * Typically it is used for returning and propagating errors. Functions should
 * return `Result` whenever errors are expected and recoverable instead of
 * throwing errors.
 */
export type Result<T, E> = Ok<T, E> | Err<T, E>;

/**
 * Async version of `Result`.
 *
 * In fact this is just a regular `Result` wrapped in a proxy to allow chaining
 * promises without using `await` on every call.
 *
 * @augments ResultDeclarations
 */
export type AsyncResult<T, E> = {
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
	 */
	map<U>(f: Fn<T, U>): AsyncResult<U, E>;

	/**
	 * Maps an `AsyncResult<T, E>` to `AsyncResult<U, E>` by applying a function
	 * `f` to a contained `Ok` value, leaving an `Err` value untouched.
	 *
	 * This function can be used to compose the results of two functions.
	 *
	 * Use this method instead of {@link AsyncResult.map} when the provided `f`
	 * returns promise.
	 */
	asyncMap<U>(f: Fn<T, Promise<U>>): AsyncResult<U, E>;

	/**
	 * Maps an `AsyncResult<T, E>` to `AsyncResult<T, F>` by applying a function
	 * to a contained `Err` value, leaving an `Ok` value untouched.
	 *
	 * This function can be used to pass through a successful result while
	 * handling an error.
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
	 * returns promise.
	 */
	asyncMapErr<F>(f: ErrFn<E, Promise<F>>): AsyncResult<T, F>;

	/**
	 * Returns the provided `value` (if `Err`), or applies a function to the
	 * contained value (if `Ok`).
	 */
	mapOr<U>(value: U, f: Fn<T, U>): Promise<U>;

	/**
	 * Returns the provided `value` (if `Err`), or applies a function to the
	 * contained value (if `Ok`).
	 *
	 * Use this method instead of {@link AsyncResult.mapOr} when the provided `f`
	 * returns promise.
	 */
	asyncMapOr<U>(value: U, f: Fn<T, Promise<U>>): Promise<U>;

	/**
	 * Maps an `AsyncResult<T, E>` to `Promise<U>` by applying function
	 * `fallbackFn` to a contained `Err` value, or function `f` to a contained
	 * `Ok` value.
	 *
	 * This function can be used to unpack a successful result while handling an
	 * error.
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
	 */
	asyncMapOrElse<U>(
		fallbackFn: ErrFn<E, U | Promise<U>>,
		f: Fn<T, U | Promise<U>>,
	): Promise<U>;

	/**
	 * Calls the provided function `f` with the contained value (if `Ok`).
	 */
	inspect(f: Fn<T, void>): AsyncResult<T, E>;

	/**
	 * Calls the provided function `f` with the contained error (if `Err`).
	 */
	inspectErr(f: ErrFn<E, void>): AsyncResult<T, E>;

	/**
	 * Performs a side effect on the contained value (if `Ok`).
	 *
	 * NOTE: `f` is awaited.
	 */
	tap(f: Fn<T, Promise<void>>): AsyncResult<T, E>;

	/**
	 * Performs a side effect on the contained error (if `Err`).
	 *
	 * NOTE: `f` is awaited.
	 */
	tapErr(f: Fn<E, Promise<void>>): AsyncResult<T, E>;

	/**
	 * Returns the contained `Ok` value.
	 *
	 * This function may throw `UnwrapError` (if `Err`).
	 */
	expect(msg: string): Promise<T>;

	/**
	 * Returns the contained `Ok` value.
	 *
	 * This function may throw `UnwrapError` (if `Err`).
	 */
	unwrap(): Promise<T>;

	/**
	 * Returns the contained `Err` value.
	 *
	 * This function may throw `UnwrapError` (if `Ok`).
	 */
	expectErr(msg: string): Promise<E>;

	/**
	 * Returns the contained `Err` value.
	 *
	 * This function may throw `UnwrapError` (if `Ok`).
	 */
	unwrapErr(): Promise<E>;

	/**
	 * Returns `res` if the result is `Ok`, otherwise returns the `Err` value.
	 */
	and<U>(res: Result<U, E>): AsyncResult<U, E>;

	/**
	 * Calls `f` if the result is `Ok`, otherwise returns the `Err` value.
	 *
	 * This function can be used for control flow based on `AsyncResult` values.
	 */
	andThen<U, F>(f: Fn<T, Result<U, F>>): AsyncResult<U, E | F>;

	/**
	 * Calls `f` if the result is `Ok`, otherwise returns the `Err` value.
	 *
	 * This function can be used for control flow based on `AsyncResult` values.
	 *
	 * Use this method instead of {@link AsyncResult.andThen} when the provided
	 * `f` returns promise.
	 */
	asyncAndThen<U, F>(f: Fn<T, Promise<Result<U, F>>>): AsyncResult<U, E | F>;

	/**
	 * Returns `res` if the result is `Err`, otherwise returns the `Ok` value.
	 */
	or<F>(res: Result<T, F>): AsyncResult<T, F>;

	/**
	 * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
	 *
	 * This function can be used for control flow based on `AsyncResult` values.
	 */
	orElse<U, F>(f: ErrFn<E, Result<U, F>>): AsyncResult<U | T, F>;

	/**
	 * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
	 *
	 * This function can be used for control flow based on `AsyncResult` values.
	 *
	 * Use this method instead of {@link AsyncResult.orElse} when the provided `f`
	 * returns promise.
	 */
	asyncOrElse<U, F>(
		f: ErrFn<E, Promise<Result<U, F>>>,
	): AsyncResult<U | T, F>;

	/**
	 * Returns the contained `Ok` value or a provided `value`.
	 */
	unwrapOr<U>(value: U): Promise<U | T>;

	/**
	 * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
	 *
	 * This function can be used for control flow based on `AsyncResult` values.
	 *
	 * Use this method instead of {@link AsyncResult.orElse} when the provided `f`
	 * returns promise.
	 */
	unwrapOrElse<U>(f: ErrFn<E, U>): Promise<U | T>;

	/**
	 * Returns the contained `Ok `value or computes it from a `f`.
	 *
	 * Use this method instead of {@link AsyncResult.unwrapOrElse} when the
	 * provided `f` returns promise.
	 */
	asyncUnwrapOrElse<U>(f: ErrFn<E, Promise<U>>): Promise<U | T>;

	/**
	 * Calls `okFn` if the result is `Ok`, otherwise calls `errFn`.
	 *
	 * Both `okFn` and `errFn` must have the same return type.
	 */
	match<U>(okFn: Fn<T, U>, errFn: ErrFn<E, U>): Promise<U>;

	/**
	 * Calls `okFn` if the result is `Ok`, otherwise calls `errFn`.
	 *
	 * Both `okFn` and `errFn` must have the same return type.
	 *
	 * Use this method instead of {@link AsyncResult.match} when the provided
	 * `okFn` or `errFn` return promise.
	 */
	asyncMatch<U>(
		okFn: Fn<T, U | Promise<U>>,
		errFn: ErrFn<E, U | Promise<U>>,
	): Promise<U>;
} & Promise<Result<T, E>>;

export class Ok<T, E> implements ResultDeclarations<T, E> {
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
		throw new ResultError(msg, this.value);
	}

	unwrapErr(): never {
		throw new ResultError("Called `unwrapErr` on `Ok`", this.value);
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

export class Err<T, E> implements ResultDeclarations<T, E> {
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
		throw new ResultError(msg, this.error);
	}

	unwrap(): never {
		throw new ResultError("Called `unwrap` on `Err`", this.error);
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
export function errAsync<T = unknown, E = never>(
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
 */
export function fromPromise<T, E>(
	promise: Promise<T>,
	errorFn?: ErrFn<unknown, E>,
): AsyncResult<T, E> {
	return chain(promise.then(ok).catch((e) => err(errorFn ? errorFn(e) : e)));
}

/**
 * Same as `fromPromise` except that it does not handle the rejection of the
 * promise.
 *
 * **Ensure you know what you're doing, otherwise a thrown exception within this
 * promise will cause `AsyncResult` to reject.**
 */
export function fromSafePromise<T>(promise: Promise<T>): AsyncResult<T, never> {
	return chain(promise.then(ok));
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
	errorFn?: ErrFn<unknown, E>,
): Result<T, E> {
	try {
		return ok(f());
	} catch (e) {
		return err(errorFn ? errorFn(e) : (e as E));
	}
}

/**
 * Accepts an array of `Results` and returns a `Result`.
 *
 * If each `Result` in the provided array is `Ok`, then the returned `Result`
 * will contain an array of `Ok` values, otherwise the returned `Result` will
 * contain the first `Err` error.
 */
export function combine<T extends readonly Result<unknown, unknown>[]>(
	results: [...T],
): Result<UnwrapOks<T>, UnwrapErrs<T>[number]> {
	const unwrapped = [] as Mutable<UnwrapOks<T>>;

	for (const result of results) {
		if (result.isErr()) {
			return err(result.error as UnwrapErrs<T>[number]);
		}

		unwrapped.push(result.value);
	}

	return ok(unwrapped);
}

/**
 * Accepts an array of `Results` and `AsyncResults` and returns an `AsyncResult`.
 *
 * If each `Result` and `AsyncResult` in the provided array is `Ok`, then the
 * returned `AsyncResult` will contain an array of `Ok` values, otherwise the
 * returned `AsyncResult` will contain the first `Err` error.
 */
export function combineAsync<
	T extends readonly (
		| Result<unknown, unknown>
		| AsyncResult<unknown, unknown>
	)[],
>(results: [...T]): AsyncResult<UnwrapOks<T>, UnwrapErrs<T>[number]> {
	return chain(Promise.all(results).then(combine));
}
