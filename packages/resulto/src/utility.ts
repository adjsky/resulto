import type { AsyncResult, Result } from "./result"

export type Predicate<T> = (value: T) => boolean

export type ErrPredicate<T> = (error: T) => boolean

export type Fn<T, U> = (value: T) => U

export type ErrFn<E, F> = (error: E) => F

export type UnwrapOks<
  T extends readonly (
    | Result<unknown, unknown>
    | AsyncResult<unknown, unknown>
  )[]
> = {
  [i in keyof T]: T[i] extends Result<infer U, unknown>
    ? U
    : T[i] extends AsyncResult<infer U, unknown>
    ? U
    : never
}

export type UnwrapErrs<
  T extends readonly (
    | Result<unknown, unknown>
    | AsyncResult<unknown, unknown>
  )[]
> = {
  [i in keyof T]: T[i] extends Result<unknown, infer U>
    ? U
    : T[i] extends AsyncResult<unknown, infer U>
    ? U
    : never
}

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

export class ResultError extends Error {
  data: unknown

  constructor(message: string, data: unknown) {
    super(message)

    this.data = data
  }
}
