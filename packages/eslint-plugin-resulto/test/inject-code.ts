import { trimLeadingIndent } from "../src/utility/trim-leading-indent"

export function injectCode(code: string) {
  return `
interface Result<T, E> {
  chain(): Result<T, E>

  match<U>(okFn: (value: T) => U, errFn: (error: E) => U): U

  asyncMatch<U>(
    okFn: (value: T) => U | Promise<U>,
    errFn: (error: E) => U | Promise<U>
  ): Promise<U>
}

type AsyncResult<T, E> = {
  chain(): AsyncResult<T, E>

  match<U>(okFn: (value: T) => U, errFn: (error: E) => U): Promise<U>

  asyncMatch<U>(
    okFn: (value: T) => U | Promise<U>,
    errFn: (error: E) => U | Promise<U>
  ): Promise<U>
} & Promise<Result<T, E>>

declare function ok<T = unknown, E = never>(value: T): Result<T, E>

declare function okAsync<T = unknown, E = never>(value: T): AsyncResult<T, E>

declare function err<T = never, E = unknown>(error: E): Result<T, E>

declare function errAsync<T = never, E = unknown>(error: E): AsyncResult<T, E> 

declare class Ok<T, E> implements Result<T, E> {}

declare class Err<T, E> implements Result<T, E> {}

import { ok, err } from "resulto"

declare function noop(): void

declare function getOk(): Result<unknown, never>

declare function getErr(): Result<never, unknown>

declare function getAsyncOk(): AsyncResult<unknown, never>

declare function getAsyncErr(): AsyncResult<never, unknown>

declare function asyncGetOk(): Promise<Result<unknown, never>>

declare function asyncGetErr(): Promise<Result<never, unknown>>

declare function asyncGetAsyncOk(): Promise<AsyncResult<unknown, never>>

declare function asyncGetAsyncErr(): Promise<AsyncResult<never, unknown>>

${trimLeadingIndent(code)}
`
}
